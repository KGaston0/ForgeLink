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
    lookup_field = 'uuid'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'updated_at', 'name']
    ordering = ['-updated_at']

    def get_queryset(self):
        # Only projects from authenticated user
        user = getattr(self.request, 'user', None)
        if not user or not user.is_authenticated:
            return Project.objects.none()
        return Project.objects.filter(owner=user)

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectSerializer

    def perform_create(self, serializer):
        # Owner is always set from authenticated user
        if not self.request.user or not self.request.user.is_authenticated:
            raise NotAuthenticated('You must be logged in to create a project.')
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'], url_path='recent')
    def recent(self, request):
        """
        Return the last 3 projects updated by the authenticated user,
        annotated with graph count for efficient serialization.
        """
        if not request.user or not request.user.is_authenticated:
            raise NotAuthenticated('You must be logged in to view recent projects.')

        recent_projects = (
            Project.objects
            .filter(owner=request.user)
            .order_by('-updated_at')[:3]
        )
        serializer = ProjectListSerializer(recent_projects, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def nodes(self, request, uuid=None):
        """
        Get all nodes for a specific project
        """
        from nodes.serializers import NodeSerializer

        project = self.get_object()
        nodes = project.nodes.all()
        serializer = NodeSerializer(nodes, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def connections(self, request, uuid=None):
        """
        Get all connections for a specific project
        """
        from connections.serializers import NodeConnectionSerializer
        from apps.connections.models import NodeConnection

        project = self.get_object()

        # Legacy endpoint: returns connections from all project graphs
        # Avoid N+1: single query filtering by project via graph.
        connections_qs = (
            NodeConnection.objects
            .filter(graph__project=project)
            .select_related('graph', 'source_node', 'target_node', 'connection_type')
        )

        serializer = NodeConnectionSerializer(connections_qs, many=True)
        return Response(serializer.data)