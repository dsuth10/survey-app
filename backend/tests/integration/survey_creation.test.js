const request = require('supertest');
const express = require('express');
const session = require('express-session');
const { Survey, Question } = require('../../src/models/survey');
const db = require('../../src/db/connection');
const initDb = require('../../src/db/init');
const surveyRoutes = require('../../src/api/survey_routes');

const app = express();
app.use(express.json());
app.use(session({
  secret: 'test',
  resave: false,
  saveUninitialized: true
}));

// Mock authentication middleware
app.use((req, res, next) => {
  req.session.userId = 1;
  req.session.role = 'teacher';
  next();
});

app.use('/api/surveys', surveyRoutes);

describe('Survey Creation Integration', () => {
  beforeAll(() => {
    initDb();
    // Ensure we have a user with id 1
    db.prepare("INSERT OR IGNORE INTO users (id, username, password, role) VALUES (1, 'testteacher', 'hash', 'teacher')").run();
  });

  test('POST /api/surveys should create a survey and questions', async () => {
    const surveyData = {
      title: 'Test Survey',
      description: 'Test Description',
      isAnonymous: false,
      sharedWithClass: true,
      questions: [
        {
          questionText: 'Q1',
          options: ['A', 'B'],
          isRequired: true
        }
      ]
    };

    const response = await request(app)
      .post('/api/surveys')
      .send(surveyData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    
    const survey = Survey.findById(response.body.id);
    expect(survey.title).toBe('Test Survey');
    expect(survey.opensAt).not.toBeNull();
    expect(survey.closesAt).not.toBeNull();
    const opensAtMs = new Date(survey.opensAt).getTime();
    const closesAtMs = new Date(survey.closesAt).getTime();
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    expect(Math.abs((closesAtMs - opensAtMs) - oneWeekMs)).toBeLessThanOrEqual(1000);

    const questions = Question.findBySurveyId(response.body.id);
    expect(questions.length).toBe(1);
    expect(questions[0].questionText).toBe('Q1');
  });

  test('POST /api/surveys should keep provided opensAt and closesAt', async () => {
    const surveyData = {
      title: 'Timed Survey',
      description: 'With explicit schedule',
      isAnonymous: false,
      sharedWithClass: true,
      opensAt: '2026-04-01T09:00',
      closesAt: '2026-04-08T09:00',
      questions: [
        {
          questionText: 'Q1',
          options: ['A', 'B'],
          isRequired: true
        }
      ]
    };

    const response = await request(app)
      .post('/api/surveys')
      .send(surveyData);

    expect(response.status).toBe(201);
    const survey = Survey.findById(response.body.id);
    expect(survey.opensAt).toBe(new Date('2026-04-01T09:00').toISOString());
    expect(survey.closesAt).toBe(new Date('2026-04-08T09:00').toISOString());
  });

  test('POST /api/surveys should return 400 if title is missing', async () => {
    const response = await request(app)
      .post('/api/surveys')
      .send({ questions: [{ questionText: 'Q1', options: ['A'] }] });

    expect(response.status).toBe(400);
  });
});
