import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import supertest from 'supertest';
import { app } from '../server.js';

describe('Emergency API', () => {
  it('lists emergency reports', async () => {
    const response = await supertest(app)
      .get('/api/emergency');

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body));
  });

  it('creates an emergency report', async () => {
    const response = await supertest(app)
      .post('/api/emergency')
      .send({
        userId: 1,
        userName: 'Emergency User',
        userRole: 'student',
        location: 'Block A',
        emergencyType: 'Medical',
        description: 'Student feels unwell',
      });

    assert.equal(response.status, 201);
    assert.equal(response.body.userName, 'Emergency User');
  });
});
