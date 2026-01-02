from django.db import models
from django.contrib.auth.models import User

from projects.models import Project


class Node(models.Model):
    """
    Represents a node in the project graph - can be a character, location, event, etc.
    Can contain other nodes via parent_node (hierarchy/containment).
    """
    NODE_TYPES = [
        ('character', 'Character'),
        ('location', 'Location'),
        ('event', 'Event'),
        ('item', 'Item'),
        ('concept', 'Concept'),
        ('note', 'Note'),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='nodes')

    # Hierarchy: a node can be inside another node
    parent_node = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='child_nodes'
    )

    title = models.CharField(max_length=255)
    node_type = models.CharField(max_length=50, choices=NODE_TYPES, default='note')
    content = models.TextField(blank=True)
    
    # Position on canvas
    position_x = models.FloatField(default=0)
    position_y = models.FloatField(default=0)
    
    # Visual properties
    color = models.CharField(max_length=7, default='#3B82F6')  # Hex color code
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.title} ({self.node_type})"

    def get_depth(self):
        """Returns the depth level in the hierarchy (0 = root)"""
        if self.parent_node is None:
            return 0
        return 1 + self.parent_node.get_depth()

    def get_root_nodes(self):
        """Returns all root nodes (nodes without parent) in the project"""
        return self.project.nodes.filter(parent_node__isnull=True)
