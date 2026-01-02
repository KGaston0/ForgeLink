from django.db import models
from django.core.exceptions import ValidationError

from nodes.models import Node
from projects.models import Project


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
    Represents a semantic relationship/edge between two nodes in the graph.
    """
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='connections')
    source_node = models.ForeignKey(Node, on_delete=models.CASCADE, related_name='outgoing_connections')
    target_node = models.ForeignKey(Node, on_delete=models.CASCADE, related_name='incoming_connections')

    # Reference to user-defined connection type
    connection_type = models.ForeignKey(
        ConnectionType,
        on_delete=models.PROTECT,  # Prevent deletion if connections exist
        related_name='connections'
    )
    label = models.CharField(max_length=255, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['source_node', 'target_node', 'connection_type']

    def __str__(self):
        return f"{self.source_node.title} -> {self.target_node.title} ({self.connection_type.name})"

    def clean(self):
        """Prevent self-connections"""
        if self.source_node == self.target_node:
            raise ValidationError("A node cannot connect to itself")

        if self.source_node.project != self.target_node.project:
            raise ValidationError("Cannot connect nodes from different projects")

        if self.connection_type.project != self.project:
            raise ValidationError("Connection type must belong to the same project")