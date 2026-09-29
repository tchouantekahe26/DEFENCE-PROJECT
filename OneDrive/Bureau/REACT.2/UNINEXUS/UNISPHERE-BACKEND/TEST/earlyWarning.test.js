import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import supertest from 'supertest';
import { app } from '../server.js';

describe('Early Warning API', () => {
  it('lists early warning records', async () => {
    const response = await supertest(app)
      .get('/api/early-warnings');

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body));
  });

  it('creates an early warning alert', async () => {
    const response = await supertest(app)
      .post('/api/early-warnings')
      .send({
        studentId: 1,
        studentName: 'Risk Student',
        matricNumber: 'RW-999',
        program: 'B.Sc. Computer Science',
        department: 'Computer Science',
        level: 'HND 2',
        riskType: 'Low Attendance',
        attendanceRate: 45,
      });

    assert.equal(response.status, 201);
    assert.equal(response.body.studentName, 'Risk Student');
  });
});
