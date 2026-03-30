import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardHeader, CardBody, Divider, Button, Chip } from "@heroui/react";
import { isSurveyOpen } from '../utils/surveyUtils';
import RadioQuestion from '../components/questions/RadioQuestion';
import TrueFalseQuestion from '../components/questions/TrueFalseQuestion';
import RankingQuestion from '../components/questions/RankingQuestion';
import TextQuestion from '../components/questions/TextQuestion';
import SurveyActions from '../components/SurveyActions';

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

  const handleSubmit = async () => {
    setError('');

    // Check if all required questions are answered
    const surveyQuestions = Array.isArray(survey?.questions) ? survey.questions : [];
    const unanswered = surveyQuestions.filter(q => q.isRequired && !answers[q.id]);
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

  if (loading) return <div className="p-8 text-center text-slate-500">Loading survey...</div>;
  if (error && !survey) return <div className="p-8 text-danger text-center bg-red-50 rounded-xl m-8">{error}</div>;

  const open = survey ? isSurveyOpen(survey) : false;
  if (survey && !open) {
    return (
      <div className="max-w-xl mx-auto py-12 px-6 text-center space-y-4">
        <div className="size-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-4xl">lock_clock</span>
        </div>
        <h2 className="text-2xl font-bold">Survey Closed</h2>
        <p className="text-slate-500">This survey has expired or been closed by the creator. You can no longer submit responses.</p>
        <Button color="primary" variant="flat" onPress={() => navigate('/browse')}>Back to Browse</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card isBlurred className="border-none bg-background/60 dark:bg-default-100/50 shadow-lg">
        <CardHeader className="flex flex-col items-start px-6 pt-6 pb-0">
          <h1 className="text-2xl font-bold uppercase">{survey.title}</h1>
          <p className="text-default-500">{survey.description || 'Please complete the survey below.'}</p>
          {error && <p className="text-danger mt-2">{error}</p>}
        </CardHeader>
        <Divider className="my-4" />
        <CardBody className="px-6 pb-6">
          <form onSubmit={(e) => e.preventDefault()}>
            {(Array.isArray(survey?.questions) ? survey.questions : []).map((q, index) => {
              const type = q.type || 'multipleChoice';
              if (type === 'trueFalse') {
                return (
                  <TrueFalseQuestion
                    key={q.id}
                    question={q}
                    index={index}
                    value={answers[q.id]}
                    onChange={(val) => handleOptionChange(q.id, val)}
                  />
                );
              }
              if (type === 'ranking') {
                return (
                  <RankingQuestion
                    key={q.id}
                    question={q}
                    index={index}
                    value={answers[q.id]}
                    onChange={(val) => handleOptionChange(q.id, val)}
                  />
                );
              }
              if (type === 'text') {
                return (
                  <TextQuestion
                    key={q.id}
                    question={q}
                    index={index}
                    value={answers[q.id] || ''}
                    onChange={(val) => handleOptionChange(q.id, val)}
                  />
                );
              }
              return (
                <RadioQuestion
                  key={q.id}
                  question={q}
                  index={index}
                  value={answers[q.id]}
                  onChange={(val) => handleOptionChange(q.id, val)}
                />
              );
            })}

            <SurveyActions
              onSubmit={handleSubmit}
              onCancel={() => navigate('/browse')}
              isSubmitting={submitting}
            />
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
