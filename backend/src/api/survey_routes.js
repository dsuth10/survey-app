const express = require('express');
const router = express.Router();
const { createSurvey } = require('../services/survey_service');
const { getVisibleSurveys } = require('../services/visibility_service');
const { getSurveyResults } = require('../services/results_service');
const { Response, SurveyAnswer } = require('../models/response');
const { Question, Survey } = require('../models/survey');
const { isAuthenticated } = require('./auth');

router.get('/:id/results', isAuthenticated, async (req, res) => {
  try {
    const surveyId = req.params.id;
    const userId = req.session.userId;
    const userRole = req.session.role;

    const survey = Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }

    // Authorization check: only creator or teacher can see results
    if (survey.creatorId !== userId && userRole !== 'teacher') {
      return res.status(403).json({ error: 'Not authorized to view results' });
    }

    const results = getSurveyResults(surveyId);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = {
      id: req.session.userId,
      role: req.session.role,
      classId: req.session.classId,
      yearLevel: req.session.yearLevel
    };
    const surveys = getVisibleSurveys(user);
    
    // Check if user has responded to each survey
    const surveysWithStatus = surveys.map(s => ({
      ...s,
      hasResponded: Response.hasUserResponded(s.id, user.id)
    }));
    
    res.json(surveysWithStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const surveyId = req.params.id;
    const user = {
      id: req.session.userId,
      role: req.session.role,
      classId: req.session.classId,
      yearLevel: req.session.yearLevel
    };

    const survey = Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }

    // Check if user is authorized to view this survey
    const visibleSurveys = getVisibleSurveys(user);
    if (!visibleSurveys.some(s => s.id === parseInt(surveyId)) && user.role !== 'teacher') {
      return res.status(403).json({ error: 'Not authorized to view this survey' });
    }

    const questions = Question.findBySurveyId(surveyId);
    res.json({ survey, questions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/responses', isAuthenticated, async (req, res) => {
  try {
    const surveyId = req.params.id;
    const userId = req.session.userId;
    const { answers } = req.body;

    const user = {
      id: req.session.userId,
      role: req.session.role,
      classId: req.session.classId,
      yearLevel: req.session.yearLevel
    };

    const survey = Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }

    // Check if user is authorized to respond to this survey
    const visibleSurveys = getVisibleSurveys(user);
    if (!visibleSurveys.some(s => s.id === parseInt(surveyId))) {
      return res.status(403).json({ error: 'Not authorized to respond to this survey' });
    }

    if (Response.hasUserResponded(surveyId, userId)) {
      return res.status(400).json({ error: 'You have already responded to this survey' });
    }

    const responseId = Response.create(surveyId, userId);
    SurveyAnswer.createMany(responseId, answers);

    res.status(201).json({ message: 'Response submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', isAuthenticated, async (req, res) => {
  try {
    const user = {
      id: req.session.userId,
      role: req.session.role,
      classId: req.session.classId // Assuming this is set in session during login
    };

    const surveyId = await createSurvey(user, req.body);
    res.status(201).json({ id: surveyId, message: 'Survey created successfully' });
  } catch (error) {
    console.error('Survey creation error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
