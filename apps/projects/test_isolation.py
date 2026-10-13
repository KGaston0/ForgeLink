"""
Regression tests for multi-user isolation: one user must never be able to attach
data to, or read through, another user's projects, graphs, nodes or blueprints.
"""
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.connections.models import ConnectionType
from apps.graphs.models import Graph, GraphNode
from apps.nodes.models import Node, NodeBlueprint
from apps.projects.models import Project

User = get_user_model()


class CrossUserIsolationTest(APITestCase):
    def setUp(self):
        self.attacker = User.objects.create_user(username='attacker', password='testpass123')
        self.victim = User.objects.create_user(username='victim', password='testpass123')

        # Drop the starter projects created by the signal, keep the fixtures explicit
        Project.objects.all().delete()

        self.victim_project = Project.objects.create(name='Victim', owner=self.victim)
        self.victim_graph = Graph.objects.create(project=self.victim_project, name='G')
        self.victim_node = Node.objects.create(project=self.victim_project, title='Secret')
        self.victim_type = ConnectionType.objects.create(project=self.victim_project, name='T')
        self.victim_blueprint = NodeBlueprint.objects.create(creator=self.victim, name='BP')

        self.attacker_project = Project.objects.create(name='Mine', owner=self.attacker)
        self.attacker_graph = Graph.objects.create(project=self.attacker_project, name='Mine')

        self.client.force_authenticate(user=self.attacker)

    def test_cannot_create_node_in_foreign_project(self):
        response = self.client.post(reverse('node-list'), {
            'project': self.victim_project.id, 'title': 'Injected',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(Node.objects.filter(title='Injected').exists())

    def test_cannot_use_foreign_parent_node(self):
        response = self.client.post(reverse('node-list'), {
            'project': self.attacker_project.id,
            'title': 'Child',
            'parent_node': self.victim_node.id,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cannot_use_foreign_blueprint(self):
        response = self.client.post(reverse('node-list'), {
            'project': self.attacker_project.id,
            'title': 'N',
            'blueprint_id': self.victim_blueprint.id,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cannot_create_graph_in_foreign_project(self):
        response = self.client.post(reverse('graph-list'), {
            'project': self.victim_project.id, 'name': 'Injected',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(Graph.objects.filter(name='Injected').exists())

    def test_cannot_create_connection_type_in_foreign_project(self):
        response = self.client.post(reverse('connectiontype-list'), {
            'project': self.victim_project.id, 'name': 'Injected', 'color': '#FFFFFF',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cannot_add_foreign_node_to_own_graph(self):
        response = self.client.post(reverse('graphnode-list'), {
            'graph': self.attacker_graph.id, 'node': self.victim_node.id,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(GraphNode.objects.filter(node=self.victim_node).exists())

    def test_cannot_add_own_node_to_foreign_graph(self):
        mine = Node.objects.create(project=self.attacker_project, title='Mine')
        response = self.client.post(reverse('graphnode-list'), {
            'graph': self.victim_graph.id, 'node': mine.id,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cannot_create_connection_through_foreign_objects(self):
        mine = Node.objects.create(project=self.attacker_project, title='Mine')
        GraphNode.objects.create(graph=self.attacker_graph, node=mine)
        response = self.client.post(reverse('nodeconnection-list'), {
            'graph': self.attacker_graph.id,
            'source_node': mine.id,
            'target_node': self.victim_node.id,
            'connection_type': self.victim_type.id,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cannot_put_foreign_blueprint_in_own_list(self):
        response = self.client.post(reverse('blueprint-list-list'), {
            'name': 'L', 'blueprint_ids': [self.victim_blueprint.id],
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_bulk_rejects_foreign_blueprint(self):
        url = reverse('graph-canvas-bulk', kwargs={'uuid': self.attacker_graph.uuid})
        response = self.client.put(url, {
            'nodes': [{'temp_id': 't1', 'label': 'N', 'blueprint_id': self.victim_blueprint.id}],
            'connections': [],
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(Node.objects.filter(project=self.attacker_project).exists())

    def test_bulk_rejects_foreign_connection_type(self):
        url = reverse('graph-canvas-bulk', kwargs={'uuid': self.attacker_graph.uuid})
        response = self.client.put(url, {
            'nodes': [
                {'temp_id': 'a', 'label': 'A'},
                {'temp_id': 'b', 'label': 'B'},
            ],
            'connections': [{
                'source_temp_id': 'a', 'target_temp_id': 'b',
                'connection_type_id': self.victim_type.id,
            }],
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_bulk_saves_valid_payload(self):
        own_type = ConnectionType.objects.create(project=self.attacker_project, name='Own')
        url = reverse('graph-canvas-bulk', kwargs={'uuid': self.attacker_graph.uuid})
        response = self.client.put(url, {
            'nodes': [
                {'temp_id': 'a', 'label': 'A'},
                {'temp_id': 'b', 'label': 'B'},
            ],
            'connections': [{
                'source_temp_id': 'a', 'target_temp_id': 'b',
                'connection_type_id': own_type.id,
            }],
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(len(response.data['nodes']['created']), 2)
        self.assertEqual(len(response.data['connections']['created']), 1)


class ProjectNestedEndpointsTest(APITestCase):
    """The /projects/{uuid}/nodes/ and /connections/ actions used to crash on a bad import."""

    def setUp(self):
        self.user = User.objects.create_user(username='u', password='testpass123')
        self.project = Project.objects.filter(owner=self.user).first()
        Node.objects.create(project=self.project, title='N')
        self.client.force_authenticate(user=self.user)

    def test_nodes_action(self):
        response = self.client.get(reverse('project-nodes', kwargs={'uuid': self.project.uuid}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_connections_action(self):
        response = self.client.get(reverse('project-connections', kwargs={'uuid': self.project.uuid}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])
