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
    UserAdminSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar usuarios.

    Endpoints:
    - GET /users/ - Listar usuarios (admin only)
    - POST /users/ - Crear usuario (público)
    - GET /users/{id}/ - Obtener usuario específico
    - PUT/PATCH /users/{id}/ - Actualizar usuario
    - DELETE /users/{id}/ - Eliminar usuario (admin only)
    - GET /users/me/ - Obtener perfil del usuario actual
    - PUT/PATCH /users/me/ - Actualizar perfil del usuario actual
    - POST /users/change_password/ - Cambiar contraseña
    - POST /users/{id}/upgrade_membership/ - Actualizar membresía (admin only)
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
        """Definir permisos según la acción"""
        if self.action == 'create':
            # Permitir registro público
            permission_classes = [AllowAny]
        elif self.action in ['list', 'destroy', 'upgrade_membership']:
            # Solo administradores pueden listar todos los usuarios y eliminar
            permission_classes = [IsAdminUser]
        else:
            # Usuarios autenticados para el resto
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """Filtrar queryset según el usuario"""
        queryset = super().get_queryset()

        # Los usuarios regulares solo pueden ver su propio perfil
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
                {"detail": "No tienes permiso para actualizar este usuario."},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().update(request, *args, **kwargs)

    @action(detail=False, methods=['get', 'put', 'patch'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """
        Obtener o actualizar el perfil del usuario actual.
        GET /users/me/ - Obtener perfil
        PUT/PATCH /users/me/ - Actualizar perfil
        """
        user = request.user

        if request.method == 'GET':
            serializer = UserSerializer(user)
            return Response(serializer.data)

        # Para PUT/PATCH
        serializer = UserUpdateSerializer(user, data=request.data, partial=request.method == 'PATCH')
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Retornar con el serializer completo
        return Response(UserSerializer(user).data)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def change_password(self, request):
        """
        Cambiar la contraseña del usuario actual.
        POST /users/change_password/
        Body: {
            "old_password": "...",
            "new_password": "...",
            "new_password_confirm": "..."
        }
        """
        serializer = UserPasswordChangeSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        # Cambiar la contraseña
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()

        # Mantener la sesión activa después del cambio de contraseña
        update_session_auth_hash(request, user)

        return Response(
            {"detail": "Contraseña actualizada correctamente."},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def upgrade_membership(self, request, pk=None):
        """
        Actualizar la membresía de un usuario (solo admin).
        POST /users/{id}/upgrade_membership/
        Body: {
            "membership_type": "premium",
            "membership_start_date": "2026-01-26T00:00:00Z",
            "membership_end_date": "2027-01-26T00:00:00Z"
        }
        """
        user = self.get_object()

        membership_type = request.data.get('membership_type')
        membership_start_date = request.data.get('membership_start_date')
        membership_end_date = request.data.get('membership_end_date')

        if membership_type not in dict(MembershipType.choices):
            return Response(
                {"detail": "Tipo de membresía inválido."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.membership_type = membership_type
        if membership_start_date:
            user.membership_start_date = membership_start_date
        if membership_end_date:
            user.membership_end_date = membership_end_date

        user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def stats(self, request):
        """
        Obtener estadísticas de usuarios (solo admin).
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


