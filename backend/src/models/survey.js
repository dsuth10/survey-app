const db = require('../db/connection');

const Survey = {
  create: (surveyData) => {
    const { 
      creatorId, 
      title, 
      description, 
      isAnonymous, 
      sharedWithClass, 
      sharedWithYearLevel, 
      sharedWithSchool 
    } = surveyData;

    const info = db.prepare(`
      INSERT INTO surveys (
        creatorId, title, description, isAnonymous, 
        sharedWithClass, sharedWithYearLevel, sharedWithSchool
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      creatorId, 
      title, 
      description, 
      isAnonymous ? 1 : 0, 
      sharedWithClass ? 1 : 0, 
      sharedWithYearLevel ? 1 : 0, 
      sharedWithSchool ? 1 : 0
    );

    return info.lastInsertRowid;
  },

  findById: (id) => {
    return db.prepare('SELECT * FROM surveys WHERE id = ?').get(id);
  },

  findByCreatorId: (creatorId) => {
    return db.prepare('SELECT * FROM surveys WHERE creatorId = ?').all(creatorId);
  }
};

const Question = {
  createMany: (surveyId, questions) => {
    const insert = db.prepare(`
      INSERT INTO questions (surveyId, orderIndex, questionText, type, options, isRequired)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((surveyId, questions) => {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        insert.run(
          surveyId, 
          i, 
          q.questionText, 
          q.type || 'multipleChoice', 
          JSON.stringify(q.options), 
          q.isRequired ? 1 : 0
        );
      }
    });

    insertMany(surveyId, questions);
  },

  findBySurveyId: (surveyId) => {
    const questions = db.prepare('SELECT * FROM questions WHERE surveyId = ? ORDER BY orderIndex ASC').all(surveyId);
    return questions.map(q => ({
      ...q,
      options: JSON.parse(q.options)
    }));
  }
};

module.exports = { Survey, Question };
