import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import supertest from 'supertest';
import { app } from '../server.js';

describe('Announcement API', () => {
  it('gets announcements list', async () => {
    const response = await supertest(app)
      .get('/api/announcements');

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body));
  });

  it('creates an announcement for teachers or admin', async () => {
    const email = `ann-${Date.now()}@example.com`;
    const registerResponse = await supertest(app)
      .post('/api/users/register')
      .send({
        name: 'Teacher Announcer',
        email,
        password: 'password123',
        role: 'teacher',
      });

    const token = registerResponse.body.token;
    const response = await supertest(app)
      .post('/api/announcements')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Exam Notice',
        description: 'Mid-semester exam starts next week',
        author: 'Teacher Announcer',
        authorRole: 'Teacher',
        targetAudience: 'All',
      });

    assert.equal(response.status, 201);
    assert.equal(response.body.title, 'Exam Notice');
  });
});
