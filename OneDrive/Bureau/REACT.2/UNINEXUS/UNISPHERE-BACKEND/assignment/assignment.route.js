import express from 'express';
import {
  getAssignments,
  createAssignment,
  getSubmissions,
  submitAssignment,
  gradeSubmission,
} from './assignment.controller.js';

const assignmentRouter = express.Router();

assignmentRouter.get('/', getAssignments);
assignmentRouter.post('/', createAssignment);
assignmentRouter.get('/submissions', getSubmissions);
assignmentRouter.post('/submissions', submitAssignment);
assignmentRouter.put('/submissions/:id', gradeSubmission);

export default assignmentRouter;
