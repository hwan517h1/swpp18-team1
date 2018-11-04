from django.test import TestCase, Client
from django.contrib.auth.models import User
from .models import Channel, ChannelMessage

import json

class ChatTestCase(TestCase):

    def setUp(self):
        self.user1 = User.objects.create_user(username="iu", password="12341234")
        self.channel1 = Channel.objects.create(title="music box", manager=self.user1)
        self.message1 = ChannelMessage.objects.create(sender=self.user1, channel=self.channel1, content="hi")

    def test_channel_create(self):
        client = Client(enforce_csrf_checks=True)

        response = client.post('/api/channel', json.dumps({'title': 'test1234'}),
                content_type='application/json')
        self.assertEqual(response.status_code, 201) # created

        response = client.put('/api/channel', json.dumps({'title': 'test'}),
                content_type='application/json')
        self.assertEqual(response.status_code, 405) # not allowed

        response = client.post('/api/channel', json.dumps({'title1': 'test', 'content2': 'test, test'}),
                content_type='application/json')
        self.assertEqual(response.status_code, 400) # Bad Request

    def test_channel_detail(self):
        client = Client(enforce_csrf_checks=True)

        response = client.get('/api/channel/1')
        self.assertEqual(response.status_code, 200) # created
        channel = json.loads(response.content)
        self.assertEqual(self.channel1.id, channel["id"])
        self.assertEqual(self.channel1.manager_id, channel["manager_id"])
        self.assertEqual(self.channel1.title, channel["title"])

        response = client.get('/api/channel/100')
        self.assertEqual(response.status_code, 404) # not found

        response = client.put('/api/channel/1')
        self.assertEqual(response.status_code, 405) # not allowed

    def test_channel_message(self):

        client = Client(enforce_csrf_checks=True)
        response = client.get('/api/channel/1/message')
        self.assertEqual(response.status_code, 200) # success
        messages = json.loads(response.content)
        self.assertEqual(1, len(messages)) # not found
        self.assertEqual(self.message1.content, messages[0]["content"])
        self.assertEqual(self.message1.sender_id, messages[0]["sender_id"])
        self.assertEqual(self.message1.channel_id, messages[0]["channel_id"])

        response = client.get('/api/channel/100/message')
        self.assertEqual(response.status_code, 404) # not found
        response = client.put('/api/channel/1/message')
        self.assertEqual(response.status_code, 405) # not allowed


