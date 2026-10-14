"""Removing a node from a graph must not leave orphaned Nodes or stale connections."""
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.connections.models import ConnectionType, NodeConnection
from apps.graphs.models import Graph, GraphNode
from apps.nodes.models import Node
from apps.projects.models import Project

User = get_user_model()


class GraphNodeDeletionTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='owner', password='testpass123')
        Project.objects.all().delete()  # drop the starter project created on signup
        self.project = Project.objects.create(name='P', owner=self.user)
        self.graph = Graph.objects.create(project=self.project, name='G1')
        self.other_graph = Graph.objects.create(project=self.project, name='G2')
        self.ctype = ConnectionType.objects.create(project=self.project, name='links')
        self.client.force_authenticate(user=self.user)

    def place(self, graph, title, parent=None, node=None, is_frame=False):
        node = node or Node.objects.create(project=self.project, title=title)
        gn = GraphNode.objects.create(graph=graph, node=node, parent_node=parent, is_frame=is_frame)
        return node, gn

    def connect(self, graph, a, b):
        return NodeConnection.objects.create(
            graph=graph, source_node=a, target_node=b, connection_type=self.ctype,
        )

    def delete_gn(self, gn):
        return self.client.delete(reverse('graphnode-detail', kwargs={'pk': gn.pk}))

    def test_node_only_on_this_graph_is_deleted_with_its_connections(self):
        a, gn_a = self.place(self.graph, 'A')
        b, _ = self.place(self.graph, 'B')
        self.connect(self.graph, a, b)

        self.assertEqual(self.delete_gn(gn_a).status_code, status.HTTP_204_NO_CONTENT)

        self.assertFalse(Node.objects.filter(pk=a.pk).exists())
        self.assertTrue(Node.objects.filter(pk=b.pk).exists())
        self.assertEqual(NodeConnection.objects.count(), 0)

    def test_shared_node_stays_in_project_and_other_graph(self):
        a, gn_a = self.place(self.graph, 'A')
        b, _ = self.place(self.graph, 'B')
        self.place(self.other_graph, 'A again', node=a)
        c, _ = self.place(self.other_graph, 'C')
        self.connect(self.graph, a, b)
        kept = self.connect(self.other_graph, a, c)

        self.assertEqual(self.delete_gn(gn_a).status_code, status.HTTP_204_NO_CONTENT)

        self.assertTrue(Node.objects.filter(pk=a.pk).exists())
        self.assertTrue(GraphNode.objects.filter(graph=self.other_graph, node=a).exists())
        self.assertFalse(GraphNode.objects.filter(graph=self.graph, node=a).exists())
        # Only this graph's connection goes away
        self.assertEqual(list(NodeConnection.objects.all()), [kept])

    def test_deleting_a_frame_removes_its_contents(self):
        frame, gn_frame = self.place(self.graph, 'Frame', is_frame=True)
        child, gn_child = self.place(self.graph, 'Child', parent=gn_frame)
        grandchild, _ = self.place(self.graph, 'Grandchild', parent=gn_child)
        shared, _ = self.place(self.graph, 'Shared', parent=gn_frame)
        self.place(self.other_graph, 'Shared elsewhere', node=shared)
        outside, _ = self.place(self.graph, 'Outside')
        self.connect(self.graph, grandchild, outside)

        self.assertEqual(self.delete_gn(gn_frame).status_code, status.HTTP_204_NO_CONTENT)

        for gone in (frame, child, grandchild):
            self.assertFalse(Node.objects.filter(pk=gone.pk).exists(), gone.title)
        self.assertTrue(Node.objects.filter(pk=shared.pk).exists())
        self.assertTrue(Node.objects.filter(pk=outside.pk).exists())
        self.assertEqual(NodeConnection.objects.count(), 0)
        self.assertEqual(GraphNode.objects.filter(graph=self.graph).count(), 1)  # only "Outside"

    def test_cannot_delete_another_users_graph_node(self):
        _, gn = self.place(self.graph, 'Mine')
        intruder = User.objects.create_user(username='intruder', password='testpass123')
        self.client.force_authenticate(user=intruder)

        self.assertEqual(self.delete_gn(gn).status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(GraphNode.objects.filter(pk=gn.pk).exists())
