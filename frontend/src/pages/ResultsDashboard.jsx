import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@heroui/react';
import ResponseDetails from '../components/ResponseDetails';
import { handleExportCsv } from '../utils/surveyUtils';

export default function ResultsDashboard() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, [id]);

  const fetchResults = async () => {
    try {
      const response = await axios.get(`/api/surveys/${id}/results`);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(`/api/surveys/${id}/results/export`, { responseType: 'blob' });
      handleExportCsv(response.data, `survey-${id}-results.csv`);
    } catch (_) {
      setError('Export failed');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
          <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-4 rounded-xl text-sm">
          {error}
        </div>
        <Link to="/" className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-primary hover:underline">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const completionPct = data.completion
    ? Math.round((data.completion.responded.length / Math.max(1, data.completion.responded.length + data.completion.notResponded.length)) * 100)
    : null;

  return (
    <div className="max-w-4xl mx-auto py-8 px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link to="/" className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-primary uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Dashboard
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{data.surveyTitle}</h2>
        </div>
        <Button size="sm" color="primary" variant="flat" onPress={handleExport} startContent={<span className="material-symbols-outlined text-sm">download</span>}>
          Export CSV
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Responses</p>
          <p className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">{data.totalResponses}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Privacy Mode</p>
          <p className="text-lg font-bold mt-1 text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">{data.isAnonymous ? 'visibility_off' : 'visibility'}</span>
            {data.isAnonymous ? 'Anonymous' : 'Identified'}
          </p>
        </div>
        {completionPct != null && (
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Completion</p>
            <p className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">{completionPct}%</p>
            <div className="mt-2 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${completionPct}%` }} />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {data.completion.responded.length} responded · {data.completion.notResponded.length} pending
            </p>
          </div>
        )}
      </div>

      {/* Not responded list */}
      {data.completion && data.completion.notResponded.length > 0 && (
        <details className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <summary className="px-5 py-4 cursor-pointer text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">
            {data.completion.notResponded.length} student{data.completion.notResponded.length !== 1 ? 's' : ''} have not responded
          </summary>
          <ul className="px-5 pb-4 space-y-1">
            {data.completion.notResponded.map((u) => (
              <li key={u.id} className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-slate-400">person</span>
                {u.displayName || u.username}
              </li>
            ))}
          </ul>
        </details>
      )}

      {/* Results by question */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Summary by Question</h3>
        <div className="space-y-4">
          {data.results.map((q, idx) => (
            <div key={q.questionId} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <div className="flex items-start gap-3 mb-4">
                <span className="flex items-center justify-center size-7 rounded-lg bg-primary/10 text-primary text-sm font-bold shrink-0">{idx + 1}</span>
                <h4 className="text-base font-semibold text-slate-900 dark:text-white">{q.questionText}</h4>
              </div>

              {q.type === 'ranking' && q.rankingSummary ? (
                <div className="pl-10">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Average rank (1 = first choice)</p>
                  <ol className="space-y-2">
                    {q.rankingSummary.map((row) => (
                      <li key={row.option} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <span className="text-sm font-bold text-primary">{row.option}</span>
                        {row.averageRank != null && (
                          <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto">
                            Avg rank: {row.averageRank} ({row.totalVotes} votes)
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              ) : q.type === 'text' ? (
                <div className="pl-10">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Text responses</p>
                  {(q.textResponses || []).length > 0 ? (
                    <ul className="space-y-2">
                      {(q.textResponses || []).map((text, i) => (
                        <li key={i} className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                          "{text}"
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No text responses submitted.</p>
                  )}
                </div>
              ) : (
                <div className="pl-10 space-y-3">
                  {(q.options || []).map(opt => {
                    const count = (q.counts && q.counts[opt]) || 0;
                    const percentage = data.totalResponses > 0
                      ? Math.round((count / data.totalResponses) * 100)
                      : 0;
                    return (
                      <div key={opt}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{opt}</span>
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tabular-nums">{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <ResponseDetails
        responses={data.detailedResponses}
        questions={data.results}
        isAnonymous={data.isAnonymous}
      />
    </div>
  );
}
