from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import NodeConnectionViewSet, ConnectionTypeViewSet

router = DefaultRouter()
router.register(r'connection-types', ConnectionTypeViewSet, basename='connectiontype')
router.register(r'connections', NodeConnectionViewSet, basename='nodeconnection')

urlpatterns = [
    path('', include(router.urls)),
]