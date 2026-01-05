from rest_framework import serializers

from .models import ConnectionType


class ConnectionTypeSerializer(serializers.ModelSerializer):
    """Serializer for ConnectionType model (project-scoped connection types)."""

    class Meta:
        model = ConnectionType
        fields = ['id', 'project', 'name', 'description', 'color', 'created_at']
        read_only_fields = ['created_at']

