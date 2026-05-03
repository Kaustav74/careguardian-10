import { useState } from 'react';
import { api } from '../services/api';

export default function AIAssistantPanel() {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const run = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/ai/analyze', { symptoms });
      setResult(data);
      setError('');
    } catch (_e) {
      setError('Unable to analyze symptoms right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="card">
      <h3 className="font-semibold">AI Assistant</h3>
      <form onSubmit={run} className="mt-3 space-y-2">
        <textarea className="input min-h-20" placeholder="Describe symptoms" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} />
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Analyzing...' : 'Run Triage'}</button>
      </form>
      {error && <p className='mt-2 text-xs text-red-600'>{error}</p>}
      {result && <div className="mt-3 text-xs text-slate-600 space-y-1"><p className="font-medium">Severity: {result.severity}</p><p>Recommendation: {result.recommendation}</p><p>Suggested specialist: {result.specialist}</p></div>}
    </aside>
  );
}
