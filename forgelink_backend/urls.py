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

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import auth_views
from .mvp_views import mvp_index

urlpatterns = [
    path('', mvp_index),
    path('mvp/', mvp_index),
    path('admin/', admin.site.urls),

    # JWT
    path('api/auth/jwt/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/jwt/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # helper
    path('api/auth/me/', auth_views.me),

    path('api/', include('projects.urls')),
    path('api/', include('graphs.urls')),
    path('api/', include('nodes.urls')),
    path('api/', include('connections.urls')),
]
