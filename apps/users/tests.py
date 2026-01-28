from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import User, MembershipType


class UserModelTest(TestCase):
    """Tests for the model User"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            membership_type=MembershipType.FREE
        )

    def test_user_creation(self):
        """Test for creation of usuario"""
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertEqual(self.user.membership_type, MembershipType.FREE)
        self.assertFalse(self.user.is_premium)

    def test_user_str(self):
        """Test for __str__ method"""
        self.assertEqual(str(self.user), 'testuser (free)')

    def test_premium_membership(self):
        """Test for membership premium"""
        self.user.membership_type = MembershipType.PREMIUM
        self.user.save()
        self.assertTrue(self.user.is_premium)


class UserAPITest(APITestCase):
    """Tests for the API of usuarios"""

    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpass123'
        )
        self.regular_user = User.objects.create_user(
            username='regular',
            email='regular@example.com',
            password='regularpass123'
        )

    def test_user_registration(self):
        """Test for user registration"""
        url = reverse('user-list')
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpass123!',
            'password_confirm': 'newpass123!',
            'first_name': 'New',
            'last_name': 'User'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 3)
        self.assertEqual(User.objects.get(username='newuser').membership_type, MembershipType.FREE)

    def test_get_current_user(self):
        """Test for getting current user profile"""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse('user-me')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'regular')

    def test_update_profile(self):
        """Test for updating perfil"""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse('user-me')
        data = {
            'first_name': 'Updated',
            'last_name': 'Name',
            'bio': 'New bio'
        }
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.regular_user.refresh_from_db()
        self.assertEqual(self.regular_user.first_name, 'Updated')
        self.assertEqual(self.regular_user.bio, 'New bio')

    def test_change_password(self):
        """Test for password change"""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse('user-change-password')
        data = {
            'old_password': 'regularpass123',
            'new_password': 'newpass123!',
            'new_password_confirm': 'newpass123!'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify that the new password works
        self.regular_user.refresh_from_db()
        self.assertTrue(self.regular_user.check_password('newpass123!'))

    def test_list_users_admin_only(self):
        """Test that only admin can list users"""
        # Regular user cannot list
        self.client.force_authenticate(user=self.regular_user)
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Admin puede listar
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_upgrade_membership(self):
        """Test for membership update (only admin)"""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('user-upgrade-membership', kwargs={'pk': self.regular_user.pk})
        data = {
            'membership_type': 'premium'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.regular_user.refresh_from_db()
        self.assertEqual(self.regular_user.membership_type, MembershipType.PREMIUM)
        self.assertTrue(self.regular_user.is_premium)


