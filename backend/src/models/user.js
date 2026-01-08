const db = require('../db/connection');

const User = {
  findById: (id) => {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  },

  findByUsername: (username) => {
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  },

  create: (user) => {
    const { username, password, displayName, role, classId, yearLevel } = user;
    const info = db.prepare(`
      INSERT INTO users (username, password, displayName, role, classId, yearLevel)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(username, password, displayName, role, classId, yearLevel);
    return info.lastInsertRowid;
  },

  getAll: () => {
    return db.prepare('SELECT * FROM users').all();
  }
};

module.exports = User;
