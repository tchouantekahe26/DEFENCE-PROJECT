import express from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from './student.controller.js';

const studentRouter = express.Router();

studentRouter.get('/', getStudents);
studentRouter.get('/:id', getStudentById);
studentRouter.post('/', createStudent);
studentRouter.put('/:id', updateStudent);
studentRouter.delete('/:id', deleteStudent);

export default studentRouter;
