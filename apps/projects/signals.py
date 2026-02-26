from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from apps.projects.models import Project
from apps.graphs.models import Graph

User = get_user_model()

@receiver(post_save, sender=User)
def create_initial_user_data(sender, instance, created, **kwargs):
    if created:
        # Create "Mi Primer Proyecto"
        project = Project.objects.create(
            name="Mi Primer Proyecto",
            owner=instance,
            description="Proyecto inicial creado automáticamente."
        )
        # Create "Grafo Principal"
        Graph.objects.create(
            project=project,
            name="Grafo Principal",
            description="Grafo inicial para visualización."
        )
