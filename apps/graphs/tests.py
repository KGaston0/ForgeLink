from django.test import TestCase
from django.urls import reverse
from django.core.exceptions import ValidationError
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

from .models import Graph, GraphNode
from apps.projects.models import Project
from apps.nodes.models import Node

User = get_user_model()


def get_response_data(response):
    """Helper to get data from paginated or non-paginated responses"""
    if isinstance(response.data, dict) and 'results' in response.data:
        return response.data['results']
    return response.data


class GraphModelTest(TestCase):
    """Tests for the model Graph"""

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
            name='Test Graph',
            description='Test Description'
        )

    def test_graph_creation(self):
        """Test for creation of graph"""
        self.assertEqual(self.graph.name, 'Test Graph')
        self.assertEqual(self.graph.description, 'Test Description')
        self.assertEqual(self.graph.project, self.project)

    def test_graph_str(self):
        """Test for __str__ method"""
        self.assertEqual(str(self.graph), 'Test Project / Test Graph')

    def test_unique_graph_name_per_project(self):
        """Test that graph name is unique per project"""
        with self.assertRaises(Exception):  # IntegrityError
            Graph.objects.create(
                project=self.project,
                name='Test Graph'
            )


class GraphNodeModelTest(TestCase):
    """Tests for the model GraphNode"""

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
        self.node = Node.objects.create(
            project=self.project,
            title='Test Node'
        )
        self.graph_node = GraphNode.objects.create(
            graph=self.graph,
            node=self.node,
            position_x=100.0,
            position_y=200.0,
            color='#FF0000'
        )

    def test_graph_node_creation(self):
        """Test for creation of nodo en graph"""
        self.assertEqual(self.graph_node.graph, self.graph)
        self.assertEqual(self.graph_node.node, self.node)
        self.assertEqual(self.graph_node.position_x, 100.0)
        self.assertEqual(self.graph_node.position_y, 200.0)
        self.assertEqual(self.graph_node.color, '#FF0000')

    def test_graph_node_str(self):
        """Test for __str__ method"""
        self.assertEqual(str(self.graph_node), 'Test Project / Test Graph -> Test Node')

    def test_graph_node_unique_per_graph(self):
        """Test that un nodo can only be once in a graph"""
        with self.assertRaises(Exception):  # IntegrityError
            GraphNode.objects.create(
                graph=self.graph,
                node=self.node
            )

    def test_graph_node_validation_same_project(self):
        """Test for validation that the node must belong to the same project"""
        other_project = Project.objects.create(
            name='Other Project',
            owner=self.user
        )
        other_node = Node.objects.create(
            project=other_project,
            title='Other Node'
        )
        graph_node = GraphNode(
            graph=self.graph,
            node=other_node
        )
        with self.assertRaises(ValidationError):
            graph_node.clean()


class GraphAPITest(APITestCase):
    """Tests for the API of graphs"""

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
        self.graph = Graph.objects.create(
            project=self.project,
            name='Test Graph'
        )

    def test_list_graphs(self):
        """Test for listing graphs"""
        self.client.force_authenticate(user=self.user)
        url = reverse('graph-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = get_response_data(response)
        self.assertEqual(len(data), 1)

    def test_list_only_own_graphs(self):
        """Test that only own graphs propios"""
        other_project = Project.objects.create(
            name='Other Project',
            owner=self.other_user
        )
        Graph.objects.create(
            project=other_project,
            name='Other Graph'
        )
        self.client.force_authenticate(user=self.user)
        url = reverse('graph-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = get_response_data(response)
        self.assertEqual(len(data), 1)

    def test_create_graph(self):
        """Test for creating graph"""
        self.client.force_authenticate(user=self.user)
        url = reverse('graph-list')
        data = {
            'project': self.project.id,
            'name': 'New Graph',
            'description': 'New Description'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Graph.objects.count(), 2)

    def test_retrieve_graph(self):
        """Test for getting a specific graph"""
        self.client.force_authenticate(user=self.user)
        url = reverse('graph-detail', kwargs={'pk': self.graph.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Graph')

    def test_update_graph(self):
        """Test for updating graph"""
        self.client.force_authenticate(user=self.user)
        url = reverse('graph-detail', kwargs={'pk': self.graph.pk})
        data = {'name': 'Updated Graph'}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.graph.refresh_from_db()
        self.assertEqual(self.graph.name, 'Updated Graph')

    def test_delete_graph(self):
        """Test for deleting graph"""
        self.client.force_authenticate(user=self.user)
        url = reverse('graph-detail', kwargs={'pk': self.graph.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Graph.objects.count(), 0)

    def test_filter_graphs_by_project(self):
        """Test for filtering graphs per project"""
        self.client.force_authenticate(user=self.user)
        url = reverse('graph-list')
        response = self.client.get(url, {'project': self.project.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = get_response_data(response)
        self.assertEqual(len(data), 1)

    def test_search_graphs(self):
        """Test for searching de graphs"""
        Graph.objects.create(
            project=self.project,
            name='Main Story Graph'
        )
        self.client.force_authenticate(user=self.user)
        url = reverse('graph-list')
        response = self.client.get(url, {'search': 'Main'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = get_response_data(response)
        self.assertEqual(len(data), 1)

    def test_canvas_endpoint(self):
        """Test for endpoint canvas that returns nodes and connections"""
        node = Node.objects.create(
            project=self.project,
            title='Test Node'
        )
        GraphNode.objects.create(
            graph=self.graph,
            node=node,
            position_x=100.0,
            position_y=200.0
        )

        self.client.force_authenticate(user=self.user)
        url = reverse('graph-canvas', kwargs={'pk': self.graph.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('graph', response.data)
        self.assertIn('nodes', response.data)
        self.assertIn('connections', response.data)
        self.assertEqual(len(response.data['nodes']), 1)


class GraphNodeAPITest(APITestCase):
    """Tests for the API of nodos en graphs"""

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
        self.node = Node.objects.create(
            project=self.project,
            title='Test Node'
        )
        self.graph_node = GraphNode.objects.create(
            graph=self.graph,
            node=self.node,
            position_x=100.0,
            position_y=200.0
        )

    def test_list_graph_nodes(self):
        """Test for listing nodos en graphs"""
        self.client.force_authenticate(user=self.user)
        url = reverse('graphnode-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = get_response_data(response)
        self.assertEqual(len(data), 1)

    def test_create_graph_node(self):
        """Test de agregar nodo a graph"""
        node2 = Node.objects.create(
            project=self.project,
            title='Node 2'
        )
        self.client.force_authenticate(user=self.user)
        url = reverse('graphnode-list')
        data = {
            'graph': self.graph.id,
            'node': node2.id,
            'position_x': 150.0,
            'position_y': 250.0,
            'color': '#00FF00'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(GraphNode.objects.count(), 2)

    def test_update_graph_node_position(self):
        """Test for updating node position in graph"""
        self.client.force_authenticate(user=self.user)
        url = reverse('graphnode-detail', kwargs={'pk': self.graph_node.pk})
        data = {
            'position_x': 300.0,
            'position_y': 400.0
        }
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.graph_node.refresh_from_db()
        self.assertEqual(self.graph_node.position_x, 300.0)
        self.assertEqual(self.graph_node.position_y, 400.0)

    def test_filter_graph_nodes_by_graph(self):
        """Test for filtering nodes by graph"""
        self.client.force_authenticate(user=self.user)
        url = reverse('graphnode-list')
        response = self.client.get(url, {'graph': self.graph.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = get_response_data(response)
        self.assertEqual(len(data), 1)

    def test_delete_graph_node(self):
        """Test for deleting nodo de graph"""
        self.client.force_authenticate(user=self.user)
        url = reverse('graphnode-detail', kwargs={'pk': self.graph_node.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(GraphNode.objects.count(), 0)
