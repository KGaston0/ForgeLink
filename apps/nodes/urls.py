from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NodeViewSet, NodeBlueprintViewSet, BlueprintListViewSet

router = DefaultRouter()
router.register(r'nodes', NodeViewSet, basename='node')
router.register(r'blueprints', NodeBlueprintViewSet, basename='blueprint')
router.register(r'blueprint-lists', BlueprintListViewSet, basename='blueprint-list')

urlpatterns = [
    path('', include(router.urls)),
]