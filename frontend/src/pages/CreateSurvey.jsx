import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Input, 
  Textarea, 
  Checkbox, 
  Button, 
  Divider, 
  Accordion, 
  AccordionItem,
  Tooltip
} from "@heroui/react";
import { useAuth } from '../contexts/AuthContext';
import SharingOptions from '../components/SharingOptions';
import SurveyActions from '../components/SurveyActions';

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

  const handleSubmit = async () => {
    if (!title) {
      setError('Please provide a title');
      return;
    }
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
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create survey');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Survey</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card isBlurred className="border-none bg-background/60 dark:bg-default-100/50 shadow-sm">
            <CardBody className="p-6 space-y-4">
              <Input
                label="Survey Title"
                placeholder="Enter a descriptive title"
                value={title}
                onValueChange={setTitle}
                isRequired
                variant="bordered"
                labelPlacement="outside"
              />
              <Textarea
                label="Description"
                placeholder="Optional: Provide more details about the survey"
                value={description}
                onValueChange={setDescription}
                variant="bordered"
                labelPlacement="outside"
              />
              <Checkbox 
                isSelected={isAnonymous} 
                onValueChange={setIsAnonymous}
                color="secondary"
              >
                Anonymous Responses
              </Checkbox>
            </CardBody>
          </Card>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Questions</h3>
              <Button 
                size="sm" 
                color="primary" 
                variant="flat" 
                onPress={addQuestion}
              >
                + Add Question
              </Button>
            </div>
            
            <Accordion variant="splitted">
              {questions.map((q, qIndex) => (
                <AccordionItem 
                  key={qIndex} 
                  aria-label={`Question ${qIndex + 1}`}
                  title={<span className="font-semibold">{q.questionText || `Untitled Question ${qIndex + 1}`}</span>}
                  subtitle={`Question ${qIndex + 1}`}
                >
                  <div className="space-y-4 p-2">
                    <div className="flex justify-between items-center gap-4">
                      <Input
                        label="Question Text"
                        value={q.questionText}
                        onValueChange={(val) => handleQuestionChange(qIndex, 'questionText', val)}
                        isRequired
                        variant="underlined"
                        className="flex-grow"
                      />
                      <Button 
                        isIconOnly 
                        color="danger" 
                        variant="light" 
                        onPress={() => removeQuestion(qIndex)}
                        disabled={questions.length === 1}
                      >
                        🗑️
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-default-500">Options</p>
                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="flex gap-2">
                          <Input
                            size="sm"
                            value={opt}
                            onValueChange={(val) => handleOptionChange(qIndex, oIndex, val)}
                            isRequired
                            placeholder={`Option ${oIndex + 1}`}
                            variant="bordered"
                          />
                          <Button 
                            isIconOnly 
                            size="sm" 
                            color="danger" 
                            variant="light" 
                            onPress={() => removeOption(qIndex, oIndex)}
                            disabled={q.options.length <= 2}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                      <Button 
                        size="sm" 
                        variant="light" 
                        color="primary"
                        onPress={() => addOption(qIndex)}
                      >
                        + Add Option
                      </Button>
                    </div>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="space-y-6">
          <Card isBlurred className="border-none bg-background/60 dark:bg-default-100/50 shadow-sm sticky top-24">
            <CardHeader>
              <h3 className="text-lg font-bold">Sharing & Publishing</h3>
            </CardHeader>
            <Divider />
            <CardBody className="space-y-6 p-6">
              <SharingOptions user={user} sharing={sharing} setSharing={setSharing} />
              
              {error && <p className="text-danger text-sm">{error}</p>}
              
              <div className="flex flex-col gap-2">
                <Button 
                  color="success" 
                  variant="shadow" 
                  onPress={handleSubmit}
                  isLoading={loading}
                  className="w-full text-white font-bold"
                >
                  Create Survey
                </Button>
                <Button 
                  variant="flat" 
                  onPress={() => navigate('/dashboard')}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
