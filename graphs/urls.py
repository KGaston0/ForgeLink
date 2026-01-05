from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import GraphViewSet, GraphNodeViewSet

router = DefaultRouter()
router.register(r'graphs', GraphViewSet, basename='graph')
router.register(r'graph-nodes', GraphNodeViewSet, basename='graphnode')

urlpatterns = [
    path('', include(router.urls)),
]

