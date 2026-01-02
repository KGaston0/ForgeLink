from rest_framework import serializers
from .models import Node


class NodeSerializer(serializers.ModelSerializer):
    """
    Serializer for Node model
    """
    child_count = serializers.SerializerMethodField()
    depth_level = serializers.SerializerMethodField()

    class Meta:
        model = Node
        fields = [
            'id', 'project', 'parent_node', 'title', 'node_type', 'content',
            'position_x', 'position_y', 'color',
            'created_at', 'updated_at',
            'child_count', 'depth_level'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_child_count(self, obj):
        return obj.child_nodes.count()

    def get_depth_level(self, obj):
        return obj.get_depth()


class NodeDetailSerializer(NodeSerializer):
    """
    Detailed serializer with nested children
    """
    child_nodes = NodeSerializer(many=True, read_only=True)

    class Meta(NodeSerializer.Meta):
        fields = NodeSerializer.Meta.fields + ['child_nodes']