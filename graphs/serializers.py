from rest_framework import serializers

from .models import Graph, GraphNode


class GraphSerializer(serializers.ModelSerializer):
    """Serializer for Graph model."""

    node_count = serializers.SerializerMethodField()

    class Meta:
        model = Graph
        fields = ['id', 'project', 'name', 'description', 'created_at', 'updated_at', 'node_count']
        read_only_fields = ['created_at', 'updated_at', 'node_count']

    def get_node_count(self, obj):
        return obj.graph_nodes.count()


class GraphNodeSerializer(serializers.ModelSerializer):
    """Serializer for GraphNode model (node membership and layout in a graph)."""

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
        """
        Perform model-level validation by calling the model's clean() method.
        This ensures consistency between serializer and model validations.
        """
        # Create a temporary instance to validate
        instance = GraphNode(**attrs) if not self.instance else self.instance
        if self.instance:
            for attr, value in attrs.items():
                setattr(instance, attr, value)

        # Run model validation
        instance.clean()
        return attrs
