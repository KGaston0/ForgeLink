"""
Custom JWT Authentication that reads from httpOnly cookies
"""
from django.conf import settings
from drf_spectacular.extensions import OpenApiAuthenticationExtension
from rest_framework_simplejwt.authentication import JWTAuthentication


class JWTCookieAuthentication(JWTAuthentication):
    """
    Custom JWT authentication that reads access token from httpOnly cookies

    Fallback order:
    1. Authorization header (for API clients, mobile apps, etc.)
    2. httpOnly cookie (for web browsers)
    """

    def authenticate(self, request):
        # First, try the standard Authorization header
        header = self.get_header(request)

        if header is not None:
            raw_token = self.get_raw_token(header)
            if raw_token is not None:
                validated_token = self.get_validated_token(raw_token)
                return self.get_user(validated_token), validated_token

        # If no Authorization header, try to get token from cookie
        raw_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])

        if raw_token is None:
            return None

        # Validate and return user
        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token


class JWTCookieAuthenticationScheme(OpenApiAuthenticationExtension):
    """Describes JWTCookieAuthentication in the generated OpenAPI schema."""

    target_class = 'forgelink_backend.authentication.JWTCookieAuthentication'
    name = 'jwtCookieAuth'

    def get_security_definition(self, auto_schema):
        return {
            'type': 'apiKey',
            'in': 'cookie',
            'name': settings.SIMPLE_JWT['AUTH_COOKIE'],
            'description': 'Access token in an httpOnly cookie, set by POST /api/auth/jwt/login/. '
                           'An "Authorization: Bearer <token>" header is also accepted.',
        }
