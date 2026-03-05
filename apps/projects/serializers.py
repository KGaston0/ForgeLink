from rest_framework import serializers

from apps.projects.models import Project


class ProjectSerializer(serializers.ModelSerializer):
    """Serializer for Project model."""

    node_count = serializers.SerializerMethodField()
    graph_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'uuid', 'name', 'description', 'owner',
            'created_at', 'updated_at',
            'node_count', 'graph_count',
        ]
        read_only_fields = ['id', 'uuid', 'owner', 'created_at', 'updated_at', 'node_count', 'graph_count']

    def get_node_count(self, obj):
        return obj.nodes.count()

    def get_graph_count(self, obj):
        return obj.graphs.count()


class ProjectListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing projects."""

    node_count = serializers.SerializerMethodField()
    graph_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'uuid', 'name', 'description', 'owner',
            'created_at', 'updated_at', 'node_count', 'graph_count',
        ]
        read_only_fields = ['id', 'uuid', 'created_at', 'updated_at', 'node_count', 'graph_count']

    def get_node_count(self, obj):
        return obj.nodes.count()

    def get_graph_count(self, obj):
        return obj.graphs.count()

