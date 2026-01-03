from rest_framework import serializers

from .models import Graph, GraphNode


class GraphSerializer(serializers.ModelSerializer):
    node_count = serializers.SerializerMethodField()

    class Meta:
        model = Graph
        fields = ['id', 'project', 'name', 'description', 'created_at', 'updated_at', 'node_count']
        read_only_fields = ['created_at', 'updated_at', 'node_count']

    def get_node_count(self, obj):
        return obj.graph_nodes.count()


class GraphNodeSerializer(serializers.ModelSerializer):
    node_title = serializers.CharField(source='node.title', read_only=True)
    node_type = serializers.CharField(source='node.node_type', read_only=True)

    class Meta:
        model = GraphNode
        fields = [
            'id', 'graph', 'node',
            'position_x', 'position_y', 'color',
            'created_at', 'updated_at',
            'node_title', 'node_type'
        ]
        read_only_fields = ['created_at', 'updated_at', 'node_title', 'node_type']

    def validate(self, attrs):
        graph = attrs.get('graph') or getattr(self.instance, 'graph', None)
        node = attrs.get('node') or getattr(self.instance, 'node', None)
        if graph and node and node.project_id != graph.project_id:
            raise serializers.ValidationError('Node must belong to the same project as the graph')
        return attrs

    def create(self, validated_data):
        obj = super().create(validated_data)
        obj.full_clean()
        obj.save()
        return obj

    def update(self, instance, validated_data):
        obj = super().update(instance, validated_data)
        obj.full_clean()
        obj.save()
        return obj

