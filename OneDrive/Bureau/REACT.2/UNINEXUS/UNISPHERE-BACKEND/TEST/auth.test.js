import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import supertest from 'supertest';
import { app } from '../server.js';

describe('Auth API', () => {
  it('registers a new user with valid data', async () => {
    const email = `auth-${Date.now()}@example.com`;
    const response = await supertest(app)
      .post('/api/users/register')
      .send({
        name: 'Auth Test User',
        email,
        password: 'password123',
        role: 'student',
      });

    assert.equal(response.status, 201);
    assert.ok(response.body.token);
    assert.equal(response.body.user.email, email);
  });

  it('rejects duplicate email registration', async () => {
    const email = `duplicate-${Date.now()}@example.com`;

    await supertest(app)
      .post('/api/users/register')
      .send({
        name: 'Dup User',
        email,
        password: 'password123',
        role: 'student',
      });

    const response = await supertest(app)
      .post('/api/users/register')
      .send({
        name: 'Dup User Again',
        email,
        password: 'password123',
        role: 'student',
      });

    assert.equal(response.status, 400);
  });

  it('logs in successfully with valid credentials', async () => {
    const email = `login-${Date.now()}@example.com`;

    await supertest(app)
      .post('/api/users/register')
      .send({
        name: 'Login Test User',
        email,
        password: 'password123',
        role: 'student',
      });

    const response = await supertest(app)
      .post('/api/users/login')
      .send({ email, password: 'password123' });

    assert.equal(response.status, 200);
    assert.ok(response.body.token);
    assert.equal(response.body.user.email, email);
  });

  it('rejects login with wrong password', async () => {
    const email = `wrongpass-${Date.now()}@example.com`;

    await supertest(app)
      .post('/api/users/register')
      .send({
        name: 'Wrong Pass User',
        email,
        password: 'correctPassword',
        role: 'student',
      });

    const response = await supertest(app)
      .post('/api/users/login')
      .send({ email, password: 'wrongPassword' });

    assert.equal(response.status, 401);
  });
});
