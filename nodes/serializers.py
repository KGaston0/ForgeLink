from rest_framework import serializers
from .models import Project, Node, NodeConnection


class NodeConnectionSerializer(serializers.ModelSerializer):
    """
    Serializer for NodeConnection model
    """
    class Meta:
        model = NodeConnection
        fields = [
            'id', 'project', 'source_node', 'target_node',
            'connection_type', 'label', 'created_at'
        ]
        read_only_fields = ['created_at']


class NodeSerializer(serializers.ModelSerializer):
    """
    Serializer for Node model
    """
    outgoing_connections = NodeConnectionSerializer(many=True, read_only=True)
    incoming_connections = NodeConnectionSerializer(many=True, read_only=True)

    class Meta:
        model = Node
        fields = [
            'id', 'project', 'title', 'node_type', 'content',
            'position_x', 'position_y', 'color',
            'created_at', 'updated_at',
            'outgoing_connections', 'incoming_connections'
        ]
        read_only_fields = ['created_at', 'updated_at']


class ProjectSerializer(serializers.ModelSerializer):
    """
    Serializer for Project model
    """
    nodes = NodeSerializer(many=True, read_only=True)
    connections = NodeConnectionSerializer(many=True, read_only=True)
    node_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'owner',
            'created_at', 'updated_at',
            'nodes', 'connections', 'node_count'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_node_count(self, obj):
        return obj.nodes.count()


class ProjectListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for listing projects (without nested nodes)
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
