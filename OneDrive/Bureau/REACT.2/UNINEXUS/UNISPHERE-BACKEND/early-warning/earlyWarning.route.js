import express from 'express';
import {
  getEarlyWarnings,
  createEarlyWarning,
  updateEarlyWarning,
} from './earlyWarning.controller.js';

const earlyWarningRouter = express.Router();

earlyWarningRouter.get('/', getEarlyWarnings);
earlyWarningRouter.post('/', createEarlyWarning);
earlyWarningRouter.put('/:id', updateEarlyWarning);

export default earlyWarningRouter;
