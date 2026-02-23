const db = require('../db/connection');
const { Survey, Question, SurveyTarget } = require('../models/survey');
const Class = require('../models/class');
const User = require('../models/user');

const VALID_QUESTION_TYPES = ['multipleChoice', 'trueFalse', 'ranking', 'text'];

function validateQuestion(q, index) {
  const type = q.type || 'multipleChoice';
  if (!VALID_QUESTION_TYPES.includes(type)) {
    throw new Error(`Question ${index + 1}: invalid type "${type}". Use multipleChoice, trueFalse, ranking, or text.`);
  }
  if (!q.questionText || String(q.questionText).trim() === '') {
    throw new Error(`Question ${index + 1}: question text is required.`);
  }
  const options = q.options;
  if (type === 'trueFalse') {
    if (!options || !Array.isArray(options)) {
      q.options = ['True', 'False'];
    }
  } else if (type === 'ranking') {
    if (!options || !Array.isArray(options) || options.length < 2) {
      throw new Error(`Question ${index + 1}: ranking must have at least 2 options.`);
    }
    if (options.some((o) => typeof o !== 'string' || o.trim() === '')) {
      throw new Error(`Question ${index + 1}: ranking options must be non-empty strings.`);
    }
  } else if (type === 'multipleChoice') {
    if (!options || !Array.isArray(options) || options.length < 1) {
      throw new Error(`Question ${index + 1}: multiple choice must have at least one option.`);
    }
  }
  // text type: options can be null/empty
}

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

  const creatorId = user.id != null ? parseInt(user.id, 10) : NaN;
  if (Number.isNaN(creatorId) || creatorId < 1) {
    throw new Error('Invalid session; please log in again.');
  }

  const creator = User.findById(creatorId);
  if (!creator) {
    throw new Error('Your account was not found. Please log in again.');
  }

  questions.forEach((q, i) => validateQuestion(q, i));

  // Validate distribution permissions if student
  if (user.role === 'student') {
    const permissions = Class.getWithPermissions(user.classId);
    validateDistribution(user, surveyData, permissions);
  }

  const targetUserIds = Array.isArray(surveyData.targetUserIds) ? surveyData.targetUserIds.map((id) => parseInt(id, 10)).filter((n) => !Number.isNaN(n) && n >= 1) : [];
  const sharedWithIndividuals = targetUserIds.length > 0;

  if (targetUserIds.length > 0) {
    for (const uid of targetUserIds) {
      if (!User.findById(uid)) {
        throw new Error(`Cannot assign survey to invalid or deleted user (id: ${uid}). Please refresh the assignable list and try again.`);
      }
    }
  }

  const createSurveyTransaction = db.transaction((surveyPayload, questionsData, userIds) => {
    const sid = Survey.create({ ...surveyPayload, creatorId });
    Question.createMany(sid, questionsData);
    if (userIds.length > 0) {
      SurveyTarget.addMany(sid, userIds);
    }
    return sid;
  });

  const surveyId = createSurveyTransaction(
    { creatorId, ...surveyData, sharedWithIndividuals },
    questions,
    targetUserIds
  );

  return surveyId;
}

module.exports = {
  createSurvey,
  validateDistribution,
  validateQuestion,
  VALID_QUESTION_TYPES
};
