from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone

from apps.nodes.models import Node
from .models import Graph, GraphNode


@receiver(post_save, sender=GraphNode)
def update_graph_on_graphnode_save(sender, instance, **kwargs):
    """
    When a GraphNode is created or updated, update the parent Graph's updated_at timestamp.
    This ensures the graph appears in the "recently updated" feed when nodes are added/modified.
    Uses bulk_update to avoid recursive signals.
    """
    Graph.objects.filter(id=instance.graph_id).update(updated_at=timezone.now())


@receiver(post_delete, sender=GraphNode)
def update_graph_on_graphnode_delete(sender, instance, **kwargs):
    """
    When a GraphNode is deleted, update the parent Graph's updated_at timestamp.
    Uses bulk_update to avoid recursive signals.
    """
    Graph.objects.filter(id=instance.graph_id).update(updated_at=timezone.now())


@receiver(post_save, sender=Node)
def update_graph_on_node_save(sender, instance, **kwargs):
    """
    When a Node is created or updated, update all related Graphs' updated_at timestamps.
    This ensures graphs containing this node appear in the "recently updated" feed.
    """
    # Get all graphs that contain this node
    graphs = Graph.objects.filter(graph_nodes__node=instance).distinct()
    if graphs.exists():
        # Bulk update all related graphs (no signals triggered)
        graphs.update(updated_at=timezone.now())


