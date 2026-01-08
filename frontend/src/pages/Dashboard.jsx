import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardHeader, CardBody, Button, Skeleton, Chip, Divider, User } from "@heroui/react";
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [mySurveys, setMySurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMySurveys();
  }, []);

  const fetchMySurveys = async () => {
    try {
      const response = await axios.get('/api/surveys');
      setMySurveys(response.data.filter(s => s.creatorId === user.id));
    } catch (err) {
      console.error('Failed to fetch surveys');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome back!</h1>
          <User
            name={user.displayName || user.username}
            description={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            avatarProps={{
              src: "https://i.pravatar.cc/150?u=" + user.id,
              size: "lg",
              isBordered: true,
              color: "primary"
            }}
          />
        </div>
        <div className="flex gap-4">
          <Button 
            color="primary" 
            variant="shadow" 
            onPress={() => navigate("/browse")}
          >
            Browse All Surveys
          </Button>
          <Button 
            color="success" 
            variant="flat" 
            onPress={() => navigate("/create")}
          >
            Create New Survey
          </Button>
          {user.role === 'teacher' && (
            <Button 
              color="secondary" 
              variant="flat" 
              onPress={() => navigate("/manage-class")}
            >
              Manage Class
            </Button>
          )}
        </div>
      </div>

      <Divider className="my-8" />

      <h2 className="text-2xl font-bold mb-6">Surveys Created By Me</h2>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-4 h-[120px]">
              <Skeleton className="rounded-lg">
                <div className="h-full bg-default-300"></div>
              </Skeleton>
            </Card>
          ))}
        </div>
      ) : mySurveys.length === 0 ? (
        <Card isBlurred className="p-12 text-center border-none bg-background/60 dark:bg-default-100/50">
          <p className="text-default-500 mb-4">You haven't created any surveys yet.</p>
          <Button color="primary" variant="flat" onPress={() => navigate("/create")}>
            Get Started
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mySurveys.map(survey => (
            <Card 
              key={survey.id} 
              isPressable
              isBlurred
              className="border-none bg-background/60 dark:bg-default-100/50 shadow-sm hover:shadow-md"
              onPress={() => navigate(`/results/${survey.id}`)}
            >
              <CardHeader className="flex gap-3 px-4 pt-4">
                <div className="flex flex-col">
                  <p className="text-md font-bold line-clamp-1">{survey.title}</p>
                  <p className="text-small text-default-500">{new Date(survey.createdAt).toLocaleDateString()}</p>
                </div>
              </CardHeader>
              <CardBody className="px-4 pb-4 pt-2">
                <div className="flex gap-2">
                  <Chip size="sm" variant="flat" color={survey.isAnonymous ? "warning" : "default"}>
                    {survey.isAnonymous ? 'Anonymous' : 'Identified'}
                  </Chip>
                  <Chip size="sm" variant="flat" color="primary">
                    {survey.questionCount || 0} Questions
                  </Chip>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
