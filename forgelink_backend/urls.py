"""
URL configuration for forgelink_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import auth_views
from .mvp_views import mvp_index

urlpatterns = [
    # Root redirects to API (DRF browsable API)
    path('', RedirectView.as_view(url='/api/', permanent=False)),

    # MVP Frontend
    path('mvp/', mvp_index, name='mvp_frontend'),

    # Django Admin
    path('admin/', admin.site.urls),

    # API endpoints
    path('api/', include([
        # Authentication
        path('auth/jwt/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
        path('auth/jwt/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
        path('auth/me/', auth_views.me, name='auth_me'),

        # App endpoints
        path('', include('projects.urls')),
        path('', include('graphs.urls')),
        path('', include('nodes.urls')),
        path('', include('connections.urls')),
    ])),
]
