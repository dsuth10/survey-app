import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import CreateSurvey from './pages/CreateSurvey';
import BrowseSurveys from './pages/BrowseSurveys';
import TakeSurvey from './pages/TakeSurvey';
import ResultsDashboard from './pages/ResultsDashboard';
import ManageClass from './pages/ManageClass';
import Dashboard from './pages/Dashboard';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-survey" 
            element={
              <ProtectedRoute>
                <CreateSurvey />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/browse" 
            element={
              <ProtectedRoute>
                <BrowseSurveys />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/take-survey/:id" 
            element={
              <ProtectedRoute>
                <TakeSurvey />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/results/:id" 
            element={
              <ProtectedRoute>
                <ResultsDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/manage-class" 
            element={
              <ProtectedRoute>
                <ManageClass />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
