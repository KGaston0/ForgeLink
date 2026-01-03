from django.contrib import admin

from connections.models import NodeConnection
from nodes.models import Node


@admin.register(Node)
class NodeAdmin(admin.ModelAdmin):
    list_display = ['title', 'node_type', 'project', 'created_at', 'updated_at']
    list_filter = ['node_type', 'project', 'created_at']
    search_fields = ['title', 'content']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(NodeConnection)
class NodeConnectionAdmin(admin.ModelAdmin):
    list_display = ['source_node', 'connection_type', 'target_node', 'graph', 'created_at']
    list_filter = ['connection_type', 'graph', 'created_at']
    search_fields = ['label', 'source_node__title', 'target_node__title']
    readonly_fields = ['created_at']
