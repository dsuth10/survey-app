import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const usernameVal = formData.get('username');
    const passwordVal = formData.get('password');
    setError('');
    setLoading(true);
    try {
      await login(usernameVal, passwordVal);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
      <Card isBlurred className="max-w-md w-full border-none bg-background/60 dark:bg-default-100/50 shadow-2xl p-4">
        <CardHeader className="flex flex-col gap-1 items-center pb-8">
          <h2 className="text-3xl font-bold text-primary">Survey App</h2>
          <p className="text-default-500">Welcome back, please sign in</p>
        </CardHeader>
        <CardBody>
          {error && (
            <div className="bg-danger-50 text-danger p-3 rounded-lg text-sm mb-6 border border-danger-200">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="login-username" className="text-sm font-medium text-foreground">
                Username
              </label>
              <input
                id="login-username"
                name="username"
                type="text"
                required
                placeholder="Enter your username"
                autoComplete="username"
                className="w-full h-10 px-3 rounded-medium border border-default-200 bg-transparent text-foreground placeholder:text-foreground-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="login-password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full h-10 px-3 rounded-medium border border-default-200 bg-transparent text-foreground placeholder:text-foreground-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-lg font-bold rounded-lg bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 disabled:pointer-events-none transition-colors"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </CardBody>
        <CardFooter className="justify-center pt-8">
          <p className="text-default-400 text-sm">Educational Feedback Platform</p>
        </CardFooter>
      </Card>
    </div>
  );
}
