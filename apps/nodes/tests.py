from django.test import TestCase
from django.urls import reverse
from django.core.exceptions import ValidationError
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

from .models import Node
from apps.projects.models import Project

User = get_user_model()


def get_response_data(response):
    """Helper to get data from paginated or non-paginated responses"""
    if isinstance(response.data, dict) and 'results' in response.data:
        return response.data['results']
    return response.data


class NodeModelTest(TestCase):
    """Tests for the model Node"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.project = Project.objects.create(
            name='Test Project',
            owner=self.user
        )
        self.node = Node.objects.create(
            project=self.project,
            title='Test Node',
            node_type='character',
            content='Test content'
        )

    def test_node_creation(self):
        """Test for creation of nodo"""
        self.assertEqual(self.node.title, 'Test Node')
        self.assertEqual(self.node.node_type, 'character')
        self.assertEqual(self.node.content, 'Test content')
        self.assertEqual(self.node.project, self.project)

    def test_node_str(self):
        """Test for __str__ method"""
        self.assertEqual(str(self.node), 'Test Node (character)')

    def test_node_types(self):
        """Test for types of available nodes"""
        node_types = [choice[0] for choice in Node.NODE_TYPES]
        self.assertIn('character', node_types)
        self.assertIn('location', node_types)
        self.assertIn('event', node_types)
        self.assertIn('item', node_types)
        self.assertIn('concept', node_types)
        self.assertIn('note', node_types)

    def test_node_hierarchy(self):
        """Test for hierarchy de nodos (parent-child)"""
        child_node = Node.objects.create(
            project=self.project,
            title='Child Node',
            parent_node=self.node
        )
        self.assertEqual(child_node.parent_node, self.node)
        self.assertIn(child_node, self.node.child_nodes.all())

    def test_node_cannot_be_its_own_parent(self):
        """Test that a node cannot be its own parent"""
        self.node.parent_node = self.node
        with self.assertRaises(ValidationError):
            self.node.clean()


class NodeAPITest(APITestCase):
    """Tests for the API of nodos"""

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
            owner=self.user
        )
        self.node = Node.objects.create(
            project=self.project,
            title='Test Node',
            node_type='character',
            content='Test content'
        )

    def test_list_nodes_authenticated(self):
        """Test for listing nodos authenticated"""
        self.client.force_authenticate(user=self.user)
        url = reverse('node-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = get_response_data(response)
        self.assertEqual(len(data), 1)

    def test_list_nodes_unauthenticated(self):
        """Test for listing nodes without authentication"""
        url = reverse('node-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_only_own_nodes(self):
        """Test that only own nodos propios"""
        other_project = Project.objects.create(
            name='Other Project',
            owner=self.other_user
        )
        Node.objects.create(
            project=other_project,
            title='Other Node'
        )
        self.client.force_authenticate(user=self.user)
        url = reverse('node-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = get_response_data(response)
        self.assertEqual(len(data), 1)

    def test_create_node(self):
        """Test for creation of nodo"""
        self.client.force_authenticate(user=self.user)
        url = reverse('node-list')
        data = {
            'project': self.project.id,
            'title': 'New Node',
            'node_type': 'location',
            'content': 'New content'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Node.objects.count(), 2)
        self.assertEqual(response.data['title'], 'New Node')

    def test_retrieve_node(self):
        """Test for getting a specific node"""
        self.client.force_authenticate(user=self.user)
        url = reverse('node-detail', kwargs={'pk': self.node.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Node')

    def test_update_node(self):
        """Test for node update"""
        self.client.force_authenticate(user=self.user)
        url = reverse('node-detail', kwargs={'pk': self.node.pk})
        data = {'title': 'Updated Node'}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.node.refresh_from_db()
        self.assertEqual(self.node.title, 'Updated Node')

    def test_delete_node(self):
        """Test for node deletion"""
        self.client.force_authenticate(user=self.user)
        url = reverse('node-detail', kwargs={'pk': self.node.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Node.objects.count(), 0)

    def test_filter_nodes_by_project(self):
        """Test de filtering nodes by project"""
        self.client.force_authenticate(user=self.user)
        url = reverse('node-list')
        response = self.client.get(url, {'project': self.project.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = get_response_data(response)
        self.assertEqual(len(data), 1)

    def test_filter_nodes_by_type(self):
        """Test de filtering nodes by type"""
        Node.objects.create(
            project=self.project,
            title='Location Node',
            node_type='location'
        )
        self.client.force_authenticate(user=self.user)
        url = reverse('node-list')
        response = self.client.get(url, {'node_type': 'character'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = get_response_data(response)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['node_type'], 'character')

    def test_search_nodes(self):
        """Test for node searching"""
        Node.objects.create(
            project=self.project,
            title='Hero Character',
            content='A brave hero'
        )
        self.client.force_authenticate(user=self.user)
        url = reverse('node-list')
        response = self.client.get(url, {'search': 'Hero'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = get_response_data(response)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['title'], 'Hero Character')

    def test_get_node_children(self):
        """Test for getting hijos de un nodo"""
        Node.objects.create(
            project=self.project,
            title='Child 1',
            parent_node=self.node
        )
        Node.objects.create(
            project=self.project,
            title='Child 2',
            parent_node=self.node
        )
        self.client.force_authenticate(user=self.user)
        url = reverse('node-children', kwargs={'pk': self.node.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = get_response_data(response)
        self.assertEqual(len(data), 2)
