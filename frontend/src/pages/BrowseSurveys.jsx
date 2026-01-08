import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function BrowseSurveys() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await axios.get('/api/surveys');
      setSurveys(response.data);
    } catch (err) {
      setError('Failed to fetch surveys');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading surveys...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Available Surveys</h2>
        <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>Back to Dashboard</Link>
      </div>

      {surveys.length === 0 ? (
        <p>No surveys available at this time.</p>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {surveys.map(survey => (
            <div 
              key={survey.id} 
              style={{ 
                border: '1px solid #ddd', 
                padding: '15px', 
                borderRadius: '8px',
                backgroundColor: survey.hasResponded ? '#f9f9f9' : 'white',
                opacity: survey.hasResponded ? 0.8 : 1
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0' }}>{survey.title}</h3>
                  <p style={{ margin: '0', color: '#666', fontSize: '0.9em' }}>
                    Created by: {survey.creatorName} | {new Date(survey.createdAt).toLocaleDateString()}
                  </p>
                  {survey.description && (
                    <p style={{ marginTop: '10px', color: '#333' }}>{survey.description}</p>
                  )}
                </div>
                <div>
                  {survey.hasResponded ? (
                    <span style={{ color: '#28a745', fontWeight: 'bold' }}>✓ Responded</span>
                  ) : (
                    <Link 
                      to={`/take-survey/${survey.id}`}
                      style={{ 
                        display: 'inline-block',
                        padding: '8px 16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px'
                      }}
                    >
                      Take Survey
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
