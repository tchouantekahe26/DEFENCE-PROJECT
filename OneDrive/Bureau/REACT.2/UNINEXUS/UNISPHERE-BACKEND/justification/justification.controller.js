import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import AbsenceJustification from './justification.model.js';
import Attendance from '../attendance/attendance.model.js';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'justifications');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// 1. Create Absence Justification (Student)
export const createJustification = async (req, res) => {
  try {
    const studentId = req.user.id;
    const {
      absenceId,
      studentName,
      studentMatric,
      courseId,
      courseCode,
      courseTitle,
      lecturerId,
      lecturerName,
      absenceDate,
      reason,
      comment,
      documentName,
      documentType,
      documentSize,
      documentBase64,
    } = req.body;

    if (!absenceId || !reason || !documentName) {
      return res.status(400).json({ error: 'Absence ID, reason, and supporting document are required.' });
    }

    // File validation
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', '.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(documentName).toLowerCase();
    const isTypeValid = allowedTypes.includes(documentType) || allowedTypes.includes(ext);

    if (!isTypeValid) {
      return res.status(400).json({ error: 'Invalid document type. Allowed types: PDF, JPG, JPEG, PNG.' });
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    if (documentSize && documentSize > MAX_SIZE) {
      return res.status(400).json({ error: 'File size exceeds maximum limit of 5 MB.' });
    }

    // Duplicate Check: A student can only have ONE active (PENDING or APPROVED) justification per absence
    const existingActive = await AbsenceJustification.findOne({
      where: {
        absenceId,
        studentId,
        status: ['PENDING', 'APPROVED'],
      },
    });

    if (existingActive) {
      return res.status(400).json({
        error: `A justification for this absence is already ${existingActive.status}. You cannot submit a duplicate request.`,
      });
    }

    // Safe File Storing
    let savedFilePath = '';
    const safePrefix = `absence_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const cleanFileName = documentName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storedFileName = `${safePrefix}_${cleanFileName}`;

    if (documentBase64) {
      const buffer = Buffer.from(documentBase64.replace(/^data:.*?;base64,/, ''), 'base64');
      const targetPath = path.join(UPLOADS_DIR, storedFileName);
      fs.writeFileSync(targetPath, buffer);
      savedFilePath = targetPath;
    }

    const newJustification = await AbsenceJustification.create({
      absenceId,
      studentId,
      studentName: studentName || req.user.name || 'Student',
      studentMatric: studentMatric || 'MATRIC-001',
      courseId: courseId || 1,
      courseCode: courseCode || 'CS 101',
      courseTitle: courseTitle || 'Course',
      lecturerId: lecturerId || null,
      lecturerName: lecturerName || 'Lecturer',
      absenceDate,
      reason,
      comment: comment || '',
      documentPath: savedFilePath,
      documentUrl: `/api/absence-justifications/document/${storedFileName}`,
      documentName,
      documentType: documentType || ext,
      documentSize: documentSize || 1024,
      status: 'PENDING',
      submittedAt: new Date().toISOString().split('T')[0],
    });

    // Update corresponding attendance status if it exists
    await Attendance.update(
      { status: 'absent', remarks: 'Justification Pending' },
      { where: { id: absenceId } }
    ).catch(() => {});

    res.status(201).json({
      message: 'Your absence justification has been submitted successfully and is awaiting review.',
      justification: newJustification,
    });
  } catch (error) {
    console.error('Error creating justification:', error);
    res.status(500).json({ error: error.message });
  }
};

// 2. Get My Justifications (Student)
export const getMyJustifications = async (req, res) => {
  try {
    const studentId = req.user.id;
    const justifications = await AbsenceJustification.findAll({
      where: { studentId },
      order: [['id', 'DESC']],
    });
    res.status(200).json(justifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Get Justifications according to Role (Teacher/Admin)
export const getJustifications = async (req, res) => {
  try {
    const { role, id } = req.user;
    let whereClause = {};

    if (role === 'teacher') {
      whereClause = { lecturerId: id };
    }

    const justifications = await AbsenceJustification.findAll({
      where: whereClause,
      order: [['id', 'DESC']],
    });

    res.status(200).json(justifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Get Single Justification
export const getJustificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const justification = await AbsenceJustification.findByPk(id);

    if (!justification) {
      return res.status(404).json({ error: 'Justification request not found.' });
    }

    // Role check
    if (req.user.role === 'student' && justification.studentId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to view this justification.' });
    }

    res.status(200).json(justification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Secure Document Access
export const getDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const justification = await AbsenceJustification.findByPk(id);

    if (!justification) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    // RBAC: Student only sees own doc, Teacher sees their course doc, Admin sees all
    if (req.user.role === 'student' && justification.studentId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied: You can only access your own documents.' });
    }
    if (req.user.role === 'teacher' && justification.lecturerId && justification.lecturerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied: Unauthorized course.' });
    }

    if (!justification.documentPath || !fs.existsSync(justification.documentPath)) {
      return res.status(404).json({ error: 'Document file not found on server.' });
    }

    res.download(justification.documentPath, justification.documentName);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. Approve Justification (Teacher / Admin)
export const approveJustification = async (req, res) => {
  try {
    const { id } = req.params;
    const reviewerName = req.user.name || (req.user.role === 'admin' ? 'Administrator' : 'Teacher');

    const justification = await AbsenceJustification.findByPk(id);
    if (!justification) {
      return res.status(404).json({ error: 'Justification request not found.' });
    }

    justification.status = 'APPROVED';
    justification.reviewedAt = new Date().toISOString().split('T')[0];
    justification.reviewedBy = reviewerName;
    await justification.save();

    // Update attendance record to EXCUSED
    await Attendance.update(
      { status: 'excused', remarks: 'Absence Excused via Justification' },
      { where: { id: justification.absenceId } }
    ).catch(() => {});

    res.status(200).json({
      message: `Absence justification approved. Absence is now marked as EXCUSED.`,
      justification,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 7. Reject Justification (Teacher / Admin)
export const rejectJustification = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    const reviewerName = req.user.name || (req.user.role === 'admin' ? 'Administrator' : 'Teacher');

    const justification = await AbsenceJustification.findByPk(id);
    if (!justification) {
      return res.status(404).json({ error: 'Justification request not found.' });
    }

    justification.status = 'REJECTED';
    justification.rejectionReason = rejectionReason || 'Document does not sufficiently justify the absence.';
    justification.reviewedAt = new Date().toISOString().split('T')[0];
    justification.reviewedBy = reviewerName;
    await justification.save();

    // Attendance remains unexcused
    await Attendance.update(
      { status: 'absent', remarks: 'Justification Rejected: Not Excused' },
      { where: { id: justification.absenceId } }
    ).catch(() => {});

    res.status(200).json({
      message: `Absence justification rejected. Absence remains NOT EXCUSED.`,
      justification,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
