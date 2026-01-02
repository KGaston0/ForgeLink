from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, NodeViewSet, NodeConnectionViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'nodes', NodeViewSet, basename='node')
router.register(r'connections', NodeConnectionViewSet, basename='connection')

urlpatterns = [
    path('', include(router.urls)),
]
