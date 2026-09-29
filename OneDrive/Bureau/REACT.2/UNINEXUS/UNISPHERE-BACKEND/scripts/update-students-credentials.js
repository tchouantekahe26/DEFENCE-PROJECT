import bcrypt from 'bcrypt';
import { connectDB, sequelize } from '../db.connect.js';
import { User, Student } from '../models.js';

const blackAvatars = [
  "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
];

// Helper to extract first 2 words from full name and sanitize for email
export function getStudentEmail(fullName) {
  // Normalize accents (e.g. AÏCHA -> AICHA)
  const normalized = fullName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z\s]/g, " ");

  const parts = normalized.trim().split(/\s+/).filter(Boolean);
  const first2 = (parts.slice(0, 2).join("")).toLowerCase();
  return `${first2}0@gmail.com`;
}

export function getStudentEmailNo0(fullName) {
  const normalized = fullName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z\s]/g, " ");

  const parts = normalized.trim().split(/\s+/).filter(Boolean);
  const first2 = (parts.slice(0, 2).join("")).toLowerCase();
  return `${first2}@gmail.com`;
}

async function updateCredentials() {
  try {
    await connectDB();
    console.log('Connected to MySQL. Updating credentials, emails and avatars for all students...');

    const hashedPassword = await bcrypt.hash('password', 10);

    // Fetch all students
    const students = await Student.findAll();
    console.log(`Found ${students.length} students to update.`);

    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const email = getStudentEmail(student.name);
      const avatar = blackAvatars[i % blackAvatars.length];

      // Update student table
      await student.update({
        email,
        avatar,
      });

      // Update corresponding user in Users table
      if (student.userId) {
        await User.update(
          {
            email,
            password: hashedPassword,
            avatar,
          },
          { where: { id: student.userId } }
        );
      } else {
        // Find user by matric or previous email
        await User.update(
          {
            email,
            password: hashedPassword,
            avatar,
          },
          {
            where: {
              [sequelize.Sequelize.Op.or]: [
                { identifier: student.matricNumber },
                { name: student.name },
              ],
            },
          }
        );
      }

      console.log(`[${i + 1}/${students.length}] ${student.matricNumber} - ${student.name} -> Email: ${email} | Password: password`);
    }

    // Update teachers with verified Black portraits (Mrs. TCHOUTOUO female)
    await User.update(
      { avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80" },
      { where: { [sequelize.Sequelize.Op.or]: [{ email: "tchoutouo@uninexus.edu" }, { identifier: "TCH201" }, { name: { [sequelize.Sequelize.Op.like]: "%TCHOUTOUO%" } }] } }
    );
    await User.update(
      { avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80" },
      { where: { [sequelize.Sequelize.Op.or]: [{ email: "dzeufack@uninexus.edu" }, { identifier: "TCH202" }, { name: { [sequelize.Sequelize.Op.like]: "%DZEUFACK%" } }] } }
    );
    await User.update(
      { avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=200&auto=format&fit=crop&q=80" },
      { where: { [sequelize.Sequelize.Op.or]: [{ email: "kapnang@uninexus.edu" }, { identifier: "TCH203" }, { name: { [sequelize.Sequelize.Op.like]: "%KAPNANG%" } }] } }
    );
    await User.update(
      { avatar: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=200&auto=format&fit=crop&q=80" },
      { where: { [sequelize.Sequelize.Op.or]: [{ email: "ekity@uninexus.edu" }, { identifier: "TCH204" }, { name: { [sequelize.Sequelize.Op.like]: "%EKITY%" } }] } }
    );
    await User.update(
      { avatar: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=200&auto=format&fit=crop&q=80" },
      { where: { [sequelize.Sequelize.Op.or]: [{ email: "bengono@uninexus.edu" }, { identifier: "TCH205" }, { name: { [sequelize.Sequelize.Op.like]: "%BENGONO%" } }] } }
    );
    await User.update(
      { avatar: "https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=200&auto=format&fit=crop&q=80" },
      { where: { [sequelize.Sequelize.Op.or]: [{ email: "tchoua@uninexus.edu" }, { identifier: "TCH206" }, { name: { [sequelize.Sequelize.Op.like]: "%TCHOUA%" } }] } }
    );

    console.log('✓ Successfully updated all students and teachers with authentic Black portraits (Mrs. TCHOUTOUO female)!');
    process.exit(0);
  } catch (err) {
    console.error('Error updating credentials:', err);
    process.exit(1);
  }
}

updateCredentials();
