import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import supertest from 'supertest';
import { app } from '../server.js';

describe('Notification API', () => {
  it('lists notifications', async () => {
    const response = await supertest(app)
      .get('/api/notifications');

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body));
  });

  it('creates a notification', async () => {
    const response = await supertest(app)
      .post('/api/notifications')
      .send({
        userId: 1,
        targetRole: 'student',
        title: 'Welcome',
        message: 'Your account is active.',
        category: 'general',
        type: 'info',
      });

    assert.equal(response.status, 201);
    assert.equal(response.body.title, 'Welcome');
  });
});
