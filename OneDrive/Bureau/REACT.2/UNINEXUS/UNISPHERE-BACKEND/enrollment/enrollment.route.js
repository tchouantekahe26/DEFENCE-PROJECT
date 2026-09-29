import express from 'express';
import {
  getEnrollments,
  createEnrollment,
  updateEnrollmentStatus,
  deleteEnrollment,
} from './enrollment.controller.js';

const enrollmentRouter = express.Router();

enrollmentRouter.get('/', getEnrollments);
enrollmentRouter.post('/', createEnrollment);
enrollmentRouter.put('/:id', updateEnrollmentStatus);
enrollmentRouter.delete('/:id', deleteEnrollment);

export default enrollmentRouter;
