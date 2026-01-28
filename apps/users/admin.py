from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, MembershipType


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin configuration for custom User model"""

    list_display = [
        'username',
        'email',
        'first_name',
        'last_name',
        'membership_type',
        'is_active',
        'is_staff',
        'last_login',
        'created_at',
    ]

    list_filter = [
        'membership_type',
        'is_active',
        'is_staff',
        'is_superuser',
        'email_verified',
        'created_at',
    ]

    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone_number']

    ordering = ['-created_at']

    # Add custom fields to fieldsets
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Membership Information', {
            'fields': (
                'membership_type',
                'membership_start_date',
                'membership_end_date',
            )
        }),
        ('Additional Information', {
            'fields': (
                'phone_number',
                'bio',
                'avatar_url',
                'email_verified',
            )
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
        }),
    )

    readonly_fields = ['created_at', 'updated_at', 'last_login']

    # For user creation form
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Additional Information', {
            'fields': (
                'email',
                'first_name',
                'last_name',
                'membership_type',
            )
        }),
    )

