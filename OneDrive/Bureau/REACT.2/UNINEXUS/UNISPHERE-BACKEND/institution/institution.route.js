import express from 'express';
import {
  getFaculties,
  createFaculty,
  getDepartments,
  createDepartment,
  getPrograms,
  createProgram,
} from './institution.controller.js';

const institutionRouter = express.Router();

institutionRouter.get('/faculties', getFaculties);
institutionRouter.post('/faculties', createFaculty);
institutionRouter.get('/departments', getDepartments);
institutionRouter.post('/departments', createDepartment);
institutionRouter.get('/programs', getPrograms);
institutionRouter.post('/programs', createProgram);

export default institutionRouter;
