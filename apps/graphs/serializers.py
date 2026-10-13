from rest_framework import serializers

from forgelink_backend.serializer_mixins import OwnerScopedRelatedFieldsMixin

from .models import Graph, GraphNode


class GraphSerializer(OwnerScopedRelatedFieldsMixin, serializers.ModelSerializer):
    """Serializer for Graph model."""
    owner_scoped_fields = {'project': 'owner'}
    project_name = serializers.CharField(source='project.name', read_only=True)
    node_count = serializers.SerializerMethodField()

    class Meta:
        model = Graph

        fields = ['id', 'uuid', 'project', 'project_name', 'name', 'description', 'created_at', 'updated_at', 'node_count']
        read_only_fields = ['id', 'uuid', 'created_at', 'updated_at', 'node_count']

    def get_node_count(self, obj) -> int:
        return obj.graph_nodes.count()
class GraphNodeSerializer(OwnerScopedRelatedFieldsMixin, serializers.ModelSerializer):
    """Serializer for GraphNode model (node membership and layout in a graph)."""

    owner_scoped_fields = {
        'graph': 'project__owner',
        'node': 'project__owner',
        'parent_node': 'graph__project__owner',
    }

    node_title = serializers.CharField(source='node.title', read_only=True)
    node_type = serializers.CharField(source='node.node_type', read_only=True)
    node_custom_properties = serializers.JSONField(source='node.custom_properties', read_only=True)

    class Meta:
        model = GraphNode
        fields = [
            'id', 'graph', 'node',
            'position_x', 'position_y', 'color',
            'is_frame', 'width', 'height', 'parent_node',
            'created_at', 'updated_at',
            'node_title', 'node_type', 'node_custom_properties'
        ]
        read_only_fields = ['created_at', 'updated_at', 'node_title', 'node_type', 'node_custom_properties']

    def validate(self, attrs):
        """
        Perform model-level validation by calling the model's clean() method.
        This ensures consistency between serializer and model validations.
        """
        from django.core.exceptions import ObjectDoesNotExist, ValidationError as DjangoValidationError
        from rest_framework.exceptions import ValidationError
        from apps.graphs.models import Graph, GraphNode
        from apps.nodes.models import Node

        # For updates, start with existing instance
        if self.instance:
            instance = self.instance
            for attr, value in attrs.items():
                setattr(instance, attr, value)
        else:
            # For creates, build a temporary instance
            instance = GraphNode(**attrs)

        # Ensure related objects are loaded before calling clean()
        # This prevents errors when clean() accesses node.project_id and graph.project_id
        try:
            if instance.graph_id is None or not hasattr(instance, 'graph') or instance.graph is None:
                if 'graph' in attrs:
                    instance.graph = attrs['graph']
                elif instance.graph_id is not None:
                    instance.graph = Graph.objects.get(pk=instance.graph_id)

            if instance.node_id is None or not hasattr(instance, 'node') or instance.node is None:
                if 'node' in attrs:
                    instance.node = attrs['node']
                elif instance.node_id is not None:
                    instance.node = Node.objects.get(pk=instance.node_id)
            
            # Load parent_node if it's being set or already exists
            if instance.parent_node_id is not None and (not hasattr(instance, 'parent_node') or instance.parent_node is None):
                instance.parent_node = GraphNode.objects.get(pk=instance.parent_node_id)
        except ObjectDoesNotExist as e:
            raise ValidationError(f"Related object does not exist: {str(e)}")

        # Run model validation
        try:
            instance.clean()
        except DjangoValidationError as e:
            # Convert Django ValidationError to DRF ValidationError
            raise ValidationError(e.message_dict if hasattr(e, 'message_dict') else e.messages)

        return attrs
