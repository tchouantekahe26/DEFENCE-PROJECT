import express from 'express';
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from './course.controller.js';

const courseRouter = express.Router();

courseRouter.get('/', getCourses);
courseRouter.post('/', createCourse);
courseRouter.put('/:id', updateCourse);
courseRouter.delete('/:id', deleteCourse);

export default courseRouter;
