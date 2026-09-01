import express from 'express';
import {
  createJustification,
  getMyJustifications,
  getJustifications,
  getJustificationById,
  getDocument,
  approveJustification,
  rejectJustification,
} from './justification.controller.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// Student routes
router.post('/', authenticateToken, authorizeRole(['student']), createJustification);
router.get('/my', authenticateToken, authorizeRole(['student']), getMyJustifications);

// Multi-role routes (Teacher / Admin / Student)
router.get('/', authenticateToken, authorizeRole(['teacher', 'admin']), getJustifications);
router.get('/:id', authenticateToken, getJustificationById);
router.get('/:id/document', authenticateToken, getDocument);

// Approval & Rejection routes (Teacher / Admin)
router.put('/:id/approve', authenticateToken, authorizeRole(['teacher', 'admin']), approveJustification);
router.put('/:id/reject', authenticateToken, authorizeRole(['teacher', 'admin']), rejectJustification);

export default router;
