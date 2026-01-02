from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Node
from .serializers import NodeSerializer


class NodeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Node model
    Provides CRUD operations for nodes
    """
    queryset = Node.objects.all()
    serializer_class = NodeSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['project', 'node_type', 'parent_node']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'updated_at', 'title']
    ordering = ['-updated_at']

    @action(detail=True, methods=['get'])
    def children(self, request, pk=None):
        """
        Get all child nodes for a specific node
        """
        node = self.get_object()
        children = node.child_nodes.all()
        serializer = NodeSerializer(children, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def connections(self, request, pk=None):
        """
        Get all connections (incoming and outgoing) for this node
        """
        from connections.serializers import NodeConnectionSerializer

        node = self.get_object()
        outgoing = node.outgoing_connections.all()
        incoming = node.incoming_connections.all()

        all_connections = list(outgoing) + list(incoming)
        serializer = NodeConnectionSerializer(all_connections, many=True)
        return Response(serializer.data)