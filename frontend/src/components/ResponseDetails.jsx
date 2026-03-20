import React from 'react';

export default function ResponseDetails({ responses, questions, isAnonymous }) {
  if (!responses || responses.length === 0) return <p>No individual responses yet.</p>;
  const formatAnswer = (value) => {
    if (value == null || value === '') return '-';
    if (typeof value === 'string' && value.startsWith('[')) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.join(' -> ');
      } catch (_) {
        // Ignore parse failures and show raw value
      }
    }
    return value;
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h3>Individual Responses</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Time</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>User</th>
              {questions.map(q => (
                <th key={q.questionId} style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
                  {q.questionText}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {responses.map(resp => (
              <tr key={resp.id}>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                  {new Date(resp.submittedAt).toLocaleString()}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                  <span>{isAnonymous ? 'Anonymous' : resp.userDisplayName}</span>
                </td>
                {questions.map(q => (
                  <td key={q.questionId} style={{ border: '1px solid #ddd', padding: '12px' }}>
                    {formatAnswer(resp.answers[q.questionId])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
