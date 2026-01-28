from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class MembershipType(models.TextChoices):
    """Available membership types"""
    FREE = 'free', 'Free'
    BASIC = 'basic', 'Basic'
    PREMIUM = 'premium', 'Premium'
    ENTERPRISE = 'enterprise', 'Enterprise'


class User(AbstractUser):
    """
    Custom user model extending Django's AbstractUser.
    Includes additional fields like membership type and last login.
    """
    # Additional custom fields
    membership_type = models.CharField(
        max_length=20,
        choices=MembershipType.choices,
        default=MembershipType.FREE,
        verbose_name='Membership Type'
    )

    membership_start_date = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Membership start date'
    )

    membership_end_date = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Membership end date'
    )

    phone_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name='Phone number'
    )

    bio = models.TextField(
        blank=True,
        null=True,
        verbose_name='Biography'
    )

    avatar_url = models.URLField(
        blank=True,
        null=True,
        verbose_name='Avatar URL'
    )

    email_verified = models.BooleanField(
        default=False,
        verbose_name='Email verified'
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Created at'
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Last updated'
    )

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.username} ({self.membership_type})"

    @property
    def is_premium(self):
        """Check if user has premium or higher membership"""
        return self.membership_type in [MembershipType.PREMIUM, MembershipType.ENTERPRISE]

    @property
    def membership_active(self):
        """Check if membership is active"""
        if self.membership_type == MembershipType.FREE:
            return True
        if self.membership_end_date:
            return self.membership_end_date > timezone.now()
        return True

