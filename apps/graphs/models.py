import uuid

from django.db import models
from django.core.exceptions import ValidationError

from apps.projects.models import Project
from apps.nodes.models import Node


class Graph(models.Model):
    """A named graph/canvas within a project."""

    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='graphs')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        constraints = [
            models.UniqueConstraint(fields=['project', 'name'], name='uniq_graph_name_per_project')
        ]

    def __str__(self) -> str:
        return f"{self.project.name} / {self.name}"


class GraphNode(models.Model):
    """Membership + per-graph layout for a node."""

    graph = models.ForeignKey(Graph, on_delete=models.CASCADE, related_name='graph_nodes')
    node = models.ForeignKey(Node, on_delete=models.CASCADE, related_name='graph_nodes')

    # Layout / visual per graph
    position_x = models.FloatField(default=0)
    position_y = models.FloatField(default=0)
    color = models.CharField(max_length=7, default='#3B82F6')

    # Frame support
    is_frame = models.BooleanField(default=False)
    width = models.IntegerField(default=400)
    height = models.IntegerField(default=300)

    # Nesting: self-referencing FK to support parent frames
    parent_node = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['graph', 'node'], name='uniq_node_per_graph')
        ]

    def __str__(self) -> str:
        return f"{self.graph} -> {self.node.title}"

    def clean(self):
        """Domain validations to maintain consistency between projects."""
        if self.graph_id and self.node_id and self.node.project_id != self.graph.project_id:
            raise ValidationError("Node must belong to the same project as the graph")
        
        # Prevent self-referencing parent
        if self.parent_node_id and self.parent_node_id == self.id:
            raise ValidationError("A node cannot be its own parent")
        
        # The parent must be in the same graph
        if self.parent_node_id and self.graph_id and self.parent_node.graph_id != self.graph_id:
            raise ValidationError("Parent node must belong to the same graph")

        # Prevent circular references (cycles in hierarchy)
        if self.parent_node_id:
            visited = set()
            current = self.parent_node
            
            while current is not None:
                if current.id in visited:
                    raise ValidationError("Circular parent_node reference detected")
                if current.id == self.id:
                    raise ValidationError("A node cannot be an ancestor of itself")
                
                visited.add(current.id)
                current = current.parent_node
            

