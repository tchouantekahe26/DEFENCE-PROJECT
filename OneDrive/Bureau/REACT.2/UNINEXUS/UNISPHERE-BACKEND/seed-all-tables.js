import { connectDB, sequelize } from './db.connect.js';
import {
  User,
  Course,
  Enrollment,
  TimetableSlot,
  AcademicSession,
  Assignment,
  AssignmentSubmission,
  Announcement,
  Notification,
  EmergencyReport,
  EarlyWarning,
  ChatMessage,
  Faculty,
  Department,
  Program,
  Attendance,
  Result,
  Student,
} from './models.js';

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Seeding initial data for new tables...\n');

    // 1. Faculties
    if ((await Faculty.count()) === 0) {
      await Faculty.bulkCreate([
        { name: 'School of Computing', code: 'SC', dean: 'Prof. Alan Turing', departmentsCount: 2 },
        { name: 'School of Engineering', code: 'SE', dean: 'Prof. Nikola Tesla', departmentsCount: 3 },
      ]);
      console.log('✓ Seeded Faculties');
    }

    // 2. Departments
    if ((await Department.count()) === 0) {
      await Department.bulkCreate([
        { name: 'Computer Science', code: 'CS', faculty: 'School of Computing', headOfDepartment: 'Dr. Sarah Williams', totalStudents: 250, totalTeachers: 14, totalCourses: 18 },
        { name: 'Electrical Engineering', code: 'EE', faculty: 'School of Engineering', headOfDepartment: 'Dr. Michael Brown', totalStudents: 180, totalTeachers: 10, totalCourses: 15 },
      ]);
      console.log('✓ Seeded Departments');
    }

    // 3. Programs
    if ((await Program.count()) === 0) {
      await Program.bulkCreate([
        { name: 'B.Sc. Computer Science', code: 'BSC-CS', department: 'Computer Science', durationYears: 4, levels: ['HND 1', 'HND 2', 'Level 300', 'Level 400'] },
        { name: 'B.Sc. Electrical Engineering', code: 'BSC-EE', department: 'Electrical Engineering', durationYears: 4, levels: ['Level 100', 'Level 200', 'Level 300', 'Level 400'] },
      ]);
      console.log('✓ Seeded Programs');
    }

    // 4. Academic Sessions
    if ((await AcademicSession.count()) === 0) {
      await AcademicSession.create({
        name: '2024/2025',
        currentSemester: 'Semester 1',
        startDate: '2024-09-01',
        endDate: '2025-01-31',
        registrationOpen: true,
        resultsPublished: true,
        isActive: true,
      });
      console.log('✓ Seeded AcademicSession');
    }

    // 5. Courses
    if ((await Course.count()) === 0) {
      await Course.bulkCreate([
        {
          code: 'CS 201',
          title: 'Data Structures and Algorithms',
          creditHours: 3,
          department: 'Computer Science',
          faculty: 'School of Computing',
          level: 'HND 2',
          semester: 'Semester 1',
          lecturerName: 'Dr. Sarah Williams',
          description: 'Fundamental data structures including lists, trees, graphs, and search/sort algorithms.',
          classroom: 'Room 101',
          scheduleDays: 'Monday, Wednesday',
          scheduleTime: '08:00 - 10:00',
          capacity: 60,
          enrolledCount: 45,
        },
        {
          code: 'CS 302',
          title: 'Database Management Systems',
          creditHours: 3,
          department: 'Computer Science',
          faculty: 'School of Computing',
          level: 'HND 2',
          semester: 'Semester 1',
          lecturerName: 'Dr. Sarah Williams',
          description: 'Relational database design, SQL querying, indexing, and normalization.',
          classroom: 'Room 102',
          scheduleDays: 'Tuesday, Thursday',
          scheduleTime: '10:00 - 12:00',
          capacity: 60,
          enrolledCount: 40,
        },
        {
          code: 'CS 405',
          title: 'Artificial Intelligence',
          creditHours: 4,
          department: 'Computer Science',
          faculty: 'School of Computing',
          level: 'HND 2',
          semester: 'Semester 1',
          lecturerName: 'Dr. Sarah Williams',
          description: 'Introduction to machine learning, search heuristics, and knowledge representation.',
          classroom: 'Lab 3',
          scheduleDays: 'Wednesday',
          scheduleTime: '13:00 - 16:00',
          capacity: 50,
          enrolledCount: 38,
        },
        {
          code: 'UML 201',
          title: 'UML',
          creditHours: 4,
          department: 'Computer Science',
          faculty: 'School of Computing',
          level: 'Level 2',
          semester: 'Semester 2',
          lecturerName: 'Mrs. TCHOUTOUO',
          description: 'Unified Modeling Language: class diagrams, use cases, and software architecture.',
          classroom: 'BA2A',
          scheduleDays: 'Monday, Friday, Saturday',
          scheduleTime: '07:30 - 09:30',
          capacity: 60,
          enrolledCount: 52,
        },
        {
          code: 'MER 201',
          title: 'MERISE',
          creditHours: 4,
          department: 'Information Systems',
          faculty: 'School of Computing',
          level: 'Level 2',
          semester: 'Semester 2',
          lecturerName: 'Mrs. DZEUFACK',
          description: 'Information systems design method: conceptual, logical, and physical modeling.',
          classroom: 'BA2A',
          scheduleDays: 'Tuesday, Wednesday',
          scheduleTime: '07:30 - 09:30',
          capacity: 60,
          enrolledCount: 50,
        },
        {
          code: 'ELE 201',
          title: 'Analog Electronic',
          creditHours: 3,
          department: 'Electronics & Hardware',
          faculty: 'School of Engineering',
          level: 'Level 2',
          semester: 'Semester 2',
          lecturerName: 'Mr. KAPNANG',
          description: 'Analog circuit theory, operational amplifiers, diodes and transistors.',
          classroom: 'BA2A',
          scheduleDays: 'Thursday',
          scheduleTime: '07:30 - 11:30',
          capacity: 60,
          enrolledCount: 48,
        },
        {
          code: 'STA 201',
          title: 'Proba & Stats',
          creditHours: 3,
          department: 'Mathematics & Statistics',
          faculty: 'School of Computing',
          level: 'Level 2',
          semester: 'Semester 2',
          lecturerName: 'Mr. EKITY',
          description: 'Probability theory, descriptive and inferential statistics, random variables.',
          classroom: 'BA2A',
          scheduleDays: 'Tuesday, Wednesday, Thursday, Friday, Saturday',
          scheduleTime: '09:30 - 11:30',
          capacity: 60,
          enrolledCount: 55,
        },
        {
          code: 'FRA 201',
          title: 'Scientific French',
          creditHours: 2,
          department: 'Languages & Humanities',
          faculty: 'School of Computing',
          level: 'Level 2',
          semester: 'Semester 2',
          lecturerName: 'Mr. BENGONO',
          description: 'Scientific and technical communication in French.',
          classroom: 'BA2A',
          scheduleDays: 'Monday, Tuesday',
          scheduleTime: '09:30 - 11:30',
          capacity: 60,
          enrolledCount: 58,
        },
        {
          code: 'WEB 202',
          title: 'PWEB2',
          creditHours: 3,
          department: 'Web Technologies',
          faculty: 'School of Computing',
          level: 'Level 2',
          semester: 'Semester 2',
          lecturerName: 'Mr. TCHOUA',
          description: 'Advanced web programming, dynamic architectures and frameworks.',
          classroom: 'BA2A',
          scheduleDays: 'Tuesday, Thursday, Friday',
          scheduleTime: '12:45 - 16:45',
          capacity: 60,
          enrolledCount: 53,
        },
      ]);
      console.log('✓ Seeded Courses');
    }

    // 6. Enrollments
    if ((await Enrollment.count()) === 0) {
      const student = await User.findOne({ where: { role: 'student' } });
      const studentId = student ? student.id : 1;
      const studentName = student ? student.name : 'Alex Johnson';

      await Enrollment.bulkCreate([
        {
          studentId,
          studentName,
          courseId: 1,
          courseCode: 'CS 201',
          courseTitle: 'Data Structures and Algorithms',
          creditHours: 3,
          semester: 'Semester 1',
          academicYear: '2024/2025',
          registrationDate: '2024-09-02',
          status: 'registered',
        },
        {
          studentId,
          studentName,
          courseId: 2,
          courseCode: 'CS 302',
          courseTitle: 'Database Management Systems',
          creditHours: 3,
          semester: 'Semester 1',
          academicYear: '2024/2025',
          registrationDate: '2024-09-02',
          status: 'registered',
        },
      ]);
      console.log('✓ Seeded Enrollments');
    }

    // 7. Timetable Slots
    if ((await TimetableSlot.count()) === 0) {
      await TimetableSlot.bulkCreate([
        // Monday
        { courseCode: 'UML 201', courseTitle: 'UML', lecturerName: 'Mrs. TCHOUTOUO', classroom: 'BA2A', day: 'Monday', startTime: '07:30', endTime: '09:30', program: 'Computer Science', semester: 'Semester 2', level: 'Level 2', className: 'BA2A', hoursProgress: '36/40 hrs', color: '#0284c7' },
        { courseCode: 'FRA 201', courseTitle: 'Scientific French', lecturerName: 'Mr. BENGONO', classroom: 'BA2A', day: 'Monday', startTime: '09:30', endTime: '11:30', program: 'Computer Science', semester: 'Semester 2', level: 'Level 2', className: 'BA2A', hoursProgress: '6/20 hrs', color: '#0284c7' },
        { courseCode: 'UML 201', courseTitle: 'UML', lecturerName: 'Mrs. TCHOUTOUO', classroom: 'BA2A', day: 'Monday', startTime: '12:45', endTime: '14:45', program: 'Computer Science', semester: 'Semester 2', level: 'Level 2', className: 'BA2A', hoursProgress: '38/40 hrs', color: '#0284c7' },
        { courseCode: 'FRA 201', courseTitle: 'Scientific French', lecturerName: 'Mr. BENGONO', classroom: 'BA2A', day: 'Monday', startTime: '14:45', endTime: '16:45', program: 'Computer Science', semester: 'Semester 2', level: 'Level 2', className: 'BA2A', hoursProgress: '8/20 hrs', color: '#0284c7' },

        // Tuesday
        { courseCode: 'MER 201', courseTitle: 'MERISE', lecturerName: 'Mrs. DZEUFACK', classroom: 'BA2A', day: 'Tuesday', startTime: '07:30', endTime: '09:30', program: 'Computer Science', semester: 'Semester 2', level: 'Level 2', className: 'BA2A', hoursProgress: '18/40 hrs', color: '#0284c7' },
        { courseCode: 'FRA 201', courseTitle: 'Scientific French', lecturerName: 'Mr. BENGONO', classroom: 'BA2A', day: 'Tuesday', startTime: '09:30', endTime: '11:30', program: 'Computer Science', semester: 'Semester 2', level: 'Level 2', className: 'BA2A', hoursProgress: '10/20 hrs', color: '#0284c7' },
        { courseCode: 'WEB 202', courseTitle: 'PWEB2', lecturerName: 'Mr. TCHOUA', classroom: 'BA2A', day: 'Tuesday', startTime: '12:45', endTime: '14:45', program: 'Computer Science', semester: 'Semester 2', level: 'Level 2', className: 'BA2A', hoursProgress: '30/30 hrs', color: '#0284c7' },
        { courseCode: 'STA 201', courseTitle: 'Proba & Stats', lecturerName: 'Mr. EKITY', classroom: 'BA2A', day: 'Tuesday', startTime: '14:45', endTime: '16:45', program: 'Computer Science', semester: 'Semester 2', level: 'Level 2', className: 'BA2A', hoursProgress: '18/30 hrs', color: '#0284c7' },

        // Wednesday
        { courseCode: 'MER 201', courseTitle: 'MERISE', lecturerName: 'Mrs. DZEUFACK', classroom: 'BA2A', day: 'Wednesday', startTime: '07:30', endTime: '09:30', program: 'Computer Science', semester: 'Semester 2', level: 'Level 2', className: 'BA2A', hoursProgress: '20/40 hrs', color: '#0284c7' },
        { courseCode: 'STA 201', courseTitle: 'Proba & Stats', lecturerName: 'Mr. EKITY', classroom: 'BA2A', day: 'Wednesday', startTime: '09:30', endTime: '11:30', program: 'Computer Science', semester: 'Semester 2', level: 'Level 2', className: 'BA2A', hoursProgress: '20/30 hrs', color: '#0284c7' },

        // Thursday
        { courseCode: 'ELE 201', courseTitle: 'Analog Electronic', lecturerName: 'Mr. KAPNANG', classroom: 'BA2A', day: 'Thursday', startTime: '07:30', endTime: '09:30', program: 'Computer Science', semester: 'Semester 2', level: 'Level 2', className: 'BA2A', hoursProgress: '28/30 hrs', color: '#0284c7' },
        { courseCode: 'ELE 201', courseTitle: 'Analog Electronic', lecturerName: 'Mr. KAPNANG', classroom: 'BA2A', day: 'Thursday', startTime: '09:30', endTime: '11:30', program: 'Computer Science', semester: 'Semester 2', level: 'Level 2', className: 'BA2A', hoursProgress: '30/30 hrs', color: '#0284c7' },
        { courseCode: 'STA 201', courseTitle: 'Proba & Stats', lecturerName: 'Mr. EKITY', classroom: 'BA2A', day: 'Thursday', startTime: '12:45', endTime: '14:45', program: 'Computer Science', semester: 'Semester 2', level: 'Level 2', className: 'BA2A', hoursProgress: '22/30 hrs', color: '#0284c7' },
        { courseCode: 'WEB 202', courseTitle: 'PWEB2', lecturerName: 'Mr. TCHOUA', classroom: 'BA2A', day: 'Thursday', startTime: '14:45', endTime: '16:45', program: 'Computer Science', semester: 'Semester 2', level: 'Level 2', className: 'BA2A', hoursProgress: '32/30 hrs', color: '#0284c7' },

        // Friday
        { courseCode: 'STA 201', courseTitle: 'Proba & Stats', lecturerName: 'Mr. EKITY', classroom: 'BA2A', day: 'Friday', startTime: '07:30', endTime: '09:30', program: 'Computer Science', semester: 'Semester 2', level: 'Level 2', className: 'BA2A', hoursProgress: '24/30 hrs', color: '#0284c7' },
        { courseCode: 'UML 201', courseTitle: 'UML', lecturerName: 'Mrs. TCHOUTOUO', classroom: 'BA2A', day: 'Friday', startTime: '09:30', endTime: '11:30', program: 'Computer Science', semester: 'Semester 2', level: 'Level 2', className: 'BA2A', hoursProgress: '40/40 hrs', color: '#0284c7' },
        { courseCode: 'UML 201', courseTitle: 'UML', lecturerName: 'Mrs. TCHOUTOUO', classroom: 'BA2A', day: 'Friday', startTime: '12:45', endTime: '14:45', program: 'Computer Science', semester: 'Semester 2', level: 'Level 2', className: 'BA2A', hoursProgress: '42/40 hrs', color: '#0284c7' },
        { courseCode: 'WEB 202', courseTitle: 'PWEB2', lecturerName: 'Mr. TCHOUA', classroom: 'BA2A', day: 'Friday', startTime: '14:45', endTime: '16:45', program: 'Computer Science', semester: 'Semester 2', level: 'Level 2', className: 'BA2A', hoursProgress: '34/30 hrs', color: '#0284c7' },

        // Saturday
        { courseCode: 'UML 201', courseTitle: 'UML', lecturerName: 'Mrs. TCHOUTOUO', classroom: 'BA2A', day: 'Saturday', startTime: '07:30', endTime: '09:30', program: 'Computer Science', semester: 'Semester 2', level: 'Level 2', className: 'BA2A', hoursProgress: '44/40 hrs', color: '#0284c7' },
        { courseCode: 'STA 201', courseTitle: 'Proba & Stats', lecturerName: 'Mr. EKITY', classroom: 'BA2A', day: 'Saturday', startTime: '09:30', endTime: '11:30', program: 'Computer Science', semester: 'Semester 2', level: 'Level 2', className: 'BA2A', hoursProgress: '26/30 hrs', color: '#0284c7' },
      ]);
      console.log('✓ Seeded TimetableSlots');
    }

    // 8. Assignments & Submissions
    if ((await Assignment.count()) === 0) {
      const assignment = await Assignment.create({
        courseId: 1,
        courseCode: 'CS 201',
        courseTitle: 'Data Structures and Algorithms',
        lecturerName: 'Dr. Sarah Williams',
        title: 'Binary Search Tree & Balancing',
        description: 'Implement a self-balancing AVL tree in C++ or Python with insert, delete, and traversal functions.',
        dueDate: '2025-10-25',
        maxScore: 100,
        totalSubmissions: 1,
        status: 'active',
      });

      const student = await User.findOne({ where: { role: 'student' } });
      const studentId = student ? student.id : 1;
      const studentName = student ? student.name : 'Alex Johnson';

      await AssignmentSubmission.create({
        assignmentId: assignment.id,
        studentId,
        studentName,
        submissionDate: '2025-10-20',
        content: 'Completed AVL tree implementation with automated test suite.',
        score: 94,
        feedback: 'Excellent implementation with clear complexity analysis.',
        status: 'graded',
      });
      console.log('✓ Seeded Assignments & Submissions');
    }

    // 9. Announcements
    if ((await Announcement.count()) === 0) {
      await Announcement.bulkCreate([
        {
          title: 'Mid-Semester Examination Schedule Published',
          description: 'The timetable for Mid-Semester examinations has been finalized and published. Please verify your course slots.',
          author: 'Central Administration',
          authorRole: 'Admin',
          date: '2025-09-15',
          targetAudience: 'All',
          priority: 'High',
          category: 'Exam',
        },
        {
          title: 'Guest Lecture on Cloud Infrastructure & DevOps',
          description: 'Join industry experts this Thursday at 2:00 PM in the Auditorium for an interactive session on scalable cloud architectures.',
          author: 'Dr. Sarah Williams',
          authorRole: 'Teacher',
          date: '2025-09-16',
          targetAudience: 'Students',
          department: 'Computer Science',
          priority: 'Normal',
          category: 'Events',
        },
      ]);
      console.log('✓ Seeded Announcements');
    }

    // 10. Notifications
    if ((await Notification.count()) === 0) {
      await Notification.bulkCreate([
        {
          title: 'Welcome to UniNexus!',
          message: 'Your academic dashboard is now live with real-time course tracking and grades.',
          targetRole: 'all',
          category: 'general',
          type: 'info',
          timestamp: new Date().toISOString(),
          isRead: false,
        },
        {
          title: 'Assignment Graded',
          message: 'Your assignment "Binary Search Tree & Balancing" has been graded. Score: 94/100.',
          targetRole: 'student',
          category: 'assignment',
          type: 'success',
          timestamp: new Date().toISOString(),
          isRead: false,
        },
      ]);
      console.log('✓ Seeded Notifications');
    }

    // 11. Early Warnings
    if ((await EarlyWarning.count()) === 0) {
      await EarlyWarning.create({
        studentId: 4,
        studentName: 'Emily Davis',
        matricNumber: 'STU-2024-002',
        program: 'B.Sc. Electrical Engineering',
        department: 'Engineering',
        level: 'Level 200',
        riskType: 'Low Attendance',
        attendanceRate: 64.5,
        averageMark: 58.0,
        coursesAtRisk: ['EE 201', 'EE 204'],
        status: 'Warning',
        interventionNotes: ['Sent attendance advisory email on 2024-09-10'],
        lastReviewDate: '2024-09-12',
      });
      console.log('✓ Seeded EarlyWarnings');
    }

    // 12. Chat Messages
    if ((await ChatMessage.count()) === 0) {
      await ChatMessage.bulkCreate([
        {
          senderId: 1,
          senderName: 'Alex Johnson',
          senderRole: 'student',
          channelId: 'general',
          content: 'Hello everyone! Welcome to the UniNexus campus hub.',
          timestamp: new Date().toISOString(),
        },
        {
          senderId: 2,
          senderName: 'Dr. Sarah Williams',
          senderRole: 'teacher',
          channelId: 'general',
          content: 'Welcome students! Office hours are posted on the course portals.',
          timestamp: new Date().toISOString(),
        },
      ]);
      console.log('✓ Seeded ChatMessages');
    }

    // 13. Attendance records
    if ((await Attendance.count()) === 0) {
      await Attendance.bulkCreate([
        {
          studentId: 1,
          studentName: 'Alex Johnson',
          matricNumber: 'STU-2024-001',
          courseId: 1,
          courseCode: 'CS 201',
          date: '2025-09-15',
          status: 'present',
          remarks: 'On time',
        },
        {
          studentId: 1,
          studentName: 'Alex Johnson',
          matricNumber: 'STU-2024-001',
          courseId: 2,
          courseCode: 'CS 302',
          date: '2025-09-16',
          status: 'present',
          remarks: 'Participated in discussion',
        },
      ]);
      console.log('✓ Seeded Attendance');
    }

    // 14. Results
    if ((await Result.count()) === 0) {
      await Result.bulkCreate([
        {
          studentId: 1,
          studentName: 'Alex Johnson',
          matricNumber: 'STU-2024-001',
          courseId: 1,
          courseCode: 'CS 201',
          courseTitle: 'Data Structures and Algorithms',
          creditHours: 3,
          semester: 'Semester 1',
          academicYear: '2024/2025',
          courseworkMark: 28,
          examMark: 62,
          totalMark: 90,
          grade: 'A+',
          gradePoint: 4.0,
          status: 'published',
        },
        {
          studentId: 1,
          studentName: 'Alex Johnson',
          matricNumber: 'STU-2024-001',
          courseId: 2,
          courseCode: 'CS 302',
          courseTitle: 'Database Management Systems',
          creditHours: 3,
          semester: 'Semester 1',
          academicYear: '2024/2025',
          courseworkMark: 26,
          examMark: 58,
          totalMark: 84,
          grade: 'A',
          gradePoint: 4.0,
          status: 'published',
        },
      ]);
      console.log('✓ Seeded Results');
    }

    // 15. Students
    if ((await Student.count()) === 0) {
      await Student.bulkCreate([
        {
          userId: 1,
          matricNumber: 'CS2025001',
          name: 'Alex Johnson',
          email: 'alex.johnson@uninexus.edu',
          phone: '+1 555-0123',
          department: 'Computer Science',
          faculty: 'School of Computing',
          program: 'B.Sc. Computer Science',
          level: 'HND 2',
          cgpa: 3.82,
          currentSemester: 'Semester 1',
          academicYear: '2024/2025',
          enrollmentDate: '2024-09-01',
          advisorName: 'Dr. Sarah Williams',
          totalCreditsEarned: 42,
          attendanceRate: 94.5,
          activeWarnings: 0,
          status: 'active',
        },
        {
          userId: 4,
          matricNumber: 'CS2025002',
          name: 'Jane Smith',
          email: 'jane.smith@uninexus.edu',
          phone: '+1 555-0124',
          department: 'Computer Science',
          faculty: 'School of Computing',
          program: 'B.Sc. Computer Science',
          level: 'HND 2',
          cgpa: 3.65,
          currentSemester: 'Semester 1',
          academicYear: '2024/2025',
          enrollmentDate: '2024-09-01',
          advisorName: 'Dr. Sarah Williams',
          totalCreditsEarned: 40,
          attendanceRate: 88.0,
          activeWarnings: 0,
          status: 'active',
        },
        {
          userId: 5,
          matricNumber: 'CS2025003',
          name: 'Michael Brown',
          email: 'michael.b@uninexus.edu',
          phone: '+1 555-0125',
          department: 'Computer Science',
          faculty: 'School of Computing',
          program: 'B.Sc. Computer Science',
          level: 'HND 2',
          cgpa: 3.45,
          currentSemester: 'Semester 1',
          academicYear: '2024/2025',
          enrollmentDate: '2024-09-01',
          advisorName: 'Dr. Sarah Williams',
          totalCreditsEarned: 38,
          attendanceRate: 91.2,
          activeWarnings: 0,
          status: 'active',
        },
        {
          userId: null,
          matricNumber: 'CS2025004',
          name: 'Emily Davis',
          email: 'emily.d@uninexus.edu',
          phone: '+1 555-0126',
          department: 'Computer Science',
          faculty: 'School of Computing',
          program: 'B.Sc. Computer Science',
          level: 'HND 2',
          cgpa: 2.75,
          currentSemester: 'Semester 1',
          academicYear: '2024/2025',
          enrollmentDate: '2024-09-01',
          advisorName: 'Dr. Sarah Williams',
          totalCreditsEarned: 32,
          attendanceRate: 64.5,
          activeWarnings: 1,
          status: 'active',
        },
      ]);
      console.log('✓ Seeded Students');
    }

    console.log('\n✅ All tables synchronized and seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
