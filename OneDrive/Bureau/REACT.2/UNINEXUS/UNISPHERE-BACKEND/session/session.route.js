import express from 'express';
import {
  getSessions,
  getActiveSession,
  createSession,
  updateSession,
} from './session.controller.js';

const sessionRouter = express.Router();

sessionRouter.get('/', getSessions);
sessionRouter.get('/active', getActiveSession);
sessionRouter.post('/', createSession);
sessionRouter.put('/:id', updateSession);

export default sessionRouter;
