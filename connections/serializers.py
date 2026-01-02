from rest_framework import serializers
from .models import NodeConnection


class NodeConnectionSerializer(serializers.ModelSerializer):
    """
    Serializer for NodeConnection model
    """
    source_node_title = serializers.CharField(source='source_node.title', read_only=True)
    target_node_title = serializers.CharField(source='target_node.title', read_only=True)

    class Meta:
        model = NodeConnection
        fields = [
            'id', 'project', 'source_node', 'target_node',
            'connection_type', 'label', 'created_at',
            'source_node_title', 'target_node_title'
        ]
        read_only_fields = ['created_at']

    def validate(self, data):
        """
        Validate that source and target nodes belong to the same project
        """
        if data['source_node'].project != data['target_node'].project:
            raise serializers.ValidationError(
                "Source and target nodes must belong to the same project"
            )
        if data['source_node'] == data['target_node']:
            raise serializers.ValidationError(
                "A node cannot connect to itself"
            )
        return data