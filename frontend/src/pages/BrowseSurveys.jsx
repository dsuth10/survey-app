import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardBody, Button, Skeleton, Chip, Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { useAuth } from '../contexts/AuthContext';

export default function BrowseSurveys() {
  const { user } = useAuth();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingSurveyId, setDeletingSurveyId] = useState(null);
  const [myResponse, setMyResponse] = useState(null);
  const [myResponseSurveyTitle, setMyResponseSurveyTitle] = useState('');
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

  const canDeleteSurvey = (survey) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.role === 'teacher') return survey.creatorRole === 'student';
    if (user.role === 'student') return survey.creatorId === user.id;
    return false;
  };

  const handleDeleteSurvey = async (survey) => {
    try {
      setDeletingSurveyId(survey.id);
      await axios.delete(`/api/surveys/${survey.id}`);
      setSurveys((prev) => prev.filter((s) => s.id !== survey.id));
      setMessage({ type: 'success', text: `Deleted survey: ${survey.title}` });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to delete survey' });
    } finally {
      setDeletingSurveyId(null);
      setConfirmDeleteId(null);
    }
  };

  const openMyResponse = async (survey) => {
    try {
      const res = await axios.get(`/api/surveys/${survey.id}/my-response`);
      setMyResponse(res.data);
      setMyResponseSurveyTitle(survey.title);
    } catch (_) {
      setMyResponse(null);
    }
  };

  if (error) return <div className="p-8 text-danger">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Available Surveys</h2>
      </div>
      {message.text && (
        <div className={`mb-6 rounded-lg border px-4 py-3 text-sm ${message.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((_, i) => (
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
                      <>
                        <Button
                          color="default"
                          variant="flat"
                          size="sm"
                          onPress={() => openMyResponse(survey)}
                        >
                          View my response
                        </Button>
                        <Button
                          color="default"
                          variant="flat"
                          size="sm"
                          onPress={() => navigate(`/results/${survey.id}`)}
                        >
                          View Results
                        </Button>
                      </>
                    )}
                    {canDeleteSurvey(survey) && (
                      confirmDeleteId === survey.id ? (
                        <div className="flex flex-col gap-2">
                          <Button
                            color="danger"
                            size="sm"
                            isDisabled={deletingSurveyId === survey.id}
                            onPress={() => handleDeleteSurvey(survey)}
                          >
                            {deletingSurveyId === survey.id ? 'Deleting...' : 'Confirm Delete'}
                          </Button>
                          <Button
                            color="default"
                            variant="flat"
                            size="sm"
                            isDisabled={deletingSurveyId === survey.id}
                            onPress={() => setConfirmDeleteId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          color="danger"
                          variant="flat"
                          size="sm"
                          isDisabled={deletingSurveyId != null}
                          onPress={() => setConfirmDeleteId(survey.id)}
                        >
                          Delete Survey
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={!!myResponse} onOpenChange={(open) => !open && setMyResponse(null)}>
        <ModalContent>
          <ModalHeader>My response: {myResponseSurveyTitle}</ModalHeader>
          <ModalBody>
            {myResponse && (
              <div className="space-y-3">
                <p className="text-sm text-default-500">Submitted: {new Date(myResponse.submittedAt).toLocaleString()}</p>
                {myResponse.answers.map((a) => (
                  <div key={a.questionId} className="p-2 rounded bg-default-100">
                    <p className="font-medium text-sm">{a.questionText}</p>
                    <p className="text-default-600">
                      {(() => {
                        try {
                          if (typeof a.selectedOption === 'string' && a.selectedOption.startsWith('[')) {
                            return JSON.parse(a.selectedOption).join(' → ');
                          }
                        } catch (_) { /* ignore parse error */ }
                        return a.selectedOption;
                      })()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
