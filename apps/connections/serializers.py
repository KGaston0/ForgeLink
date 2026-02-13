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
        from django.core.exceptions import ObjectDoesNotExist, ValidationError as DjangoValidationError
        from rest_framework.exceptions import ValidationError
        from apps.graphs.models import Graph
        from apps.nodes.models import Node
        from .models import ConnectionType

        # For updates, start with existing instance
        if self.instance:
            instance = self.instance
            for attr, value in attrs.items():
                setattr(instance, attr, value)
        else:
            # For creates, build a temporary instance
            instance = NodeConnection(**attrs)

        # Ensure all related objects are loaded before calling clean()
        # This prevents errors when clean() accesses FK properties like node.project_id
        try:
            # Load graph if needed
            if 'graph' in attrs:
                instance.graph = attrs['graph']
            elif instance.graph_id is not None and (not hasattr(instance, 'graph') or instance.graph is None):
                instance.graph = Graph.objects.get(pk=instance.graph_id)

            # Load source_node if needed
            if 'source_node' in attrs:
                instance.source_node = attrs['source_node']
            elif instance.source_node_id is not None and (not hasattr(instance, 'source_node') or instance.source_node is None):
                instance.source_node = Node.objects.get(pk=instance.source_node_id)

            # Load target_node if needed
            if 'target_node' in attrs:
                instance.target_node = attrs['target_node']
            elif instance.target_node_id is not None and (not hasattr(instance, 'target_node') or instance.target_node is None):
                instance.target_node = Node.objects.get(pk=instance.target_node_id)

            # Load connection_type if needed
            if 'connection_type' in attrs:
                instance.connection_type = attrs['connection_type']
            elif instance.connection_type_id is not None and (not hasattr(instance, 'connection_type') or instance.connection_type is None):
                instance.connection_type = ConnectionType.objects.get(pk=instance.connection_type_id)
        except ObjectDoesNotExist as e:
            raise ValidationError(f"Related object does not exist: {str(e)}")

        # Run model validation
        try:
            instance.clean()
        except DjangoValidationError as e:
            # Convert Django ValidationError to DRF ValidationError
            raise ValidationError(e.message_dict if hasattr(e, 'message_dict') else e.messages)

        return attrs
