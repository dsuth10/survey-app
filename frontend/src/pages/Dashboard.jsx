import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [mySurveys, setMySurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMySurveys();
  }, []);

  const fetchMySurveys = async () => {
    try {
      // In a real app, we'd have a specific endpoint for "my surveys"
      // or we filter the main list. For now, let's use the main list.
      const response = await axios.get('/api/surveys');
      // Filter for surveys created by me (if role is teacher or student)
      setMySurveys(response.data.filter(s => s.creatorId === user.id));
    } catch (err) {
      console.error('Failed to fetch surveys');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Welcome, {user.displayName || user.username}!</h1>
        <button onClick={logout} style={{ padding: '8px 16px' }}>Logout</button>
      </div>
      <p>Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
      
      <div style={{ margin: '30px 0', display: 'flex', gap: '15px' }}>
        <Link to="/browse" style={{ padding: '12px 24px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          Browse All Surveys
        </Link>
        <Link to="/create-survey" style={{ padding: '12px 24px', background: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          Create New Survey
        </Link>
        {user.role === 'teacher' && (
          <Link to="/manage-class" style={{ padding: '12px 24px', background: '#17a2b8', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
            Manage Class
          </Link>
        )}
      </div>

      <hr />

      <h2 style={{ marginTop: '30px' }}>Surveys Created By Me</h2>
      {loading ? (
        <p>Loading your surveys...</p>
      ) : mySurveys.length === 0 ? (
        <p>You haven't created any surveys yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
          {mySurveys.map(survey => (
            <div key={survey.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0' }}>{survey.title}</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9em' }}>
                  {survey.isAnonymous ? 'Anonymous' : 'Identified'} | {new Date(survey.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Link 
                to={`/results/${survey.id}`}
                style={{ padding: '8px 16px', border: '1px solid #007bff', color: '#007bff', textDecoration: 'none', borderRadius: '4px' }}
              >
                View Results
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
