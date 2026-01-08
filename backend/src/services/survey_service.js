const { Survey, Question } = require('../models/survey');
const Class = require('../models/class');

function validateDistribution(user, surveyData, permissions) {
  if (user.role === 'teacher') return;

  if (surveyData.sharedWithYearLevel && (!permissions || !permissions.canShareWithYearLevel)) {
    throw new Error('Not permitted to share with year level');
  }

  if (surveyData.sharedWithSchool && (!permissions || !permissions.canShareWithSchool)) {
    throw new Error('Not permitted to share with school');
  }

  // sharedWithClass is generally allowed for students if they are in a class, 
  // but we can check it too if we want to be strict.
  if (surveyData.sharedWithClass && (!permissions || !permissions.canShareWithClass)) {
    throw new Error('Not permitted to share with class');
  }
}

async function createSurvey(user, surveyData) {
  const { title, questions } = surveyData;

  if (!title || !questions || questions.length === 0) {
    throw new Error('Survey must have a title and at least one question');
  }

  // Validate distribution permissions if student
  if (user.role === 'student') {
    const permissions = Class.getWithPermissions(user.classId);
    validateDistribution(user, surveyData, permissions);
  }

  const surveyId = Survey.create({
    creatorId: user.id,
    ...surveyData
  });

  Question.createMany(surveyId, questions);

  return surveyId;
}

module.exports = {
  createSurvey,
  validateDistribution
};
