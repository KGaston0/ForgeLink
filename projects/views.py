from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Project
from .serializers import ProjectSerializer, ProjectListSerializer


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
        from nodes.serializers import NodeSerializer

        project = self.get_object()
        nodes = project.nodes.all()
        serializer = NodeSerializer(nodes, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def connections(self, request, pk=None):
        """
        Get all connections for a specific project
        """
        from connections.serializers import NodeConnectionSerializer

        project = self.get_object()
        connections = project.connections.all()
        serializer = NodeConnectionSerializer(connections, many=True)
        return Response(serializer.data)