import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import supertest from 'supertest';
import { app } from '../server.js';

describe('Chat API', () => {
  it('gets messages list', async () => {
    const response = await supertest(app)
      .get('/api/chat');

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body));
  });

  it('sends a new message', async () => {
    const response = await supertest(app)
      .post('/api/chat')
      .send({
        senderId: 1,
        senderName: 'Chat Tester',
        senderRole: 'student',
        channelId: 'general',
        content: 'Hello team',
        timestamp: new Date().toISOString(),
      });

    assert.equal(response.status, 201);
    assert.equal(response.body.content, 'Hello team');
  });
});
