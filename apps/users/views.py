from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.contrib.auth import update_session_auth_hash
from django_filters.rest_framework import DjangoFilterBackend
from .models import User, MembershipType
from .serializers import (
    UserSerializer,
    UserCreateSerializer,
    UserUpdateSerializer,
    UserPasswordChangeSerializer,
    UserAdminSerializer,
    MembershipUpgradeSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet to manage users.

    Endpoints:
    - GET /users/ - List users (admin only)
    - POST /users/ - Create user (public)
    - GET /users/{id}/ - Get specific user
    - PUT/PATCH /users/{id}/ - Update user
    - DELETE /users/{id}/ - Delete user (admin only)
    - GET /users/me/ - Get current user profile
    - PUT/PATCH /users/me/ - Update current user profile
    - POST /users/change_password/ - Change password
    - POST /users/{id}/upgrade_membership/ - Update membership (admin only)
    - GET /users/stats/ - Get user statistics (admin only)
    """

    queryset = User.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['membership_type', 'is_active', 'email_verified']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['created_at', 'last_login', 'username']
    ordering = ['-created_at']

    def get_serializer_class(self):
        """Select appropriate serializer based on action"""
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action in ['update', 'partial_update'] and not self.request.user.is_staff:
            return UserUpdateSerializer
        elif self.action == 'change_password':
            return UserPasswordChangeSerializer
        elif self.request.user and self.request.user.is_staff:
            return UserAdminSerializer
        return UserSerializer

    def get_permissions(self):
        """Define permissions based on action"""
        if self.action == 'create':
            # Allow public registration
            permission_classes = [AllowAny]
        elif self.action in ['list', 'destroy', 'upgrade_membership']:
            # Only admins can list all users and delete
            permission_classes = [IsAdminUser]
        else:
            # Authenticated users for the rest
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """Filter queryset based on user"""
        queryset = super().get_queryset()

        # Regular users can only see their own profile
        if not self.request.user.is_staff:
            if self.action == 'list':
                # Los no-admin no pueden listar usuarios
                return queryset.none()
            # Pueden ver solo su propio perfil
            return queryset.filter(id=self.request.user.id)

        return queryset

    def perform_create(self, serializer):
        """Crear usuario con valores por defecto"""
        serializer.save(membership_type=MembershipType.FREE)

    def update(self, request, *args, **kwargs):
        """Actualizar usuario - verificar que el usuario solo pueda actualizar su propio perfil"""
        instance = self.get_object()

        # Verificar que el usuario solo pueda actualizar su propio perfil (excepto admin)
        if not request.user.is_staff and instance.id != request.user.id:
            return Response(
                {"detail": "You don't have permission to update this user."},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().update(request, *args, **kwargs)

    @action(detail=False, methods=['get', 'put', 'patch'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """
        Get or update current user profile.
        GET /users/me/ - Get profile
        PUT/PATCH /users/me/ - Update profile
        """
        user = request.user

        if request.method == 'GET':
            serializer = UserSerializer(user)
            return Response(serializer.data)

        # For PUT/PATCH
        serializer = UserUpdateSerializer(user, data=request.data, partial=request.method == 'PATCH')
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Return with complete serializer
        return Response(UserSerializer(user).data)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def change_password(self, request):
        """
        Change current user password.
        POST /users/change_password/
        Body: {
            "old_password": "...",
            "new_password": "...",
            "new_password_confirm": "..."
        }
        """
        serializer = UserPasswordChangeSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        # Change password
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()

        # Keep session active after password change
        update_session_auth_hash(request, user)

        return Response(
            {"detail": "Password updated successfully."},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def upgrade_membership(self, request, pk=None):
        """
        Update user membership (admin only).
        POST /users/{id}/upgrade_membership/
        Body: {
            "membership_type": "premium",
            "membership_start_date": "2026-01-26T00:00:00Z",
            "membership_end_date": "2027-01-26T00:00:00Z"
        }
        """
        user = self.get_object()

        serializer = MembershipUpgradeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data
        user.membership_type = validated_data['membership_type']

        if 'membership_start_date' in validated_data:
            user.membership_start_date = validated_data['membership_start_date']
        if 'membership_end_date' in validated_data:
            user.membership_end_date = validated_data['membership_end_date']

        user.save()

        return Response(UserSerializer(user).data)

    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def stats(self, request):
        """
        Get user statistics (admin only).
        GET /users/stats/
        """
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()

        membership_stats = {}
        for membership_type, _ in MembershipType.choices:
            membership_stats[membership_type] = User.objects.filter(
                membership_type=membership_type
            ).count()

        return Response({
            'total_users': total_users,
            'active_users': active_users,
            'inactive_users': total_users - active_users,
            'membership_stats': membership_stats,
        })


