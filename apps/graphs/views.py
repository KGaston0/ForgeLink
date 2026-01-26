from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from apps.connections.serializers import NodeConnectionSerializer
from .models import Graph, GraphNode
from .serializers import GraphSerializer, GraphNodeSerializer


class GraphViewSet(viewsets.ModelViewSet):
    serializer_class = GraphSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['project']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'updated_at', 'name']
    ordering = ['-updated_at']

    def get_queryset(self):
        user = getattr(self.request, 'user', None)
        if not user or not user.is_authenticated:
            return Graph.objects.none()
        return Graph.objects.filter(project__owner=user)

    @action(detail=True, methods=['get'])
    def canvas(self, request, pk=None):
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
