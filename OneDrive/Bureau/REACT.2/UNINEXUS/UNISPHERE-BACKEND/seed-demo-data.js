/**
 * UniNexus - Demo Data Setup
 * 
 * This script creates demo users in the database for testing.
 * Run this after the backend is running if no users exist.
 * 
 * Usage: node seed-demo-data.js
 */

import User from './user/user.model.js';
import bcrypt from 'bcrypt';
import { sequelize } from './db.connect.js';

const demoUsers = [
  {
    name: 'Alex Johnson',
    email: 'student@uni.edu',
    password: 'password',
    role: 'student',
    identifier: 'STU-2024-001',
    department: 'Computer Science',
    faculty: 'School of Computing',
    program: 'B.Sc. Computer Science',
    level: 'HND 2',
    phone: '+1 555-0101',
    status: 'active',
  },
  {
    name: 'Dr. Sarah Williams',
    email: 'teacher@uni.edu',
    password: 'password',
    role: 'teacher',
    identifier: 'TCH-2024-001',
    department: 'Computer Science',
    faculty: 'School of Computing',
    program: 'Faculty',
    level: 'Lecturer',
    phone: '+1 555-0102',
    status: 'active',
  },
  {
    name: 'Prof. James Anderson',
    email: 'admin@uni.edu',
    password: 'password',
    role: 'admin',
    identifier: 'ADM-2024-001',
    department: 'Administration',
    faculty: 'Central Administration',
    program: 'System Admin',
    level: 'Director',
    phone: '+1 555-0103',
    status: 'active',
  },
  {
    name: 'Emily Davis',
    email: 'student2@uni.edu',
    password: 'password',
    role: 'student',
    identifier: 'STU-2024-002',
    department: 'Engineering',
    faculty: 'School of Engineering',
    program: 'B.Sc. Electrical Engineering',
    level: 'Level 200',
    phone: '+1 555-0104',
    status: 'active',
  },
  {
    name: 'Dr. Michael Brown',
    email: 'teacher2@uni.edu',
    password: 'password',
    role: 'teacher',
    identifier: 'TCH-2024-002',
    department: 'Mathematics',
    faculty: 'School of Computing',
    program: 'Faculty',
    level: 'Senior Lecturer',
    phone: '+1 555-0105',
    status: 'active',
  },
  {
    name: 'Mrs. TCHOUTOUO',
    email: 'tchoutouo@uni.edu',
    password: 'password',
    role: 'teacher',
    identifier: 'TCH-2024-003',
    department: 'Computer Science',
    faculty: 'School of Computing',
    program: 'Faculty',
    level: 'Senior Lecturer',
    phone: '+237 670-001-01',
    status: 'active',
  },
  {
    name: 'Mrs. DZEUFACK',
    email: 'dzeufack@uni.edu',
    password: 'password',
    role: 'teacher',
    identifier: 'TCH-2024-004',
    department: 'Information Systems',
    faculty: 'School of Computing',
    program: 'Faculty',
    level: 'Senior Lecturer',
    phone: '+237 670-001-02',
    status: 'active',
  },
  {
    name: 'Mr. KAPNANG',
    email: 'kapnang@uni.edu',
    password: 'password',
    role: 'teacher',
    identifier: 'TCH-2024-005',
    department: 'Electronics & Hardware',
    faculty: 'School of Engineering',
    program: 'Faculty',
    level: 'Lecturer',
    phone: '+237 670-001-03',
    status: 'active',
  },
  {
    name: 'Mr. EKITY',
    email: 'ekity@uni.edu',
    password: 'password',
    role: 'teacher',
    identifier: 'TCH-2024-006',
    department: 'Mathematics & Statistics',
    faculty: 'School of Computing',
    program: 'Faculty',
    level: 'Lecturer',
    phone: '+237 670-001-04',
    status: 'active',
  },
  {
    name: 'Mr. BENGONO',
    email: 'bengono@uni.edu',
    password: 'password',
    role: 'teacher',
    identifier: 'TCH-2024-007',
    department: 'Languages & Humanities',
    faculty: 'Faculty of Letters',
    program: 'Faculty',
    level: 'Lecturer',
    phone: '+237 670-001-05',
    status: 'active',
  },
  {
    name: 'Mr. TCHOUA',
    email: 'tchoua@uni.edu',
    password: 'password',
    role: 'teacher',
    identifier: 'TCH-2024-008',
    department: 'Web Technologies',
    faculty: 'School of Computing',
    program: 'Faculty',
    level: 'Lecturer',
    phone: '+237 670-001-06',
    status: 'active',
  },
];

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected successfully');

    // Check if users already exist
    const userCount = await User.count();
    if (userCount > 0) {
      console.log(`⚠ Database already has ${userCount} user(s). Skipping seed.`);
      process.exit(0);
    }

    console.log('🌱 Seeding demo users...\n');

    for (const userData of demoUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        ...userData,
        password: hashedPassword,
      });

      console.log(`✓ Created ${user.role}: ${user.name} (${user.email})`);
    }

    console.log('\n✓ Demo data seeded successfully!\n');
    console.log('Demo Accounts:');
    console.log('═══════════════════════════════════════════════════');
    console.log('Role      | Email              | Password');
    console.log('───────────────────────────────────────────────────');
    console.log('Student   | student@uni.edu    | password');
    console.log('Teacher   | teacher@uni.edu    | password');
    console.log('Admin     | admin@uni.edu      | password');
    console.log('═══════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
