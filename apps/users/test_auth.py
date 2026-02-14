from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()


class JWTAuthenticationTest(APITestCase):
    """Tests for JWT authentication endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!'
        )
        self.login_url = reverse('token_obtain_pair')
        self.refresh_url = reverse('token_refresh')
        self.me_url = reverse('auth_me')

    def test_login_success(self):
        """Test successful login returns JWT tokens"""
        data = {
            'username': 'testuser',
            'password': 'TestPass123!'
        }
        response = self.client.post(self.login_url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_invalid_credentials(self):
        """Test login with wrong password fails"""
        data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, data)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_nonexistent_user(self):
        """Test login with non-existent user fails"""
        data = {
            'username': 'nonexistent',
            'password': 'TestPass123!'
        }
        response = self.client.post(self.login_url, data)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_token_success(self):
        """Test token refresh works with valid refresh token"""
        # First login to get tokens
        login_data = {
            'username': 'testuser',
            'password': 'TestPass123!'
        }
        login_response = self.client.post(self.login_url, login_data)
        refresh_token = login_response.data['refresh']

        # Use refresh token to get new access token
        refresh_data = {'refresh': refresh_token}
        response = self.client.post(self.refresh_url, refresh_data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_refresh_token_invalid(self):
        """Test token refresh fails with invalid refresh token"""
        data = {'refresh': 'invalid_token_here'}
        response = self.client.post(self.refresh_url, data)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_auth_me_authenticated(self):
        """Test /auth/me/ returns user info when authenticated"""
        # Login and get token
        login_data = {
            'username': 'testuser',
            'password': 'TestPass123!'
        }
        login_response = self.client.post(self.login_url, login_data)
        access_token = login_response.data['access']

        # Use token to access /auth/me/
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        response = self.client.get(self.me_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['authenticated'])
        self.assertEqual(response.data['user']['username'], 'testuser')

    def test_auth_me_unauthenticated(self):
        """Test /auth/me/ returns not authenticated when no token"""
        response = self.client.get(self.me_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['authenticated'])

    def test_protected_endpoint_without_token(self):
        """Test accessing protected endpoint without token fails"""
        url = reverse('user-me')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_protected_endpoint_with_token(self):
        """Test accessing protected endpoint with valid token succeeds"""
        # Login and get token
        login_data = {
            'username': 'testuser',
            'password': 'TestPass123!'
        }
        login_response = self.client.post(self.login_url, login_data)
        access_token = login_response.data['access']

        # Use token to access protected endpoint
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        url = reverse('user-me')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')

