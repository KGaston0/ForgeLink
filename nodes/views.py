from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Project, Node, NodeConnection
from .serializers import (
    ProjectSerializer,
    ProjectListSerializer,
    NodeSerializer,
    NodeConnectionSerializer
)


class ProjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Project model
    Provides CRUD operations for projects
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'updated_at', 'name']
    ordering = ['-updated_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectSerializer

    @action(detail=True, methods=['get'])
    def nodes(self, request, pk=None):
        """
        Get all nodes for a specific project
        """
        project = self.get_object()
        nodes = project.nodes.all()
        serializer = NodeSerializer(nodes, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def connections(self, request, pk=None):
        """
        Get all connections for a specific project
        """
        project = self.get_object()
        connections = project.connections.all()
        serializer = NodeConnectionSerializer(connections, many=True)
        return Response(serializer.data)


class NodeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Node model
    Provides CRUD operations for nodes
    """
    queryset = Node.objects.all()
    serializer_class = NodeSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['project', 'node_type']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'updated_at', 'title']
    ordering = ['-updated_at']


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

