const db = require('../db/connection');

const Class = {
  findById: (id) => {
    return db.prepare('SELECT * FROM classes WHERE id = ?').get(id);
  },

  findAll: () => {
    return db.prepare('SELECT * FROM classes').all();
  },

  findByTeacherId: (teacherId) => {
    return db.prepare('SELECT * FROM classes WHERE teacherId = ?').all(teacherId);
  },

  create: (name, teacherId) => {
    const info = db.prepare(`
      INSERT INTO classes (name, teacherId)
      VALUES (?, ?)
    `).run(name, teacherId);
    return info.lastInsertRowid;
  },

  getWithPermissions: (id) => {
    return db.prepare(`
      SELECT c.*, dp.canShareWithClass, dp.canShareWithYearLevel, dp.canShareWithSchool
      FROM classes c
      LEFT JOIN distribution_permissions dp ON c.id = dp.classId
      WHERE c.id = ?
    `).get(id);
  }
};

module.exports = Class;
