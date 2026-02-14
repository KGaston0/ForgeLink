from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings


class CookieTokenObtainPairView(TokenObtainPairView):
    """Custom login view that sets JWT tokens in httpOnly cookies"""

    def finalize_response(self, request, response, *args, **kwargs):
        if response.status_code == 200 and 'access' in response.data:
            # Set access token in httpOnly cookie
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=response.data['access'],
                max_age=int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()),
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
            )

            # Set refresh token in httpOnly cookie
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                value=response.data['refresh'],
                max_age=int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds()),
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
            )

            # Keep tokens in response for backwards compatibility (remove in production)
            # response.data = {'detail': 'Login successful'}

        return super().finalize_response(request, response, *args, **kwargs)


class CookieTokenRefreshView(TokenRefreshView):
    """Custom refresh view that gets/sets JWT tokens from/to httpOnly cookies"""

    def finalize_response(self, request, response, *args, **kwargs):
        if response.status_code == 200 and 'access' in response.data:
            # Set new access token in httpOnly cookie
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=response.data['access'],
                max_age=int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()),
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
            )

            # Keep token in response for backwards compatibility
            # response.data = {'detail': 'Token refreshed successfully'}

        return super().finalize_response(request, response, *args, **kwargs)


@api_view(['GET'])
@permission_classes([AllowAny])
def me(request):
    """Returns current user info if JWT token is valid."""
    if not request.user or not request.user.is_authenticated:
        return Response({'authenticated': False}, status=status.HTTP_200_OK)
    return Response({'authenticated': True, 'user': {'username': request.user.username}})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """Logout user and clear httpOnly cookies"""
    response = Response({'detail': 'Logout successful'}, status=status.HTTP_200_OK)

    # Clear cookies
    response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
    response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])

    return response

