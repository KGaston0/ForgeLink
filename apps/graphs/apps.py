from django.apps import AppConfig


class GraphsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.graphs'

    def ready(self):
        """Register signals when the app is ready."""
        import apps.graphs.signals  # noqa: F401

