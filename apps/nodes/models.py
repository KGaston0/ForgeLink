from django.db import models
from django.core.exceptions import ValidationError
from django.conf import settings

from apps.projects.models import Project


class NodeBlueprint(models.Model):
    """
    Template/blueprint for creating nodes with predefined properties and schemas.
    
    Acts as a reusable template that can be shared and published to a marketplace.
    Stores property rules and default values via the schema JSONField.
    
    Unlike the legacy Node.node_type, this model defines a custom "Semantic Type"
    (e.g., 'Car', 'Spell', 'Character') through the `name` field, allowing total
    user freedom without hardcoded type enumerations.
    """

    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='node_blueprints'
    )

    # Semantic type name: e.g., "Car", "Spell", "Character Template"
    # This is the custom type identifier chosen by the user
    name = models.CharField(
        max_length=255,
        help_text="Custom semantic type name (e.g., 'Car', 'Spell', 'Dragon')"
    )

    description = models.TextField(blank=True)

    # Category for organization (free text, no hardcoded choices)
    # e.g., "Worldbuilding", "Gameplay", "Bestiary", etc.
    category = models.CharField(
        max_length=100,
        blank=True,
        default='General',
        help_text="Organizational category (free text, e.g., 'Worldbuilding')"
    )

    # Determines if this blueprint renders as a normal node or a container frame
    # This is passed to React Flow to determine node rendering behavior
    is_frame = models.BooleanField(
        default=False,
        help_text="If True, this blueprint renders as a container frame (like a folder)"
    )

    color = models.CharField(max_length=7, default='#3B82F6')

    # Schema stores property rules and validation:
    # e.g., {
    #   "horsepower": {"type": "number", "min": 0, "max": 1000},
    #   "brand": {"type": "string", "enum": ["Toyota", "BMW", "Tesla"]},
    #   "description": {"type": "text"}
    # }
    schema = models.JSONField(default=dict, blank=True)

    is_published = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        verbose_name = 'Node Blueprint'
        verbose_name_plural = 'Node Blueprints'
        indexes = [
            models.Index(fields=['creator', '-updated_at']),
            models.Index(fields=['is_published']),
        ]

    def __str__(self):
        return f"{self.name} ({self.category})" if self.category else self.name

    def clean(self):
        """Validate blueprint schema structure."""
        if not isinstance(self.schema, dict):
            raise ValidationError("Schema must be a valid dictionary")

        if not self.name or not self.name.strip():
            raise ValidationError("Blueprint name cannot be empty")


class BlueprintList(models.Model):
    """
    A collection/group of NodeBlueprints for organizational purposes.
    
    Allows users to organize their blueprints into custom collections
    (e.g., "Fantasy Characters", "Sci-Fi Items").
    """

    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='blueprint_lists'
    )

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    blueprints = models.ManyToManyField(
        NodeBlueprint,
        blank=True,
        related_name='blueprint_lists'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        verbose_name = 'Blueprint List'
        verbose_name_plural = 'Blueprint Lists'
        indexes = [
            models.Index(fields=['creator', '-updated_at']),
        ]

    def __str__(self):
        return self.name


class Node(models.Model):
    """
    Represents an entity in a project (character, location, event, item, etc.).
    
    Unlike the legacy hardcoded NODE_TYPES, this model now accepts ANY custom type
    string via the `node_type` field, allowing total user freedom. Examples:
    - 'character', 'location', 'event' (legacy types still work)
    - 'car', 'spell', 'dragon', 'artifact' (custom types)
    - Any string the user defines through NodeBlueprint
    
    Graph membership and per-graph layout are handled by graphs.GraphNode.
    Can be spawned from a NodeBlueprint template via the 'blueprint' FK.
    """

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='nodes'
    )

    # Blueprint connection: "umbilical cord" to the template this node was spawned from
    blueprint = models.ForeignKey(
        NodeBlueprint,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='spawned_nodes'
    )

    # Custom node type (no hardcoded choices!)
    # Examples: 'character', 'car', 'spell', 'dragon', 'artifact', etc.
    node_type = models.CharField(
        max_length=100,
        default='note',
        help_text="Custom node type (no restrictions, examples: 'character', 'car', 'spell')"
    )

    title = models.CharField(max_length=255)
    content = models.TextField(blank=True)
    custom_properties = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['project', 'node_type']),
            models.Index(fields=['project', '-updated_at']),
            models.Index(fields=['blueprint']),
        ]

    def __str__(self):
        return f"{self.title} ({self.node_type})"
