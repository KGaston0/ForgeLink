from django.db import models
from django.core.exceptions import ValidationError

from nodes.models import Node
from projects.models import Project
from graphs.models import Graph


class ConnectionType(models.Model):
    """
    User-defined connection types per project
    """

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='connection_types')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#6B7280')  # Color for visualization

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['project', 'name']
        ordering = ['name']

    def __str__(self):
        return f"{self.project.name} - {self.name}"


class NodeConnection(models.Model):
    """
    Represents a semantic relationship/edge between two nodes within a graph.
    Nodes are global to a project, but connections are graph-scoped.
    """

    graph = models.ForeignKey(Graph, on_delete=models.CASCADE, related_name='connections')
    source_node = models.ForeignKey(Node, on_delete=models.CASCADE, related_name='outgoing_connections')
    target_node = models.ForeignKey(Node, on_delete=models.CASCADE, related_name='incoming_connections')

    # Reference to user-defined connection type (project-scoped)
    connection_type = models.ForeignKey(
        ConnectionType,
        on_delete=models.PROTECT,  # Prevent deletion if connections exist
        related_name='connections'
    )
    label = models.CharField(max_length=255, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['graph', 'source_node', 'target_node', 'connection_type']

    def __str__(self):
        return f"{self.source_node.title} -> {self.target_node.title} ({self.connection_type.name})"

    def clean(self):
        """Prevent invalid connections."""
        if self.source_node == self.target_node:
            raise ValidationError("A node cannot connect to itself")

        # Ensure all belong to the same project
        if self.source_node.project_id != self.graph.project_id or self.target_node.project_id != self.graph.project_id:
            raise ValidationError("Cannot connect nodes from a different project than the graph")

        if self.connection_type.project_id != self.graph.project_id:
            raise ValidationError("Connection type must belong to the same project as the graph")

        # Optional: require nodes to be present in the graph
        # (This matches a UI where you must 'add' nodes to a graph before connecting them.)
        # Optimized: use a single query to check both nodes instead of two separate queries
        nodes_in_graph = set(
            self.graph.graph_nodes.filter(
                node__in=[self.source_node, self.target_node]
            ).values_list('node_id', flat=True)
        )

        if self.source_node.id not in nodes_in_graph:
            raise ValidationError("Source node is not present in this graph")
        if self.target_node.id not in nodes_in_graph:
            raise ValidationError("Target node is not present in this graph")
