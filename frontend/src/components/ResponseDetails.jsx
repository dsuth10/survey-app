import React from 'react';

export default function ResponseDetails({ responses, questions, isAnonymous }) {
  if (!responses || responses.length === 0) {
    return (
      <div className="mt-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Individual Responses</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">No individual responses yet.</p>
      </div>
    );
  }

  const formatAnswer = (value) => {
    if (value == null || value === '') return '—';
    if (typeof value === 'string' && value.startsWith('[')) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.join(' → ');
      } catch (_) {
        // show raw value on parse failure
      }
    }
    return value;
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Individual Responses</h3>
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Time</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">User</th>
                {questions.map(q => (
                  <th key={q.questionId} className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 min-w-[120px]">
                    {q.questionText}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {responses.map(resp => (
                <tr key={resp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {new Date(resp.submittedAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {isAnonymous ? (
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <span className="material-symbols-outlined text-sm">visibility_off</span>
                        Anonymous
                      </span>
                    ) : resp.userDisplayName}
                  </td>
                  {questions.map(q => (
                    <td key={q.questionId} className="px-5 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {formatAnswer(resp.answers[q.questionId])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
