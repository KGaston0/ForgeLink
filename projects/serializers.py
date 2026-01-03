from rest_framework import serializers

from projects.models import Project


class ProjectSerializer(serializers.ModelSerializer):
    """Serializer for Project model."""

    node_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'owner',
            'created_at', 'updated_at',
            'node_count',
        ]
        read_only_fields = ['owner', 'created_at', 'updated_at', 'node_count']

    def get_node_count(self, obj):
        return obj.nodes.count()


class ProjectListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing projects."""

    node_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'owner',
            'created_at', 'updated_at', 'node_count'
        ]
        read_only_fields = ['created_at', 'updated_at', 'node_count']

    def get_node_count(self, obj):
        return obj.nodes.count()
