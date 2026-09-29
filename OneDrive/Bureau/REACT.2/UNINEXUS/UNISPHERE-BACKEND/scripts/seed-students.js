import bcrypt from 'bcrypt';
import { connectDB, sequelize } from '../db.connect.js';
import { User, Student } from '../models.js';

export const ba2bStudents = [
  { name: 'ADE SIMON ANYE', surname: 'ADE', givenName: 'SIMON ANYE', matric: '24BA2B001', email: 'ade.simon@uninexus.edu', className: 'BA2B' },
  { name: 'AÏCHA MOHAMMADOU MDOMTOUNNE', surname: 'AÏCHA MOHAMMADOU', givenName: 'MDOMTOUNNE', matric: '24BA2B002', email: 'aicha.mohammadou@uninexus.edu', className: 'BA2B' },
  { name: 'AKAMBA WALVEDE DANIEL', surname: 'AKAMBA', givenName: 'WALVEDE DANIEL', matric: '24BA2B003', email: 'akamba.walvede@uninexus.edu', className: 'BA2B' },
  { name: 'AMANA AWAH EARVIN ALEXIO', surname: 'AMANA AWAH', givenName: 'EARVIN ALEXIO', matric: '24BA2B004', email: 'amana.earvin@uninexus.edu', className: 'BA2B' },
  { name: 'AMBASSA JOSEPH JUNIOR', surname: 'AMBASSA', givenName: 'JOSEPH JUNIOR', matric: '24BA2B005', email: 'ambassa.joseph@uninexus.edu', className: 'BA2B' },
  { name: 'ATANGANA ONONO JOSEPH JONAS', surname: 'ATANGANA ONONO', givenName: 'JOSEPH JONAS', matric: '24BA2B006', email: 'atangana.joseph@uninexus.edu', className: 'BA2B' },
  { name: 'ATSAPFACK KAMGA DONALD', surname: 'ATSAPFACK KAMGA', givenName: 'DONALD', matric: '24BA2B007', email: 'atsapfack.donald@uninexus.edu', className: 'BA2B' },
  { name: 'BATILANA MADJOU SHANNA ELVIRA', surname: 'BATILANA MADJOU', givenName: 'SHANNA ELVIRA', matric: '24BA2B008', email: 'batilana.shanna@uninexus.edu', className: 'BA2B' },
  { name: 'BENSE DEJOUONG MAITE ANNAELLE CORAL', surname: 'BENSE DEJOUONG', givenName: 'MAITE ANNAELLE CORAL', matric: '24BA2B009', email: 'bense.maite@uninexus.edu', className: 'BA2B' },
  { name: 'CHE AFANWI KELLY', surname: 'CHE AFANWI', givenName: 'KELLY', matric: '24BA2B010', email: 'che.kelly@uninexus.edu', className: 'BA2B' },
  { name: 'DASSI KAMGANG AUDRANY HECTOR', surname: 'DASSI KAMGANG', givenName: 'AUDRANY HECTOR', matric: '24BA2B011', email: 'dassi.audrany@uninexus.edu', className: 'BA2B' },
  { name: 'DELPHINE AWAH BIWONG', surname: 'DELPHINE AWAH', givenName: 'BIWONG', matric: '24BA2B012', email: 'delphine.biwong@uninexus.edu', className: 'BA2B' },
  { name: 'DJOKO DEMGNE MARRY JOYCE', surname: 'DJOKO DEMGNE', givenName: 'MARRY JOYCE', matric: '24BA2B013', email: 'djoko.marry@uninexus.edu', className: 'BA2B' },
  { name: 'DJONDJI NGOUNOU PRESNEL TRESOR', surname: 'DJONDJI NGOUNOU', givenName: 'PRESNEL TRESOR', matric: '24BA2B014', email: 'djondji.presnel@uninexus.edu', className: 'BA2B' },
  { name: 'DZELAMONYUY YANNICK', surname: 'DZELAMONYUY', givenName: 'YANNICK', matric: '24BA2B015', email: 'dzelamonyuy.yannick@uninexus.edu', className: 'BA2B' },
  { name: 'EMELEU DJIENGOUOE', surname: 'EMELEU', givenName: 'DJIENGOUOE', matric: '24BA2B016', email: 'emeleu.djiengouoe@uninexus.edu', className: 'BA2B' },
  { name: 'ENEGUE NKOA JACQUES BENJAMIN', surname: 'ENEGUE NKOA', givenName: 'JACQUES BENJAMIN', matric: '24BA2B017', email: 'enegue.jacques@uninexus.edu', className: 'BA2B' },
  { name: 'ESSONO EBELLA LAURENT MAEL', surname: 'ESSONO EBELLA', givenName: 'LAURENT MAEL', matric: '24BA2B018', email: 'essono.laurent@uninexus.edu', className: 'BA2B' },
  { name: 'GRIFFEN NSAGHA TANYU', surname: 'GRIFFEN NSAGHA', givenName: 'TANYU', matric: '24BA2B019', email: 'griffen.tanyu@uninexus.edu', className: 'BA2B' },
  { name: 'HAMAN TAMBJO LOAN ALDRIC KARL', surname: 'HAMAN TAMBJO', givenName: 'LOAN ALDRIC KARL', matric: '24BA2B020', email: 'haman.loan@uninexus.edu', className: 'BA2B' },
  { name: 'KAMSONG FOUEYEU JOHNSON', surname: 'KAMSONG FOUEYEU', givenName: 'JOHNSON', matric: '24BA2B021', email: 'kamsong.johnson@uninexus.edu', className: 'BA2B' },
  { name: 'KIEGOUM WOUTOU JOSETTE ARIANE', surname: 'KIEGOUM WOUTOU', givenName: 'JOSETTE ARIANE', matric: '24BA2B022', email: 'kiegoum.josette@uninexus.edu', className: 'BA2B' },
  { name: 'KEMNANG YACTAGAHAH MIGUEL', surname: 'KEMNANG YACTAGAHAH', givenName: 'MIGUEL', matric: '24BA2B023', email: 'kemnang.miguel@uninexus.edu', className: 'BA2B' },
  { name: 'KOUNDJA NELSON WILFRIED', surname: 'KOUNDJA', givenName: 'NELSON WILFRIED', matric: '24BA2B024', email: 'koundja.nelson@uninexus.edu', className: 'BA2B' },
  { name: 'KUM NGWA BRADLEY', surname: 'KUM NGWA', givenName: 'BRADLEY', matric: '24BA2B025', email: 'kum.bradley@uninexus.edu', className: 'BA2B' },
  { name: 'LAPI WOUAGOU YANN', surname: 'LAPI WOUAGOU', givenName: 'YANN', matric: '24BA2B026', email: 'lapi.yann@uninexus.edu', className: 'BA2B' },
  { name: 'MBAI MANDAK GILBERT KEVIN', surname: 'MBAI MANDAK', givenName: 'GILBERT KEVIN', matric: '24BA2B027', email: 'mbai.gilbert@uninexus.edu', className: 'BA2B' },
  { name: 'MOFFO BIKIRO JEFRED MIGUEL', surname: 'MOFFO BIKIRO', givenName: 'JEFRED MIGUEL', matric: '24BA2B028', email: 'moffo.jefred@uninexus.edu', className: 'BA2B' },
  { name: 'MOFOR RANSOME NGULE', surname: 'MOFOR', givenName: 'RANSOME NGULE', matric: '24BA2B029', email: 'mofor.ransome@uninexus.edu', className: 'BA2B' },
  { name: 'MOHAMMED OUSMANOU ALHADJI', surname: 'MOHAMMED OUSMANOU', givenName: 'ALHADJI', matric: '24BA2B030', email: 'mohammed.alhadji@uninexus.edu', className: 'BA2B' },
  { name: 'MOUAFFO TOUKAM BRAYAN JUNIOR', surname: 'MOUAFFO TOUKAM', givenName: 'BRAYAN JUNIOR', matric: '24BA2B031', email: 'mouaffo.brayan@uninexus.edu', className: 'BA2B' },
  { name: 'MULLAH DOBGANGHA TONY', surname: 'MULLAH DOBGANGHA', givenName: 'TONY', matric: '24BA2B032', email: 'mullah.tony@uninexus.edu', className: 'BA2B' },
  { name: 'MVOTOUNG SANANG STEVE ARNAULD', surname: 'MVOTOUNG SANANG', givenName: 'STEVE ARNAULD', matric: '24BA2B033', email: 'mvotoung.steve@uninexus.edu', className: 'BA2B' },
];

export const ba2aStudents = [
  { name: 'NANA KAMDOUM RAOUL RUSSEL ALVARES', surname: 'NANA KAMDOUM', givenName: 'RAOUL RUSSEL ALVARES', matric: '24BA2A001', email: 'nana.raoul@uninexus.edu', className: 'BA2A' },
  { name: 'NDI MAGUIP BRELLA MANUELLA', surname: 'NDI MAGUIP', givenName: 'BRELLA MANUELLA', matric: '24BA2A002', email: 'ndi.brella@uninexus.edu', className: 'BA2A' },
  { name: 'NGANSO NDOSSEU EZEVY FERNANCE', surname: 'NGANSO NDOSSEU', givenName: 'EZEVY FERNANCE', matric: '24BA2A003', email: 'nganso.ezevy@uninexus.edu', className: 'BA2A' },
  { name: 'NGONO BELINGA CLAUDE-FARELLE NAOMIE', surname: 'NGONO BELINGA', givenName: 'CLAUDE-FARELLE NAOMIE', matric: '24BA2A004', email: 'ngono.claude@uninexus.edu', className: 'BA2A' },
  { name: 'NGEUM MBEN ANTOINE DE PADOUE', surname: 'NGEUM MBEN', givenName: 'ANTOINE DE PADOUE', matric: '24BA2A005', email: 'ngeum.antoine@uninexus.edu', className: 'BA2A' },
  { name: 'NJEUMI KELLY ROY AYAFOR', surname: 'NJEUMI', givenName: 'KELLY ROY AYAFOR', matric: '24BA2A006', email: 'njeumi.kelly@uninexus.edu', className: 'BA2A' },
  { name: 'NJI NDAM MFONPAYA ABDOULAHI', surname: 'NJI NDAM MFONPAYA', givenName: 'ABDOULAHI', matric: '24BA2A007', email: 'nji.abdoulahi@uninexus.edu', className: 'BA2A' },
  { name: 'NJIEKOU MBIAKOP ZIDANE CHRISTIAN', surname: 'NJIEKOU MBIAKOP', givenName: 'ZIDANE CHRISTIAN', matric: '24BA2A008', email: 'njiekou.zidane@uninexus.edu', className: 'BA2A' },
  { name: 'NKEM NZIE KELLY', surname: 'NKEM NZIE', givenName: 'KELLY', matric: '24BA2A009', email: 'nkem.kelly@uninexus.edu', className: 'BA2A' },
  { name: 'NKEMOUO MBOUKEU LUCIEN', surname: 'NKEMOUO MBOUKEU', givenName: 'LUCIEN', matric: '24BA2A010', email: 'nkemouo.lucien@uninexus.edu', className: 'BA2A' },
  { name: 'NTSAMA MANGA LUC STEPHANE', surname: 'NTSAMA MANGA', givenName: 'LUC STEPHANE', matric: '24BA2A011', email: 'ntsama.luc@uninexus.edu', className: 'BA2A' },
  { name: 'NYAT MPASSISSA DAVID', surname: 'NYAT MPASSISSA', givenName: 'DAVID', matric: '24BA2A012', email: 'nyat.david@uninexus.edu', className: 'BA2A' },
  { name: 'PAHO JOSIAS NEHEMIE', surname: 'PAHO', givenName: 'JOSIAS NEHEMIE', matric: '24BA2A013', email: 'paho.josias@uninexus.edu', className: 'BA2A' },
  { name: 'PEMBATOUA LOUIH HOUSSEIN', surname: 'PEMBATOUA LOUIH', givenName: 'HOUSSEIN', matric: '24BA2A014', email: 'pembatoua.houssein@uninexus.edu', className: 'BA2A' },
  { name: 'PIIM DE HIOL FIDELE EXAUCEE', surname: 'PIIM DE HIOL', givenName: 'FIDELE EXAUCEE', matric: '24BA2A015', email: 'piim.fidele@uninexus.edu', className: 'BA2A' },
  { name: 'TAKANG BENJAMIN KWATCHOU', surname: 'TAKANG', givenName: 'BENJAMIN KWATCHOU', matric: '24BA2A016', email: 'takang.benjamin@uninexus.edu', className: 'BA2A' },
  { name: 'TAKU TABESSEM STEFF', surname: 'TAKU TABESSEM', givenName: 'STEFF', matric: '24BA2A017', email: 'taku.steff@uninexus.edu', className: 'BA2A' },
  { name: 'TATA NYUYKILIM DILAND', surname: 'TATA NYUYKILIM', givenName: 'DILAND', matric: '24BA2A018', email: 'tatadiland4@gmail.com', className: 'BA2A' },
  { name: 'TCHOUANTE KAHE BRYAN DIEUBENIT', surname: 'TCHOUANTE KAHE', givenName: 'BRYAN DIEUBENIT', matric: '24BA2A019', email: 'tchouantebrayan6@gmail.com', className: 'BA2A' },
  { name: 'TCHOUTAN NGANGOUA CERENA DALIA', surname: 'TCHOUTAN NGANGOUA', givenName: 'CERENA DALIA', matric: '24BA2A020', email: 'tchoutan.cerena@uninexus.edu', className: 'BA2A' },
  { name: 'TEMOLONG LANDRY', surname: 'TEMOLONG', givenName: 'LANDRY', matric: '24BA2A021', email: 'temolong.landry@uninexus.edu', className: 'BA2A' },
  { name: 'TIOKOU NJOMOU YAKIN LARSON', surname: 'TIOKOU NJOMOU', givenName: 'YAKIN LARSON', matric: '24BA2A022', email: 'tiokou.yakin@uninexus.edu', className: 'BA2A' },
  { name: 'TONO SHERILANE MATTE MEBU', surname: 'TONO', givenName: 'SHERILANE MATTE MEBU', matric: '24BA2A023', email: 'tono.sherilane@uninexus.edu', className: 'BA2A' },
  { name: 'TOUOYEM DOFOR TESITA', surname: 'TOUOYEM DOFOR', givenName: 'TESITA', matric: '24BA2A024', email: 'touoyem.tesita@uninexus.edu', className: 'BA2A' },
  { name: 'WAMBA KAMOLACK EDDY JEFFERSON', surname: 'WAMBA KAMOLACK', givenName: 'EDDY JEFFERSON', matric: '24BA2A025', email: 'wamba.eddy@uninexus.edu', className: 'BA2A' },
  { name: 'YANG IV LUCRECE FRANCESCA', surname: 'YANG IV', givenName: 'LUCRECE FRANCESCA', matric: '24BA2A026', email: 'yang.lucrece@uninexus.edu', className: 'BA2A' },
  { name: 'YANNIS TSABIKA MAVROMMATIS EVINA', surname: 'YANNIS TSABIKA', givenName: 'MAVROMMATIS EVINA', matric: '24BA2A027', email: 'yannis.mavrommatis@uninexus.edu', className: 'BA2A' },
  { name: 'YOGO JEAN ARIEL LEPRECIEUX', surname: 'YOGO', givenName: 'JEAN ARIEL LEPRECIEUX', matric: '24BA2A028', email: 'yogo.jean@uninexus.edu', className: 'BA2A' },
  { name: 'ZEUMO YEMELE BRANDON CYRIAN', surname: 'ZEUMO YEMELE', givenName: 'BRANDON CYRIAN', matric: '24BA2A029', email: 'zeumo.brandon@uninexus.edu', className: 'BA2A' },
];

const facultyTeachers = [
  { name: 'System Administrator', email: 'admin@uninexus.edu', role: 'admin', identifier: 'ADM001', department: 'Administration', faculty: 'School of Computing' },
  { name: 'Mrs. TCHOUTOUO', email: 'tchoutouo@uninexus.edu', role: 'teacher', identifier: 'TCH201', department: 'Computer Science', faculty: 'School of Computing' },
  { name: 'Mrs. DZEUFACK', email: 'dzeufack@uninexus.edu', role: 'teacher', identifier: 'TCH202', department: 'Information Systems', faculty: 'School of Computing' },
  { name: 'Mr. KAPNANG', email: 'kapnang@uninexus.edu', role: 'teacher', identifier: 'TCH203', department: 'Electronics & Hardware', faculty: 'School of Engineering' },
  { name: 'Mr. EKITY', email: 'ekity@uninexus.edu', role: 'teacher', identifier: 'TCH204', department: 'Mathematics & Statistics', faculty: 'School of Computing' },
  { name: 'Mr. BENGONO', email: 'bengono@uninexus.edu', role: 'teacher', identifier: 'TCH205', department: 'Languages & Humanities', faculty: 'Faculty of Letters' },
  { name: 'Mr. TCHOUA', email: 'tchoua@uninexus.edu', role: 'teacher', identifier: 'TCH206', department: 'Web Technologies', faculty: 'School of Computing' },
];

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MySQL. Clearing student and mock user tables...');

    // 1. Delete everything found in students table
    await sequelize.query('DELETE FROM students');
    console.log('✓ Cleared all records from table "students"');

    // 2. Clear old mock / test users
    await sequelize.query('DELETE FROM users');
    console.log('✓ Cleared old mock users from table "users"');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 3. Re-create Admin and Teachers in users table
    for (const t of facultyTeachers) {
      await User.create({
        name: t.name,
        email: t.email,
        password: hashedPassword,
        role: t.role,
        identifier: t.identifier,
        department: t.department,
        faculty: t.faculty,
        level: t.role === 'admin' ? 'Director' : 'Lecturer',
        className: 'BA2A',
        status: 'active',
      });
    }
    console.log(`✓ Seeded ${facultyTeachers.length} staff users (Admin + Lecturers)`);

    // 4. Combine BA2B and BA2A students
    const allStudents = [...ba2bStudents, ...ba2aStudents];

    let insertedCount = 0;
    for (const s of allStudents) {
      // Create user record
      const user = await User.create({
        name: s.name,
        email: s.email,
        password: hashedPassword,
        role: 'student',
        identifier: s.matric,
        className: s.className,
        level: 'Level 2',
        department: 'Computer Science',
        faculty: 'School of Computing',
        program: 'B.Sc. Computer Science',
        status: 'active',
      });

      // Create student record
      await Student.create({
        userId: user.id,
        matricNumber: s.matric,
        name: s.name,
        email: s.email,
        className: s.className,
        level: 'Level 2',
        department: 'Computer Science',
        faculty: 'School of Computing',
        program: 'B.Sc. Computer Science',
        academicYear: '2024/2025',
        currentSemester: 'Semester 1',
        cgpa: 3.50,
        attendanceRate: 95.0,
        status: 'active',
      });

      insertedCount++;
    }

    console.log(`✓ Successfully created ${insertedCount} students in both "users" and "students" tables!`);
    console.log(`  - ${ba2bStudents.length} students assigned to Class BA2B`);
    console.log(`  - ${ba2aStudents.length} students assigned to Class BA2A`);

    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
}

seed();
