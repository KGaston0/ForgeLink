from rest_framework import serializers

from forgelink_backend.serializer_mixins import OwnerScopedRelatedFieldsMixin

from .models import ConnectionType


class ConnectionTypeSerializer(OwnerScopedRelatedFieldsMixin, serializers.ModelSerializer):
    """Serializer for ConnectionType model (project-scoped connection types)."""

    owner_scoped_fields = {'project': 'owner'}

    class Meta:
        model = ConnectionType
        fields = ['id', 'project', 'name', 'description', 'color', 'created_at']
        read_only_fields = ['created_at']

