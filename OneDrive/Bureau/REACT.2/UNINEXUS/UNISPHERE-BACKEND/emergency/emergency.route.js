import express from 'express';
import {
  getEmergencies,
  createEmergency,
  updateEmergencyStatus,
} from './emergency.controller.js';

const emergencyRouter = express.Router();

emergencyRouter.get('/', getEmergencies);
emergencyRouter.post('/', createEmergency);
emergencyRouter.put('/:id', updateEmergencyStatus);

export default emergencyRouter;
