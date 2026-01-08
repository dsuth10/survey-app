const db = require('../db/connection');

function getSurveyResults(surveyId) {
  const survey = db.prepare('SELECT * FROM surveys WHERE id = ?').get(surveyId);
  if (!survey) return null;

  const questions = db.prepare('SELECT * FROM questions WHERE surveyId = ? ORDER BY orderIndex ASC').all(surveyId);
  const totalResponses = db.prepare('SELECT COUNT(*) as count FROM responses WHERE surveyId = ?').get(surveyId).count;

  const results = questions.map(q => {
    const options = JSON.parse(q.options);
    const answers = db.prepare(`
      SELECT selectedOption, COUNT(*) as count 
      FROM survey_answers 
      WHERE questionId = ? 
      GROUP BY selectedOption
    `).all(q.id);

    const counts = {};
    options.forEach(opt => {
      counts[opt] = 0;
    });
    answers.forEach(ans => {
      counts[ans.selectedOption] = ans.count;
    });

    return {
      questionId: q.id,
      questionText: q.questionText,
      options,
      counts
    };
  });

  // Detailed responses (respecting anonymity)
  const responses = db.prepare(`
    SELECT r.id, r.submittedAt, u.displayName, u.username
    FROM responses r
    LEFT JOIN users u ON r.userId = u.id
    WHERE r.surveyId = ?
    ORDER BY r.submittedAt DESC
  `).all(surveyId);

  const detailedResponses = responses.map(r => {
    const answers = db.prepare(`
      SELECT questionId, selectedOption 
      FROM survey_answers 
      WHERE responseId = ?
    `).all(r.id);

    return {
      id: r.id,
      submittedAt: r.submittedAt,
      // If survey is anonymous, mask the identity unless the requester is a teacher (handled in route)
      userDisplayName: survey.isAnonymous ? 'Anonymous' : (r.displayName || r.username),
      answers: answers.reduce((acc, curr) => {
        acc[curr.questionId] = curr.selectedOption;
        return acc;
      }, {})
    };
  });

  return {
    surveyTitle: survey.title,
    isAnonymous: !!survey.isAnonymous,
    totalResponses,
    results,
    detailedResponses
  };
}

module.exports = { getSurveyResults };
