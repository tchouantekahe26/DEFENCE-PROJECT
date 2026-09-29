import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import supertest from 'supertest';
import { app } from '../server.js';

describe('Timetable API', () => {
  it('gets timetable entries', async () => {
    const response = await supertest(app)
      .get('/api/timetables');

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body));
  });

  it('creates a timetable slot', async () => {
    const response = await supertest(app)
      .post('/api/timetables')
      .send({
        courseCode: 'CS-TEST',
        courseTitle: 'Testing Lab',
        lecturerName: 'Dr. Trial',
        classroom: 'Room 205',
        day: 'Monday',
        startTime: '09:00',
        endTime: '11:00',
        program: 'B.Sc. Computer Science',
        semester: 'Semester 1',
      });

    assert.equal(response.status, 201);
    assert.equal(response.body.courseCode, 'CS-TEST');
  });
});
