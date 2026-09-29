import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import supertest from 'supertest';
import { app } from '../server.js';

describe('Attendance API', () => {
  it('returns attendance for a given student or course query', async () => {
    const response = await supertest(app)
      .get('/api/attendance')
      .query({ courseId: 1 });

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body));
  });

  it('accepts a batch attendance payload', async () => {
    const response = await supertest(app)
      .post('/api/attendance/batch')
      .send([
        {
          studentId: 1,
          studentName: 'Sample Student',
          matricNumber: 'ST-1',
          courseId: 1,
          courseCode: 'CS101',
          date: '2026-09-22',
          session: 'Morning',
          status: 'present',
          remarks: 'On time',
        },
      ]);

    assert.equal(response.status, 200);
    assert.ok(response.body.records);
  });
});
