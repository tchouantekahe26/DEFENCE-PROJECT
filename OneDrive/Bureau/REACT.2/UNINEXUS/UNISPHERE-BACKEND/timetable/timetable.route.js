import express from 'express';
import {
  getTimetable,
  createTimetableSlot,
  updateTimetableSlot,
  deleteTimetableSlot,
  publishTimetable,
  getPublishedTimetables,
} from './timetable.controller.js';

const timetableRouter = express.Router();

timetableRouter.get('/', getTimetable);
timetableRouter.post('/', createTimetableSlot);
timetableRouter.put('/:id', updateTimetableSlot);
timetableRouter.delete('/:id', deleteTimetableSlot);

// PDF publication & broadcast routes
timetableRouter.post('/publish', publishTimetable);
timetableRouter.get('/published', getPublishedTimetables);

export default timetableRouter;
