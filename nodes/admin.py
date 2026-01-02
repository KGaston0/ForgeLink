from django.contrib import admin
from .models import Project, Node, NodeConnection


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'created_at', 'updated_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Node)
class NodeAdmin(admin.ModelAdmin):
    list_display = ['title', 'node_type', 'project', 'created_at', 'updated_at']
    list_filter = ['node_type', 'project', 'created_at']
    search_fields = ['title', 'content']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(NodeConnection)
class NodeConnectionAdmin(admin.ModelAdmin):
    list_display = ['source_node', 'connection_type', 'target_node', 'project', 'created_at']
    list_filter = ['connection_type', 'project', 'created_at']
    search_fields = ['label', 'source_node__title', 'target_node__title']
    readonly_fields = ['created_at']

