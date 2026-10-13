from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Node, NodeBlueprint, BlueprintList
from .serializers import (
    NodeSerializer,
    NodeDetailSerializer,
    NodeBlueprintSerializer,
    BlueprintListSerializer,
    BlueprintListWriteSerializer
)


class NodeBlueprintViewSet(viewsets.ModelViewSet):
    """
    ViewSet for NodeBlueprint model.
    
    Exposes template/blueprint endpoints for creating reusable node templates.
    Automatically sets creator to the authenticated user.
    
    Endpoints:
    - GET /api/blueprints/ - List all blueprints (owner-scoped)
    - POST /api/blueprints/ - Create new blueprint
    - GET /api/blueprints/{id}/ - Retrieve blueprint detail
    - PATCH /api/blueprints/{id}/ - Update blueprint
    - DELETE /api/blueprints/{id}/ - Delete blueprint
    """

    serializer_class = NodeBlueprintSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_frame', 'is_published']
    search_fields = ['name', 'description', 'category']
    ordering_fields = ['created_at', 'updated_at', 'name']
    ordering = ['-updated_at']

    def get_queryset(self):
        """
        Return only blueprints owned by the authenticated user.
        """
        user = getattr(self.request, 'user', None)
        if not user or not user.is_authenticated:
            return NodeBlueprint.objects.none()
        return NodeBlueprint.objects.filter(creator=user)

    def perform_create(self, serializer):
        """
        Automatically set the creator to the current authenticated user.
        """
        serializer.save(creator=self.request.user)


class BlueprintListViewSet(viewsets.ModelViewSet):
    """
    ViewSet for BlueprintList model.
    
    Exposes endpoints for managing collections/groups of NodeBlueprints.
    Automatically sets creator to the authenticated user.
    
    Endpoints:
    - GET /api/blueprint-lists/ - List all blueprint lists (owner-scoped)
    - POST /api/blueprint-lists/ - Create new blueprint list
    - GET /api/blueprint-lists/{id}/ - Retrieve list detail
    - PATCH /api/blueprint-lists/{id}/ - Update list
    - DELETE /api/blueprint-lists/{id}/ - Delete list
    """

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'updated_at', 'name']
    ordering = ['-updated_at']

    def get_serializer_class(self):
        """
        Return appropriate serializer based on action.
        
        Uses BlueprintListWriteSerializer for create/update to accept blueprint IDs.
        Uses BlueprintListSerializer for retrieve/list to show full blueprint details.
        """
        if self.action in ['create', 'update', 'partial_update']:
            return BlueprintListWriteSerializer
        return BlueprintListSerializer

    def get_queryset(self):
        """
        Return only blueprint lists owned by the authenticated user.
        """
        user = getattr(self.request, 'user', None)
        if not user or not user.is_authenticated:
            return BlueprintList.objects.none()
        return BlueprintList.objects.filter(creator=user)

    def perform_create(self, serializer):
        """
        Automatically set the creator to the current authenticated user.
        """
        serializer.save(creator=self.request.user)


class NodeViewSet(viewsets.ModelViewSet):
    """ViewSet for Node model."""

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    # Allow filtering nodes by project and also by graph membership
    filterset_fields = ['project', 'node_type', 'parent_node', 'blueprint', 'graph_nodes__graph']

    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'updated_at', 'title']
    ordering = ['-updated_at']

    def get_serializer_class(self):
        """
        Return detailed serializer for retrieve action, standard serializer otherwise.
        """
        if self.action == 'retrieve':
            return NodeDetailSerializer
        return NodeSerializer

    def get_queryset(self):
        user = getattr(self.request, 'user', None)
        if not user or not user.is_authenticated:
            return Node.objects.none()
        return Node.objects.filter(project__owner=user)

    @action(detail=True, methods=['get'])
    def children(self, request, pk=None):
        node = self.get_object()
        children = node.child_nodes.all()
        serializer = NodeSerializer(children, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def connections(self, request, pk=None):
        from apps.connections.serializers import NodeConnectionSerializer

        node = self.get_object()
        outgoing = node.outgoing_connections.all()
        incoming = node.incoming_connections.all()

        all_connections = list(outgoing) + list(incoming)
        serializer = NodeConnectionSerializer(all_connections, many=True)
        return Response(serializer.data)