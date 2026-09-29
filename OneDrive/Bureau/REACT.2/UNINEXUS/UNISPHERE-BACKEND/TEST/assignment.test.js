import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import supertest from 'supertest';
import { app } from '../server.js';

describe('Assignment API', () => {
  it('gets assignments list', async () => {
    const response = await supertest(app)
      .get('/api/assignments');

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body));
  });

  it('creates a new assignment', async () => {
    const response = await supertest(app)
      .post('/api/assignments')
      .send({
        courseId: 1,
        courseCode: 'CS101',
        courseTitle: 'Intro to Computing',
        lecturerId: 1,
        lecturerName: 'Dr. Lecturer',
        title: 'Assignment Test Task',
        description: 'Write a short report',
        dueDate: '2026-10-01',
        maxScore: 100,
        status: 'active',
      });

    assert.equal(response.status, 201);
    assert.equal(response.body.title, 'Assignment Test Task');
  });
});
