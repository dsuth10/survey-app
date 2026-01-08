import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function TakeSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSurvey();
  }, [id]);

  const fetchSurvey = async () => {
    try {
      const response = await axios.get(`/api/surveys/${id}`);
      setSurvey(response.data);
    } catch (err) {
      setError('Failed to fetch survey details');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (questionId, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Check if all required questions are answered
    const unanswered = survey.questions.filter(q => q.isRequired && !answers[q.id]);
    if (unanswered.length > 0) {
      setError('Please answer all required questions');
      return;
    }

    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([qId, val]) => ({
        questionId: parseInt(qId),
        selectedOption: val
      }));

      await axios.post(`/api/surveys/${id}/responses`, { answers: formattedAnswers });
      navigate('/browse', { state: { message: 'Response submitted successfully!' } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading survey...</div>;
  if (error && !survey) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h2>Take Survey</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {survey.questions.map((q, index) => (
          <div key={q.id} style={{ marginBottom: '25px', padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>
              {index + 1}. {q.questionText} {q.isRequired && <span style={{ color: 'red' }}>*</span>}
            </p>
            <div style={{ display: 'grid', gap: '8px' }}>
              {q.options.map((opt, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => handleOptionChange(q.id, opt)}
                    required={q.isRequired}
                    style={{ marginRight: '10px' }}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}

        <div style={{ marginTop: '20px' }}>
          <button 
            type="submit" 
            disabled={submitting}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: submitting ? 'not-allowed' : 'pointer'
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Response'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/browse')}
            style={{ marginLeft: '10px', padding: '10px 20px' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
