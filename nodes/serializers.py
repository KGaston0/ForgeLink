from rest_framework import serializers
from .models import Node


class NodeSerializer(serializers.ModelSerializer):
    """
    Serializer for Node model
    """
    child_count = serializers.SerializerMethodField()
    depth_level = serializers.SerializerMethodField()
    graph_ids = serializers.SerializerMethodField()

    class Meta:
        model = Node
        fields = [
            'id', 'project', 'parent_node', 'title', 'node_type', 'content',
            'created_at', 'updated_at',
            'child_count', 'depth_level', 'graph_ids'
        ]
        read_only_fields = ['created_at', 'updated_at', 'graph_ids']

    def get_child_count(self, obj):
        return obj.child_nodes.count()

    def get_depth_level(self, obj):
        return obj.get_depth()

    def get_graph_ids(self, obj):
        return list(obj.graph_nodes.values_list('graph_id', flat=True))


class NodeDetailSerializer(NodeSerializer):
    """
    Detailed serializer with nested children
    """
    child_nodes = NodeSerializer(many=True, read_only=True)

    class Meta(NodeSerializer.Meta):
        fields = NodeSerializer.Meta.fields + ['child_nodes']