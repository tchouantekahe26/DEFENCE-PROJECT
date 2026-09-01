import express from 'express';
import {
  getResults,
  saveBatchMarks,
  publishCourseResults,
} from './results.controller.js';

const resultsRouter = express.Router();

resultsRouter.get('/', getResults);
resultsRouter.post('/batch', saveBatchMarks);
resultsRouter.post('/publish', publishCourseResults);

export default resultsRouter;
