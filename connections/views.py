from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import NodeConnection, ConnectionType
from .serializers import NodeConnectionSerializer
from .connection_types_serializers import ConnectionTypeSerializer


class ConnectionTypeViewSet(viewsets.ModelViewSet):
    """CRUD for connection types at Project level."""

    serializer_class = ConnectionTypeSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['project']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'name']
    ordering = ['name']

    def get_queryset(self):
        user = getattr(self.request, 'user', None)
        if not user or not user.is_authenticated:
            return ConnectionType.objects.none()
        return ConnectionType.objects.filter(project__owner=user)


class NodeConnectionViewSet(viewsets.ModelViewSet):
    """ViewSet for NodeConnection model."""

    serializer_class = NodeConnectionSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['graph', 'source_node', 'target_node', 'connection_type']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        user = getattr(self.request, 'user', None)
        if not user or not user.is_authenticated:
            return NodeConnection.objects.none()
        return (
            NodeConnection.objects
            .filter(graph__project__owner=user)
            .select_related('graph', 'source_node', 'target_node', 'connection_type')
            .prefetch_related('graph__graph_nodes')
        )
