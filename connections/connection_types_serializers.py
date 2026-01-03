from rest_framework import serializers

from .models import ConnectionType


class ConnectionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConnectionType
        fields = ['id', 'project', 'name', 'description', 'color', 'created_at']
        read_only_fields = ['created_at']

