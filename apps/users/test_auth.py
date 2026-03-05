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
        self.logout_url = reverse('logout')

    def test_login_success(self):
        """Test successful login returns JWT tokens in httpOnly cookies"""
        data = {
            'username': 'testuser',
            'password': 'TestPass123!'
        }
        response = self.client.post(self.login_url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Login successful')

        # Verify tokens are set in cookies
        self.assertIn('access_token', response.cookies)
        self.assertIn('refresh_token', response.cookies)

        # Verify cookies are httpOnly
        self.assertTrue(response.cookies['access_token']['httponly'])
        self.assertTrue(response.cookies['refresh_token']['httponly'])

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
        """Test token refresh works with refresh token from cookie"""
        # First login to get tokens in cookies
        login_data = {
            'username': 'testuser',
            'password': 'TestPass123!'
        }
        login_response = self.client.post(self.login_url, login_data)

        # Refresh token should be automatically sent via cookie
        # The client should automatically include cookies in subsequent requests
        response = self.client.post(self.refresh_url, {})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Token refreshed successfully')

        # Verify new access token is set in cookie
        self.assertIn('access_token', response.cookies)

    def test_refresh_token_invalid(self):
        """Test token refresh fails with invalid refresh token"""
        # CookieTokenRefreshView reads the token from the refresh_token cookie,
        # so set an invalid value there and post an empty body.
        self.client.cookies['refresh_token'] = 'invalid_token_here'
        response = self.client.post(self.refresh_url, {})

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_auth_me_authenticated(self):
        """Test /auth/me/ returns user info when authenticated via cookie"""
        # Login and get token from cookie
        login_data = {
            'username': 'testuser',
            'password': 'TestPass123!'
        }
        login_response = self.client.post(self.login_url, login_data)
        access_token = login_response.cookies['access_token'].value

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
        """Test accessing protected endpoint with valid token from cookie"""
        # Login and get token from cookie
        login_data = {
            'username': 'testuser',
            'password': 'TestPass123!'
        }
        login_response = self.client.post(self.login_url, login_data)
        access_token = login_response.cookies['access_token'].value

        # Use token to access protected endpoint
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        url = reverse('user-me')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')

    def test_logout_success(self):
        """Test logout successfully clears httpOnly cookies and blacklists token"""
        # First login to get tokens
        login_data = {
            'username': 'testuser',
            'password': 'TestPass123!'
        }
        login_response = self.client.post(self.login_url, login_data)
        access_token = login_response.cookies['access_token'].value
        refresh_token = login_response.cookies['refresh_token'].value

        # Authenticate with token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

        # Perform logout
        response = self.client.post(self.logout_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Logout successful')

        # Verify cookies are cleared (max_age=0 or expired)
        self.assertIn('access_token', response.cookies)
        self.assertIn('refresh_token', response.cookies)
        # Cookies should be deleted (empty value or max_age=0)
        self.assertEqual(response.cookies['access_token'].value, '')
        self.assertEqual(response.cookies['refresh_token'].value, '')

        # Verify refresh token is blacklisted by trying to use it
        refresh_data = {'refresh': refresh_token}
        refresh_response = self.client.post(self.refresh_url, refresh_data)

        # Should fail because token is blacklisted
        self.assertEqual(refresh_response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_unauthenticated(self):
        """Test logout requires authentication"""
        # Try to logout without being authenticated
        response = self.client.post(self.logout_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_with_cookie_only(self):
        """Test logout works when authenticated via cookie (no Authorization header)"""
        # Login to get tokens in cookies
        login_data = {
            'username': 'testuser',
            'password': 'TestPass123!'
        }
        login_response = self.client.post(self.login_url, login_data)

        # Note: Django test client automatically includes cookies from previous responses
        # So the logout endpoint should be able to read the access_token cookie

        # Perform logout (cookies should be sent automatically)
        response = self.client.post(self.logout_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Logout successful')

    def test_refresh_token_rotation(self):
        """Test multiple consecutive token refreshes work with token rotation enabled"""
        # Login to get initial tokens
        login_data = {
            'username': 'testuser',
            'password': 'TestPass123!'
        }
        login_response = self.client.post(self.login_url, login_data)
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)

        # First refresh - should work and return new tokens
        first_refresh = self.client.post(self.refresh_url, {})
        self.assertEqual(first_refresh.status_code, status.HTTP_200_OK)
        self.assertIn('access_token', first_refresh.cookies)
        self.assertIn('refresh_token', first_refresh.cookies)

        # Second refresh - should work with the new rotated refresh token
        second_refresh = self.client.post(self.refresh_url, {})
        self.assertEqual(second_refresh.status_code, status.HTTP_200_OK)
        self.assertIn('access_token', second_refresh.cookies)
        self.assertIn('refresh_token', second_refresh.cookies)

        # Third refresh - should still work
        third_refresh = self.client.post(self.refresh_url, {})
        self.assertEqual(third_refresh.status_code, status.HTTP_200_OK)
        self.assertIn('access_token', third_refresh.cookies)
        self.assertIn('refresh_token', third_refresh.cookies)

