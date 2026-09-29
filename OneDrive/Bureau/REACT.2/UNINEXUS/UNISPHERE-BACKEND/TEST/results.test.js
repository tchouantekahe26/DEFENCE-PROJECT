import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import supertest from 'supertest';
import { app } from '../server.js';

describe('Results API', () => {
  it('gets results list', async () => {
    const response = await supertest(app)
      .get('/api/results');

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body));
  });

  it('creates result rows in batch', async () => {
    const response = await supertest(app)
      .post('/api/results/batch')
      .send([
        {
          studentId: 1,
          studentName: 'Student One',
          matricNumber: 'ST-001',
          courseId: 1,
          courseCode: 'CS101',
          courseTitle: 'Intro to Computing',
          courseworkMark: 70,
          examMark: 80,
          totalMark: 150,
          grade: 'A',
          gradePoint: 4.0,
          status: 'draft',
        },
      ]);

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body));
  });
});
