from django.db import models
from django.contrib.auth.models import User


class Project(models.Model):
    """
    Represents a project/worldbuilding workspace that contains nodes
    """
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return self.name


class Node(models.Model):
    """
    Represents a node in the project graph - can be a character, location, event, etc.
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


class NodeConnection(models.Model):
    """
    Represents a connection/edge between two nodes in the graph
    """
    CONNECTION_TYPES = [
        ('relates_to', 'Relates To'),
        ('parent_of', 'Parent Of'),
        ('child_of', 'Child Of'),
        ('precedes', 'Precedes'),
        ('follows', 'Follows'),
        ('contains', 'Contains'),
        ('located_in', 'Located In'),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='connections')
    source_node = models.ForeignKey(Node, on_delete=models.CASCADE, related_name='outgoing_connections')
    target_node = models.ForeignKey(Node, on_delete=models.CASCADE, related_name='incoming_connections')
    connection_type = models.CharField(max_length=50, choices=CONNECTION_TYPES, default='relates_to')
    label = models.CharField(max_length=255, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['source_node', 'target_node', 'connection_type']

    def __str__(self):
        return f"{self.source_node.title} -> {self.target_node.title} ({self.connection_type})"

