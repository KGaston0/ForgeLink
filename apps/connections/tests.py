from django.test import TestCase
from django.urls import reverse
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

from .models import ConnectionType, NodeConnection
from apps.projects.models import Project
from apps.nodes.models import Node
from apps.graphs.models import Graph, GraphNode

User = get_user_model()


def get_response_data(response):
    """Helper to get data from paginated or non-paginated responses"""
    if isinstance(response.data, dict) and 'results' in response.data:
        return response.data['results']
    return response.data


class ConnectionTypeModelTest(TestCase):
    """Tests for the model ConnectionType"""

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
        self.connection_type = ConnectionType.objects.create(
            project=self.project,
            name='Friend',
            description='Friendship relation',
            color='#FF0000'
        )

    def test_connection_type_creation(self):
        """Test for creation of connection type"""
        self.assertEqual(self.connection_type.name, 'Friend')
        self.assertEqual(self.connection_type.description, 'Friendship relation')
        self.assertEqual(self.connection_type.color, '#FF0000')

    def test_connection_type_str(self):
        """Test for __str__ method"""
        self.assertEqual(str(self.connection_type), 'Test Project - Friend')

    def test_unique_name_per_project(self):
        """Test that name is unique per project"""
        with self.assertRaises(IntegrityError):
            ConnectionType.objects.create(
                project=self.project,
                name='Friend'
            )


class NodeConnectionModelTest(TestCase):
    """Tests for the model NodeConnection"""

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
        self.graph = Graph.objects.create(
            project=self.project,
            name='Test Graph'
        )
        self.node1 = Node.objects.create(
            project=self.project,
            title='Node 1'
        )
        self.node2 = Node.objects.create(
            project=self.project,
            title='Node 2'
        )
        self.connection_type = ConnectionType.objects.create(
            project=self.project,
            name='Related'
        )
        # Agregar nodos al graph
        GraphNode.objects.create(graph=self.graph, node=self.node1)
        GraphNode.objects.create(graph=self.graph, node=self.node2)

    def test_connection_creation(self):
        """Test for connection creation"""
        connection = NodeConnection.objects.create(
            graph=self.graph,
            source_node=self.node1,
            target_node=self.node2,
            connection_type=self.connection_type,
            label='Test connection'
        )
        self.assertEqual(connection.source_node, self.node1)
        self.assertEqual(connection.target_node, self.node2)
        self.assertEqual(connection.label, 'Test connection')

    def test_connection_str(self):
        """Test for __str__ method"""
        connection = NodeConnection.objects.create(
            graph=self.graph,
            source_node=self.node1,
            target_node=self.node2,
            connection_type=self.connection_type
        )
        self.assertEqual(str(connection), 'Node 1 -> Node 2 (Related)')

    def test_connection_cannot_self_connect(self):
        """Test that a node cannot connect to itself"""
        connection = NodeConnection(
            graph=self.graph,
            source_node=self.node1,
            target_node=self.node1,
            connection_type=self.connection_type
        )
        with self.assertRaises(ValidationError):
            connection.clean()


class ConnectionTypeAPITest(APITestCase):
    """Tests for the API of connection types"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.project = Project.objects.create(
            name='Test Project',
            owner=self.user
        )
        self.connection_type = ConnectionType.objects.create(
            project=self.project,
            name='Friend'
        )

    def test_list_connection_types(self):
        """Test for listing connection types"""
        self.client.force_authenticate(user=self.user)
        url = reverse('connectiontype-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = get_response_data(response)
        self.assertEqual(len(data), 1)

    def test_create_connection_type(self):
        """Test for creating connection type"""
        self.client.force_authenticate(user=self.user)
        url = reverse('connectiontype-list')
        data = {
            'project': self.project.id,
            'name': 'Enemy',
            'description': 'Enemy relation',
            'color': '#FF0000'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ConnectionType.objects.count(), 2)

    def test_update_connection_type(self):
        """Test for updating connection type"""
        self.client.force_authenticate(user=self.user)
        url = reverse('connectiontype-detail', kwargs={'pk': self.connection_type.pk})
        data = {'color': '#00FF00'}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.connection_type.refresh_from_db()
        self.assertEqual(self.connection_type.color, '#00FF00')

    def test_delete_connection_type_with_connections(self):
        """Test for deleting connection type with existing connections"""
        # Create a connection using this type
        graph = Graph.objects.create(project=self.project, name='Test Graph')
        node1 = Node.objects.create(project=self.project, title='Node 1')
        node2 = Node.objects.create(project=self.project, title='Node 2')
        GraphNode.objects.create(graph=graph, node=node1)
        GraphNode.objects.create(graph=graph, node=node2)
        NodeConnection.objects.create(
            graph=graph,
            source_node=node1,
            target_node=node2,
            connection_type=self.connection_type
        )

        self.client.force_authenticate(user=self.user)
        url = reverse('connectiontype-detail', kwargs={'pk': self.connection_type.pk})

        # Should return 400 when trying to delete a connection type in use
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Cannot delete connection type', response.data['detail'])


class NodeConnectionAPITest(APITestCase):
    """Tests for the API of node connections"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.project = Project.objects.create(
            name='Test Project',
            owner=self.user
        )
        self.graph = Graph.objects.create(
            project=self.project,
            name='Test Graph'
        )
        self.node1 = Node.objects.create(
            project=self.project,
            title='Node 1'
        )
        self.node2 = Node.objects.create(
            project=self.project,
            title='Node 2'
        )
        self.connection_type = ConnectionType.objects.create(
            project=self.project,
            name='Related'
        )
        GraphNode.objects.create(graph=self.graph, node=self.node1)
        GraphNode.objects.create(graph=self.graph, node=self.node2)
        self.connection = NodeConnection.objects.create(
            graph=self.graph,
            source_node=self.node1,
            target_node=self.node2,
            connection_type=self.connection_type
        )

    def test_list_connections(self):
        """Test for listing conexiones"""
        self.client.force_authenticate(user=self.user)
        url = reverse('nodeconnection-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = get_response_data(response)
        self.assertEqual(len(data), 1)

    def test_create_connection(self):
        """Test for creating connection"""
        node3 = Node.objects.create(project=self.project, title='Node 3')
        GraphNode.objects.create(graph=self.graph, node=node3)

        self.client.force_authenticate(user=self.user)
        url = reverse('nodeconnection-list')
        data = {
            'graph': self.graph.id,
            'source_node': self.node1.id,
            'target_node': node3.id,
            'connection_type': self.connection_type.id,
            'label': 'Test label'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(NodeConnection.objects.count(), 2)

    def test_filter_connections_by_graph(self):
        """Test for filtering conexiones by graph"""
        self.client.force_authenticate(user=self.user)
        url = reverse('nodeconnection-list')
        response = self.client.get(url, {'graph': self.graph.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = get_response_data(response)
        self.assertEqual(len(data), 1)

    def test_delete_connection(self):
        """Test for deleting connection"""
        self.client.force_authenticate(user=self.user)
        url = reverse('nodeconnection-detail', kwargs={'pk': self.connection.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(NodeConnection.objects.count(), 0)
