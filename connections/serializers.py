from rest_framework import serializers

from .models import NodeConnection


class NodeConnectionSerializer(serializers.ModelSerializer):
    """Serializer for NodeConnection (graph-scoped)."""

    source_node_title = serializers.CharField(source='source_node.title', read_only=True)
    target_node_title = serializers.CharField(source='target_node.title', read_only=True)

    class Meta:
        model = NodeConnection
        fields = [
            'id', 'graph', 'source_node', 'target_node',
            'connection_type', 'label', 'created_at',
            'source_node_title', 'target_node_title'
        ]
        read_only_fields = ['created_at']

    def validate(self, attrs):
        graph = attrs.get('graph') or getattr(self.instance, 'graph', None)
        source = attrs.get('source_node') or getattr(self.instance, 'source_node', None)
        target = attrs.get('target_node') or getattr(self.instance, 'target_node', None)
        ctype = attrs.get('connection_type') or getattr(self.instance, 'connection_type', None)

        if source is not None and target is not None and source == target:
            raise serializers.ValidationError("A node cannot connect to itself")

        if graph and source and source.project_id != graph.project_id:
            raise serializers.ValidationError("Source node must belong to the same project as the graph")
        if graph and target and target.project_id != graph.project_id:
            raise serializers.ValidationError("Target node must belong to the same project as the graph")

        if graph and ctype and ctype.project_id != graph.project_id:
            raise serializers.ValidationError("Connection type must belong to the same project as the graph")

        # Require nodes to be present in the graph
        if graph and source and not graph.graph_nodes.filter(node=source).exists():
            raise serializers.ValidationError("Source node is not present in this graph")
        if graph and target and not graph.graph_nodes.filter(node=target).exists():
            raise serializers.ValidationError("Target node is not present in this graph")

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
