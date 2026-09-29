import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import supertest from 'supertest';
import { app } from '../server.js';

describe('User API', () => {
  it('returns all users for an admin', async () => {
    const adminEmail = `admin-${Date.now()}@example.com`;
    const registerResponse = await supertest(app)
      .post('/api/users/register')
      .send({
        name: 'Admin User',
        email: adminEmail,
        password: 'password123',
        role: 'admin',
      });

    const response = await supertest(app)
      .get('/api/users/get-all-users')
      .set('Authorization', `Bearer ${registerResponse.body.token}`);

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body));
  });

  it('denies users list without auth token', async () => {
    const response = await supertest(app)
      .get('/api/users/get-all-users');

    assert.equal(response.status, 401);
  });
});
