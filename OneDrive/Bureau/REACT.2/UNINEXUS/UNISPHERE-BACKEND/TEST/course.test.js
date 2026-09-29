import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import supertest from 'supertest';
import { app } from '../server.js';

describe('Course API', () => {
  it('lists available courses', async () => {
    const response = await supertest(app)
      .get('/api/courses');

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body));
  });

  it('creates a new course', async () => {
    const response = await supertest(app)
      .post('/api/courses')
      .send({
        code: `CS-${Date.now()}`,
        title: 'Software Testing',
        creditHours: 3,
        department: 'Computer Science',
        faculty: 'School of Computing',
        level: 'HND 2',
        semester: 'Semester 1',
        lecturerName: 'Dr. Test',
        description: 'Testing fundamentals',
      });

    assert.equal(response.status, 201);
    assert.ok(response.body.id);
  });
});
