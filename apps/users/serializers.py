from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, MembershipType


class UserSerializer(serializers.ModelSerializer):
    """Serializer for reading users"""

    membership_type_display = serializers.CharField(
        source='get_membership_type_display',
        read_only=True
    )
    is_premium = serializers.BooleanField(read_only=True)
    membership_active = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'membership_type',
            'membership_type_display',
            'membership_start_date',
            'membership_end_date',
            'last_login',
            'phone_number',
            'bio',
            'avatar_url',
            'email_verified',
            'is_active',
            'is_staff',
            'is_premium',
            'membership_active',
            'date_joined',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'date_joined',
            'created_at',
            'updated_at',
            'last_login',
            'is_staff',
        ]


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for user creation"""

    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
            'password_confirm',
            'first_name',
            'last_name',
            'phone_number',
            'bio',
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError(
                {"password": "Passwords do not match."}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for user update"""

    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'email',
            'phone_number',
            'bio',
            'avatar_url',
        ]


class UserPasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change"""

    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(
        required=True,
        write_only=True,
        validators=[validate_password]
    )
    new_password_confirm = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError(
                {"new_password": "Passwords do not match."}
            )
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value


class UserAdminSerializer(serializers.ModelSerializer):
    """Serializer for administrators (includes more fields)"""

    membership_type_display = serializers.CharField(
        source='get_membership_type_display',
        read_only=True
    )

    class Meta:
        model = User
        fields = '__all__'
        read_only_fields = ['id', 'date_joined', 'created_at', 'updated_at', 'last_login']
        extra_kwargs = {
            'password': {'write_only': True}
        }
