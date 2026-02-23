const bcrypt = require('bcryptjs');
const db = require('./connection');
const initDb = require('./init');

async function seed() {
  initDb();
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Clear and reset schema (drops tables so we get current schema including role CHECK)
  db.prepare('PRAGMA foreign_keys = OFF').run();
  db.exec('DROP TABLE IF EXISTS survey_answers');
  db.exec('DROP TABLE IF EXISTS responses');
  db.exec('DROP TABLE IF EXISTS survey_targets');
  db.exec('DROP TABLE IF EXISTS questions');
  db.exec('DROP TABLE IF EXISTS surveys');
  db.exec('DROP TABLE IF EXISTS distribution_permissions');
  db.exec('DROP TABLE IF EXISTS users');
  db.exec('DROP TABLE IF EXISTS classes');
  db.prepare('PRAGMA foreign_keys = ON').run();
  initDb(); // recreate tables with current schema

  const insertUser = db.prepare(`
    INSERT INTO users (username, password, displayName, role, classId, yearLevel)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // Admin (no class)
  insertUser.run('admin', hashedPassword, 'Administrator', 'admin', null, null);

  // Two teachers (no class; they own classes via classes.teacherId)
  const teacher1Id = insertUser.run('teacher1', hashedPassword, 'Mr. Smith', 'teacher', null, null).lastInsertRowid;
  const teacher2Id = insertUser.run('teacher2', hashedPassword, 'Ms. Jones', 'teacher', null, null).lastInsertRowid;

  // Two classes, one per teacher (each teacher sees only their own class)
  const insertClass = db.prepare('INSERT INTO classes (name, teacherId) VALUES (?, ?)');
  const class1Id = insertClass.run('7A', teacher1Id).lastInsertRowid;
  const class2Id = insertClass.run('8B', teacher2Id).lastInsertRowid;

  // Student in class 7A (so teacher1 sees them)
  insertUser.run('student1', hashedPassword, 'John Doe', 'student', class1Id, '7');

  // Distribution permissions for each class (teachers can share with class/year/school as needed)
  const permStmt = db.prepare(`
    INSERT INTO distribution_permissions (classId, canShareWithClass, canShareWithYearLevel, canShareWithSchool)
    VALUES (?, ?, ?, ?)
  `);
  permStmt.run(class1Id, 1, 1, 0);
  permStmt.run(class2Id, 1, 1, 0);

  console.log('Database seeded with (password for all: password123):');
  console.log('- Admin: admin');
  console.log('- Teacher 1: teacher1 (Class 7A)');
  console.log('- Teacher 2: teacher2 (Class 8B)');
  console.log('- Student: student1 (Class 7A)');
}

if (require.main === module) {
  seed().catch(console.error);
}

module.exports = seed;
