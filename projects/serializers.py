from rest_framework import serializers

from connections.models import NodeConnection
from projects.models import Project


class ProjectSerializer(serializers.ModelSerializer):
    """
    Serializer for Project model with nested data
    """
    node_count = serializers.SerializerMethodField()
    connection_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'owner',
            'created_at', 'updated_at',
            'node_count', 'connection_count'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_node_count(self, obj):
        return obj.nodes.count()

    def get_connection_count(self, obj):
        return obj.connections.count()


class ProjectListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for listing projects
    """
    node_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'owner',
            'created_at', 'updated_at', 'node_count'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_node_count(self, obj):
        return obj.nodes.count()
