import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardHeader, CardBody, Button, Skeleton, Chip, Divider } from "@heroui/react";

export default function BrowseSurveys() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  if (error) return <div className="p-8 text-danger">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Available Surveys</h2>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="w-full h-[150px] p-4">
              <Skeleton className="rounded-lg">
                <div className="h-24 rounded-lg bg-default-300"></div>
              </Skeleton>
            </Card>
          ))}
        </div>
      ) : surveys.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-default-500">No surveys available at this time.</p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {surveys.map(survey => (
            <Card 
              key={survey.id} 
              isBlurred
              className={`border-none bg-background/60 dark:bg-default-100/50 shadow-sm hover:shadow-md transition-shadow ${survey.hasResponded ? 'opacity-70' : ''}`}
            >
              <CardBody className="p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{survey.title}</h3>
                      {survey.hasResponded && (
                        <Chip color="success" variant="flat" size="sm">✓ Responded</Chip>
                      )}
                    </div>
                    <p className="text-default-500 text-sm mb-4">
                      Created by: {survey.creatorName} • {new Date(survey.createdAt).toLocaleDateString()}
                    </p>
                    {survey.description && (
                      <p className="text-default-700 line-clamp-2">{survey.description}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {!survey.hasResponded ? (
                      <Button 
                        color="primary"
                        variant="shadow"
                        onPress={() => navigate(`/take-survey/${survey.id}`)}
                      >
                        Take Survey
                      </Button>
                    ) : (
                      <Button 
                        color="default"
                        variant="flat"
                        onPress={() => navigate(`/results/${survey.id}`)}
                      >
                        View Results
                      </Button>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
