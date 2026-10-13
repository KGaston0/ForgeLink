from rest_framework import serializers
from .models import Node, NodeBlueprint, BlueprintList


class NodeBlueprintSerializer(serializers.ModelSerializer):
    """
    Serializer for NodeBlueprint model.
    
    Exposes template/blueprint for creating nodes with predefined properties.
    Tracks how many nodes have been spawned from this blueprint.
    """

    creator = serializers.StringRelatedField(read_only=True)
    spawned_nodes_count = serializers.SerializerMethodField()

    class Meta:
        model = NodeBlueprint
        fields = [
            'id', 'creator', 'name', 'description', 'category', 'is_frame',
            'color', 'schema', 'is_published',
            'created_at', 'updated_at',
            'spawned_nodes_count'
        ]
        read_only_fields = ['creator', 'created_at', 'updated_at']

    def get_spawned_nodes_count(self, obj):
        """Return the number of nodes spawned from this blueprint."""
        return obj.spawned_nodes.count()


class BlueprintListSerializer(serializers.ModelSerializer):
    """
    Serializer for BlueprintList model.
    
    Represents a collection/group of NodeBlueprints for organizational purposes.
    Includes nested blueprint summaries.
    """

    creator = serializers.StringRelatedField(read_only=True)
    blueprints = NodeBlueprintSerializer(many=True, read_only=True)

    class Meta:
        model = BlueprintList
        fields = [
            'id', 'creator', 'name', 'description', 'blueprints',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['creator', 'created_at', 'updated_at']


class BlueprintListWriteSerializer(serializers.ModelSerializer):
    """
    Write serializer for BlueprintList.
    
    Accepts blueprint IDs instead of full nested objects for create/update operations.
    """

    creator = serializers.StringRelatedField(read_only=True)
    blueprint_ids = serializers.PrimaryKeyRelatedField(
        queryset=NodeBlueprint.objects.all(),
        many=True,
        source='blueprints',
        write_only=True,
        required=False
    )

    class Meta:
        model = BlueprintList
        fields = [
            'id', 'creator', 'name', 'description', 'blueprint_ids',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['creator', 'created_at', 'updated_at']

    def create(self, validated_data):
        """Create BlueprintList and handle blueprint association."""
        blueprints = validated_data.pop('blueprints', [])
        blueprint_list = BlueprintList.objects.create(**validated_data)
        blueprint_list.blueprints.set(blueprints)
        return blueprint_list

    def update(self, instance, validated_data):
        """Update BlueprintList and handle blueprint association."""
        blueprints = validated_data.pop('blueprints', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if blueprints is not None:
            instance.blueprints.set(blueprints)

        return instance


class NodeSerializer(serializers.ModelSerializer):
    """
    Serializer for Node model.
    
    Represents an entity in a project. Can be spawned from a NodeBlueprint
    via the 'blueprint' foreign key.
    """

    child_count = serializers.SerializerMethodField()
    depth_level = serializers.SerializerMethodField()
    graph_ids = serializers.SerializerMethodField()
    blueprint = NodeBlueprintSerializer(read_only=True)
    blueprint_id = serializers.PrimaryKeyRelatedField(
        queryset=NodeBlueprint.objects.all(),
        source='blueprint',
        required=False,
        allow_null=True,
        write_only=True
    )

    class Meta:
        model = Node
        fields = [
            'id', 'project', 'parent_node', 'title', 'node_type', 'content',
            'custom_properties', 'blueprint', 'blueprint_id',
            'created_at', 'updated_at',
            'child_count', 'depth_level', 'graph_ids'
        ]
        read_only_fields = ['created_at', 'updated_at', 'graph_ids', 'blueprint']

    def get_child_count(self, obj):
        """Return the count of direct child nodes."""
        return obj.child_nodes.count()

    def get_depth_level(self, obj):
        """Return the depth level in the hierarchy."""
        return obj.get_depth()

    def get_graph_ids(self, obj):
        """Return list of graph IDs this node belongs to."""
        return list(obj.graph_nodes.values_list('graph_id', flat=True))


class NodeDetailSerializer(NodeSerializer):
    """
    Detailed serializer with nested children.
    
    Includes full child node data for hierarchical browsing.
    """

    child_nodes = NodeSerializer(many=True, read_only=True)

    class Meta(NodeSerializer.Meta):
        fields = NodeSerializer.Meta.fields + ['child_nodes']