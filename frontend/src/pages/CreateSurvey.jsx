import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import SharingOptions from '../components/SharingOptions';

export default function CreateSurvey() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', ''], isRequired: true }
  ]);
  const [sharing, setSharing] = useState({
    sharedWithClass: true,
    sharedWithYearLevel: false,
    sharedWithSchool: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', ''], isRequired: true }]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push('');
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, i) => i !== oIndex);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const surveyData = {
        title,
        description,
        isAnonymous,
        questions,
        ...sharing
      };

      await axios.post('/api/surveys', surveyData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create survey');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Create New Survey</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Survey Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '8px', height: '80px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            Anonymous Responses
          </label>
        </div>

        <SharingOptions user={user} sharing={sharing} setSharing={setSharing} />

        <h3 style={{ marginTop: '30px' }}>Questions</h3>
        {questions.map((q, qIndex) => (
          <div key={qIndex} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label>Question {qIndex + 1}:</label>
              <button type="button" onClick={() => removeQuestion(qIndex)} style={{ color: 'red' }}>Remove</button>
            </div>
            <input
              type="text"
              value={q.questionText}
              onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
              required
              placeholder="Enter question text"
              style={{ width: '100%', padding: '8px', margin: '10px 0' }}
            />
            
            <div>
              <label>Options:</label>
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} style={{ display: 'flex', marginBottom: '5px' }}>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    required
                    placeholder={`Option ${oIndex + 1}`}
                    style={{ flexGrow: 1, padding: '5px' }}
                  />
                  <button type="button" onClick={() => removeOption(qIndex, oIndex)} style={{ marginLeft: '5px' }}>X</button>
                </div>
              ))}
              <button type="button" onClick={() => addOption(qIndex)}>Add Option</button>
            </div>
          </div>
        ))}
        
        <button type="button" onClick={addQuestion} style={{ display: 'block', margin: '20px 0' }}>
          Add Another Question
        </button>

        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          {loading ? 'Creating...' : 'Create Survey'}
        </button>
        <button type="button" onClick={() => navigate('/')} style={{ marginLeft: '10px' }}>Cancel</button>
      </form>
    </div>
  );
}
