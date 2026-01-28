from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

from .models import Project

User = get_user_model()


def get_response_data(response):
    """Helper to get data from paginated or non-paginated responses"""
    if isinstance(response.data, dict) and 'results' in response.data:
        return response.data['results']
    return response.data


class ProjectModelTest(TestCase):
    """Tests for the Project model"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.project = Project.objects.create(
            name='Test Project',
            description='Test Description',
            owner=self.user
        )

    def test_project_creation(self):
        """Test project creation"""
        self.assertEqual(self.project.name, 'Test Project')
        self.assertEqual(self.project.description, 'Test Description')
        self.assertEqual(self.project.owner, self.user)

    def test_project_str(self):
        """Test __str__ method"""
        self.assertEqual(str(self.project), 'Test Project')

    def test_project_ordering(self):
        """Test ordering by updated_at"""
        project2 = Project.objects.create(
            name='Second Project',
            owner=self.user
        )
        projects = list(Project.objects.all())
        self.assertEqual(projects[0], project2)  # Most recent first


class ProjectAPITest(APITestCase):
    """Tests for the projects API"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='testpass123'
        )
        self.project = Project.objects.create(
            name='Test Project',
            description='Test Description',
            owner=self.user
        )

    def test_list_projects_unauthenticated(self):
        """Test listing projects without authentication"""
        url = reverse('project-list')
        response = self.client.get(url)
        # Should return 401 with IsAuthenticated permission class
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_projects_authenticated(self):
        """Test listing projects when authenticated"""
        self.client.force_authenticate(user=self.user)
        url = reverse('project-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = get_response_data(response)
        self.assertEqual(len(data), 1)

    def test_list_only_own_projects(self):
        """Test that only own projects are listed"""
        Project.objects.create(
            name='Other Project',
            owner=self.other_user
        )
        self.client.force_authenticate(user=self.user)
        url = reverse('project-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = get_response_data(response)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['name'], 'Test Project')

    def test_create_project(self):
        """Test project creation"""
        self.client.force_authenticate(user=self.user)
        url = reverse('project-list')
        data = {
            'name': 'New Project',
            'description': 'New Description'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 2)
        self.assertEqual(response.data['name'], 'New Project')
        self.assertEqual(response.data['owner'], self.user.id)

    def test_create_project_unauthenticated(self):
        """Test project creation without authentication"""
        url = reverse('project-list')
        data = {'name': 'New Project'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_project(self):
        """Test retrieving a specific project"""
        self.client.force_authenticate(user=self.user)
        url = reverse('project-detail', kwargs={'pk': self.project.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Project')

    def test_update_project(self):
        """Test project update"""
        self.client.force_authenticate(user=self.user)
        url = reverse('project-detail', kwargs={'pk': self.project.pk})
        data = {'name': 'Updated Project'}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.project.refresh_from_db()
        self.assertEqual(self.project.name, 'Updated Project')

    def test_delete_project(self):
        """Test project deletion"""
        self.client.force_authenticate(user=self.user)
        url = reverse('project-detail', kwargs={'pk': self.project.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Project.objects.count(), 0)

    def test_cannot_access_other_user_project(self):
        """Test that other users' projects cannot be accessed"""
        other_project = Project.objects.create(
            name='Other Project',
            owner=self.other_user
        )
        self.client.force_authenticate(user=self.user)
        url = reverse('project-detail', kwargs={'pk': other_project.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_search_projects(self):
        """Test project search"""
        Project.objects.create(
            name='Django Project',
            description='A Django app',
            owner=self.user
        )
        self.client.force_authenticate(user=self.user)
        url = reverse('project-list')
        response = self.client.get(url, {'search': 'Django'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = get_response_data(response)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['name'], 'Django Project')
