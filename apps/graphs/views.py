import logging

from django.db import transaction
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from apps.connections.models import NodeConnection
from apps.connections.serializers import NodeConnectionSerializer
from apps.nodes.models import Node
from .models import Graph, GraphNode
from .serializers import GraphSerializer, GraphNodeSerializer

logger = logging.getLogger(__name__)


class GraphViewSet(viewsets.ModelViewSet):
    serializer_class = GraphSerializer
    lookup_field = 'uuid'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['project', 'project__uuid']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'updated_at', 'name']
    ordering = ['-updated_at']

    def get_queryset(self):
        user = getattr(self.request, 'user', None)
        if not user or not user.is_authenticated:
            return Graph.objects.none()
        return Graph.objects.filter(project__owner=user)

    @action(detail=True, methods=['get'])
    def canvas(self, request, uuid=None):
        """Returns nodes (with layout) and connections for the graph in a single response."""
        graph = self.get_object()

        graph_nodes = graph.graph_nodes.select_related('node').all()
        connections = graph.connections.select_related(
            'source_node', 'target_node', 'connection_type'
        ).all()

        return Response({
            'graph': GraphSerializer(graph).data,
            'nodes': GraphNodeSerializer(graph_nodes, many=True).data,
            'connections': NodeConnectionSerializer(connections, many=True).data,
        })

    @action(detail=True, methods=['put'], url_path='canvas/bulk')
    def canvas_bulk(self, request, uuid=None):
        """
        Bulk create/update nodes and connections for a graph canvas.

        Expects JSON:
        {
            "nodes": [
                {
                    "temp_id": "temp-123",           // Frontend temp ID (for new nodes)
                    "graph_node_id": null | int,      // null = create, int = update
                    "node_id": null | int,            // Existing Node entity ID
                    "node_type": "character",
                    "label": "My Node",
                    "position_x": 100.0,
                    "position_y": 200.0,
                    "is_frame": false,
                    "width": 160,
                    "height": 80,
                    "parent_node": null | "temp-456" | "gn-7",
                    "custom_properties": {}
                },
                ...
            ],
            "connections": [
                {
                    "connection_id": null | int,      // null = create, int = update
                    "source_temp_id": "gn-1",         // Frontend node ID (gn-X or temp-X)
                    "target_temp_id": "gn-2",
                    "connection_type_id": 1,
                    "label": "",
                    "direction": "forward",
                    "source_handle_position": null,
                    "target_handle_position": null
                },
                ...
            ]
        }

        Uses transaction.atomic + bulk_create/bulk_update for performance.
        Returns created node mappings so frontend can reconcile temp IDs.
        """
        graph = self.get_object()
        project = graph.project
        user = request.user

        # Verify ownership
        if project.owner != user:
            return Response(
                {'detail': 'You do not own this project.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        nodes_data = request.data.get('nodes', [])
        connections_data = request.data.get('connections', [])

        try:
            with transaction.atomic():
                node_results = self._process_nodes_bulk(graph, project, nodes_data)
                connection_results = self._process_connections_bulk(
                    graph, project, connections_data, node_results['temp_id_map'],
                )
        except Exception as e:
            logger.exception('Bulk canvas save failed for graph %s', pk)
            return Response(
                {'detail': 'Bulk save failed due to an internal error.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({
            'nodes': {
                'created': node_results['created'],
                'updated_count': node_results['updated_count'],
            },
            'connections': {
                'created': connection_results['created'],
                'updated_count': connection_results['updated_count'],
            },
        }, status=status.HTTP_200_OK)

    # ------------------------------------------------------------------
    # Private helpers for bulk processing
    # ------------------------------------------------------------------

    @staticmethod
    def _process_nodes_bulk(graph, project, nodes_data):
        """
        Process all nodes: bulk_create new ones, bulk_update existing ones.
        Returns a dict with created info and a temp_id → node_id mapping.
        """
        nodes_to_create = []
        graph_nodes_to_create = []
        graph_nodes_to_update = []
        nodes_to_update = []

        # Collect existing GraphNodes in a single query for validation
        existing_gn_ids = set(
            graph.graph_nodes.values_list('id', flat=True)
        )

        # Separate new vs existing
        new_node_entries = []
        existing_node_entries = []

        for entry in nodes_data:
            gn_id = entry.get('graph_node_id')
            if gn_id and gn_id in existing_gn_ids:
                existing_node_entries.append(entry)
            else:
                new_node_entries.append(entry)

        # --- Phase 1: Create new Node entities in bulk ---
        for entry in new_node_entries:
            node = Node(
                project=project,
                title=entry.get('label', 'Untitled'),
                node_type=entry.get('node_type', 'note'),
                custom_properties=entry.get('custom_properties', {}),
            )
            nodes_to_create.append((entry, node))

        if nodes_to_create:
            created_nodes = Node.objects.bulk_create(
                [n for _, n in nodes_to_create]
            )
            # Reassign created objects (they now have IDs)
            for i, (entry, _) in enumerate(nodes_to_create):
                nodes_to_create[i] = (entry, created_nodes[i])

        # --- Phase 2: Create new GraphNode entities in bulk ---
        for entry, node in nodes_to_create:
            gn = GraphNode(
                graph=graph,
                node=node,
                position_x=entry.get('position_x', 0),
                position_y=entry.get('position_y', 0),
                color=entry.get('color', '#3B82F6'),
                is_frame=entry.get('is_frame', False),
                width=entry.get('width', 400 if entry.get('is_frame') else 160),
                height=entry.get('height', 300 if entry.get('is_frame') else 80),
                # parent_node resolved in Phase 4
            )
            graph_nodes_to_create.append((entry, gn))

        if graph_nodes_to_create:
            created_gns = GraphNode.objects.bulk_create(
                [gn for _, gn in graph_nodes_to_create]
            )
            for i, (entry, _) in enumerate(graph_nodes_to_create):
                graph_nodes_to_create[i] = (entry, created_gns[i])

        # Build temp_id → { node_id, graph_node_id } mapping
        temp_id_map = {}
        created_response = []

        for (entry, node), (_, gn) in zip(nodes_to_create, graph_nodes_to_create):
            temp_id = entry.get('temp_id', '')
            temp_id_map[temp_id] = {
                'node_id': node.id,
                'graph_node_id': gn.id,
            }
            created_response.append({
                'temp_id': temp_id,
                'node_id': node.id,
                'graph_node_id': gn.id,
            })

        # Also map existing gn-X IDs for connection resolution
        for entry in existing_node_entries:
            temp_id = entry.get('temp_id', '')
            temp_id_map[temp_id] = {
                'node_id': entry.get('node_id'),
                'graph_node_id': entry.get('graph_node_id'),
            }

        # --- Phase 3: Bulk update existing GraphNodes + Nodes ---
        if existing_node_entries:
            existing_gn_map = {
                gn.id: gn
                for gn in GraphNode.objects.filter(
                    id__in=[e['graph_node_id'] for e in existing_node_entries]
                ).select_related('node')
            }

            for entry in existing_node_entries:
                gn = existing_gn_map.get(entry['graph_node_id'])
                if not gn:
                    continue

                # Update GraphNode layout fields
                gn.position_x = entry.get('position_x', gn.position_x)
                gn.position_y = entry.get('position_y', gn.position_y)
                gn.is_frame = entry.get('is_frame', gn.is_frame)
                gn.width = entry.get('width', gn.width)
                gn.height = entry.get('height', gn.height)
                # parent_node resolved in Phase 4
                graph_nodes_to_update.append(gn)

                # Update Node semantic fields
                node_obj = gn.node
                label = entry.get('label')
                node_type = entry.get('node_type')
                custom_props = entry.get('custom_properties')

                changed = False
                if label is not None and label != node_obj.title:
                    node_obj.title = label
                    changed = True
                if node_type is not None and node_type != node_obj.node_type:
                    node_obj.node_type = node_type
                    changed = True
                if custom_props is not None and custom_props != node_obj.custom_properties:
                    node_obj.custom_properties = custom_props
                    changed = True

                if changed:
                    nodes_to_update.append(node_obj)

            if graph_nodes_to_update:
                GraphNode.objects.bulk_update(
                    graph_nodes_to_update,
                    ['position_x', 'position_y', 'is_frame', 'width', 'height'],
                )

            if nodes_to_update:
                Node.objects.bulk_update(
                    nodes_to_update,
                    ['title', 'node_type', 'custom_properties'],
                )

        # --- Phase 4: Resolve parent_node references ---
        parent_updates = []
        all_gn_entries = list(graph_nodes_to_create) + [
            (entry, gn)
            for entry in existing_node_entries
            for gn in [
                next(
                    (g for g in graph_nodes_to_update if g.id == entry['graph_node_id']),
                    None,
                )
            ]
            if gn is not None
        ]

        for entry, gn in all_gn_entries:
            parent_ref = entry.get('parent_node')
            if not parent_ref:
                if gn.parent_node_id is not None:
                    gn.parent_node_id = None
                    parent_updates.append(gn)
                continue

            # Resolve parent: could be "gn-X" (existing) or "temp-X" (just created)
            parent_mapping = temp_id_map.get(parent_ref)
            if parent_mapping:
                parent_gn_id = parent_mapping['graph_node_id']
                if gn.parent_node_id != parent_gn_id:
                    gn.parent_node_id = parent_gn_id
                    parent_updates.append(gn)

        if parent_updates:
            GraphNode.objects.bulk_update(parent_updates, ['parent_node_id'])

        return {
            'created': created_response,
            'updated_count': len(graph_nodes_to_update),
            'temp_id_map': temp_id_map,
        }

    @staticmethod
    def _process_connections_bulk(graph, project, connections_data, temp_id_map):
        """
        Process all connections: bulk_create new, bulk_update existing.
        Uses temp_id_map to resolve frontend node IDs to backend node IDs.
        """
        connections_to_create = []
        connections_to_update = []

        # Collect existing connection IDs for validation
        existing_conn_ids = set(
            graph.connections.values_list('id', flat=True)
        )

        for entry in connections_data:
            conn_id = entry.get('connection_id')

            # Resolve source/target node IDs from frontend temp IDs
            source_ref = entry.get('source_temp_id', '')
            target_ref = entry.get('target_temp_id', '')

            source_mapping = temp_id_map.get(source_ref, {})
            target_mapping = temp_id_map.get(target_ref, {})

            source_node_id = source_mapping.get('node_id')
            target_node_id = target_mapping.get('node_id')

            if not source_node_id or not target_node_id:
                logger.warning(
                    'Skipping connection: could not resolve source=%s or target=%s',
                    source_ref, target_ref,
                )
                continue

            if conn_id and conn_id in existing_conn_ids:
                # Update existing connection
                connections_to_update.append((entry, conn_id))
            else:
                # Create new connection
                conn_type_id = entry.get('connection_type_id')
                if not conn_type_id:
                    logger.warning('Skipping new connection: no connection_type_id')
                    continue

                connections_to_create.append(
                    NodeConnection(
                        graph=graph,
                        source_node_id=source_node_id,
                        target_node_id=target_node_id,
                        connection_type_id=conn_type_id,
                        label=entry.get('label', ''),
                        direction=entry.get('direction', 'forward'),
                        source_handle_position=entry.get('source_handle_position'),
                        target_handle_position=entry.get('target_handle_position'),
                    )
                )

        created_response = []
        if connections_to_create:
            # ignore_conflicts handles potential race conditions with unique_together
            created_conns = NodeConnection.objects.bulk_create(
                connections_to_create,
                ignore_conflicts=False,
            )
            created_response = [
                {'id': conn.id, 'source_node': conn.source_node_id, 'target_node': conn.target_node_id}
                for conn in created_conns
            ]

        # Bulk update existing connections
        if connections_to_update:
            existing_conn_map = {
                conn.id: conn
                for conn in NodeConnection.objects.filter(
                    id__in=[cid for _, cid in connections_to_update]
                )
            }

            update_objects = []
            for entry, conn_id in connections_to_update:
                conn = existing_conn_map.get(conn_id)
                if not conn:
                    continue

                conn.label = entry.get('label', conn.label)
                conn.direction = entry.get('direction', conn.direction)
                conn.source_handle_position = entry.get(
                    'source_handle_position', conn.source_handle_position
                )
                conn.target_handle_position = entry.get(
                    'target_handle_position', conn.target_handle_position
                )
                update_objects.append(conn)

            if update_objects:
                NodeConnection.objects.bulk_update(
                    update_objects,
                    ['label', 'direction', 'source_handle_position', 'target_handle_position'],
                )

        return {
            'created': created_response,
            'updated_count': len(connections_to_update),
        }


class GraphNodeViewSet(viewsets.ModelViewSet):
    serializer_class = GraphNodeSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['graph', 'node']
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-updated_at']

    def get_queryset(self):
        user = getattr(self.request, 'user', None)
        if not user or not user.is_authenticated:
            return GraphNode.objects.none()
        return GraphNode.objects.select_related('graph', 'node').filter(graph__project__owner=user)
