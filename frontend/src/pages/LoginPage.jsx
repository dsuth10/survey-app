import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardBody, Input, Button, CardFooter } from "@heroui/react";

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
            <Input
              name="username"
              type="text"
              label="Username"
              placeholder="Enter your username"
              variant="bordered"
              isRequired
              labelPlacement="outside"
              className="max-w-full"
            />
            <Input
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              variant="bordered"
              isRequired
              labelPlacement="outside"
              className="max-w-full"
            />
            <Button 
              type="submit" 
              color="primary" 
              variant="shadow" 
              className="w-full h-12 text-lg font-bold"
              isLoading={loading}
            >
              Sign In
            </Button>
          </form>
        </CardBody>
        <CardFooter className="justify-center pt-8">
          <p className="text-default-400 text-sm">Educational Feedback Platform</p>
        </CardFooter>
      </Card>
    </div>
  );
}
