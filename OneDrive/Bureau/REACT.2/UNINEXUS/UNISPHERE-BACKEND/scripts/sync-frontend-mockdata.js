import fs from 'fs';
import path from 'path';
import { connectDB } from '../db.connect.js';
import { Student } from '../models.js';

async function syncFrontend() {
  await connectDB();
  const students = await Student.findAll({ order: [['id', 'ASC']] });

  const mockFilePath = path.resolve('src/data/mockDatabase.ts');
  const content = fs.readFileSync(mockFilePath, 'utf8');

  // Generate student objects
  let studentLines = [];
  studentLines.push('\n  // ==========================================');
  studentLines.push('  // STUDENTS OF CLASS BA2B (Screenshot 1 - 33 Students)');
  studentLines.push('  // ==========================================');

  let ba2aHeaderAdded = false;

  students.forEach((s, idx) => {
    if (s.className === 'BA2A' && !ba2aHeaderAdded) {
      studentLines.push('\n  // ==========================================');
      studentLines.push('  // STUDENTS OF CLASS BA2A (Screenshot 2 - 29 Students)');
      studentLines.push('  // ==========================================');
      ba2aHeaderAdded = true;
    }

    const id = s.className === 'BA2B'
      ? `stu-ba2b-${String(idx + 1).padStart(2, '0')}`
      : `stu-ba2a-${String(idx - 32).padStart(2, '0')}`;

    studentLines.push('  {');
    studentLines.push(`    id: ${JSON.stringify(id)},`);
    studentLines.push(`    name: ${JSON.stringify(s.name)},`);
    studentLines.push(`    email: ${JSON.stringify(s.email)},`);
    studentLines.push(`    role: "student",`);
    studentLines.push(`    identifier: ${JSON.stringify(s.matricNumber)},`);
    studentLines.push(`    department: ${JSON.stringify(s.department || "Computer Science")},`);
    studentLines.push(`    faculty: ${JSON.stringify(s.faculty || "School of Computing")},`);
    studentLines.push(`    program: ${JSON.stringify(s.program || "B.Sc. Computer Science")},`);
    studentLines.push(`    level: ${JSON.stringify(s.level || "Level 2")},`);
    studentLines.push(`    className: ${JSON.stringify(s.className)},`);
    studentLines.push(`    phone: ${JSON.stringify(s.phone || "+237 670-000-000")},`);
    studentLines.push(`    avatar: ${JSON.stringify(s.avatar)},`);
    studentLines.push(`    status: "active",`);
    studentLines.push(`    createdAt: "2024-09-01",`);
    studentLines.push('  },');
  });

  const studentsBlock = studentLines.join('\n');

  // Replace lines between teacher tchoua end and export const initialStudentProfile
  const teacherTchouaEnd = 'coursesTaught: ["WEB 202", "CS 203"],\n    createdAt: "2024-01-15",\n  },';
  const profileStart = 'export const initialStudentProfile: StudentProfile | null = null;';

  const beforeIndex = content.indexOf(teacherTchouaEnd);
  const afterIndex = content.indexOf(profileStart);

  if (beforeIndex === -1 || afterIndex === -1) {
    console.error('Could not locate markers in mockDatabase.ts');
    process.exit(1);
  }

  const newContent =
    content.slice(0, beforeIndex + teacherTchouaEnd.length) +
    '\n' +
    studentsBlock +
    '\n];\n\n' +
    content.slice(afterIndex);

  fs.writeFileSync(mockFilePath, newContent, 'utf8');
  console.log('✓ Successfully synced all 62 students to mockDatabase.ts with updated emails and black avatars!');
  process.exit(0);
}

syncFrontend();
