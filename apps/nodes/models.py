from django.db import models

from apps.projects.models import Project


class Node(models.Model):
    """
    Represents an entity in a project (character, location, event, etc.).

    Graph membership and per-graph layout are handled by graphs.GraphNode.
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

    # Hierarchy: a node can be inside another node (within the same project)
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

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.title} ({self.node_type})"

    def clean(self):
        # Prevent invalid parent relationships
        if self.parent_node is not None:
            if self.parent_node_id == self.id:
                raise models.ValidationError("A node cannot be its own parent")
            if self.parent_node.project_id != self.project_id:
                raise models.ValidationError("Parent node must belong to the same project")

            # Prevent cycles
            ancestor = self.parent_node
            seen_ids = {self.id} if self.id else set()
            while ancestor is not None:
                if ancestor.id in seen_ids:
                    raise models.ValidationError("Cyclic parent relationship is not allowed")
                seen_ids.add(ancestor.id)
                ancestor = ancestor.parent_node

    def get_depth(self):
        """Returns the depth level in the hierarchy (0 = root)."""
        depth = 0
        ancestor = self.parent_node
        seen_ids = {self.id} if self.id else set()
        while ancestor is not None:
            if ancestor.id in seen_ids:
                # Defensive: avoid infinite loops if bad data exists
                break
            seen_ids.add(ancestor.id)
            depth += 1
            ancestor = ancestor.parent_node
        return depth
