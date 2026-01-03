from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET'])
@permission_classes([AllowAny])
def me(request):
    """Returns information about the current user if the JWT token is valid."""
    if not request.user or not request.user.is_authenticated:
        return Response({'authenticated': False}, status=status.HTTP_200_OK)
    return Response({'authenticated': True, 'user': {'id': request.user.id, 'username': request.user.username}})
