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
        """
        Perform model-level validation by calling the model's clean() method.
        This ensures consistency between serializer and model validations.
        """
        # Create a temporary instance to validate
        instance = NodeConnection(**attrs) if not self.instance else self.instance
        if self.instance:
            for attr, value in attrs.items():
                setattr(instance, attr, value)

        # Run model validation
        instance.clean()
        return attrs
