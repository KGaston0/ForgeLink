from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import NotAuthenticated

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

    def get_queryset(self):
        # Solo proyectos del usuario autenticado
        user = getattr(self.request, 'user', None)
        if not user or not user.is_authenticated:
            return Project.objects.none()
        return Project.objects.filter(owner=user)

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectSerializer

    def perform_create(self, serializer):
        # Owner siempre sale del usuario autenticado.
        if not self.request.user or not self.request.user.is_authenticated:
            raise NotAuthenticated('Debes iniciar sesión para crear un proyecto.')
        serializer.save(owner=self.request.user)

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
        # Legacy endpoint: devolvemos conexiones de todos los grafos del proyecto
        connections = []
        for graph in project.graphs.all():
            connections.extend(list(graph.connections.all()))

        serializer = NodeConnectionSerializer(connections, many=True)
        return Response(serializer.data)