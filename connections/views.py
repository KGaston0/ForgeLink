from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import NodeConnection
from .serializers import NodeConnectionSerializer


class NodeConnectionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for NodeConnection model
    Provides CRUD operations for node connections
    """
    queryset = NodeConnection.objects.all()
    serializer_class = NodeConnectionSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['project', 'source_node', 'target_node', 'connection_type']
    ordering_fields = ['created_at']
    ordering = ['-created_at']