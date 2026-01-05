from django.contrib import admin

from .models import Graph, GraphNode


@admin.register(Graph)
class GraphAdmin(admin.ModelAdmin):
    list_display = ['name', 'project', 'created_at', 'updated_at']
    list_filter = ['project', 'created_at', 'updated_at']
    search_fields = ['name', 'description', 'project__name']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-updated_at']


@admin.register(GraphNode)
class GraphNodeAdmin(admin.ModelAdmin):
    list_display = ['graph', 'node', 'position_x', 'position_y', 'color', 'created_at']
    list_filter = ['graph', 'graph__project', 'created_at']
    search_fields = ['graph__name', 'node__title']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['graph', 'node']

