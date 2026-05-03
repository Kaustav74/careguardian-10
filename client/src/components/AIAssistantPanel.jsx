import { useState } from 'react';
import { api } from '../services/api';

export default function AIAssistantPanel() {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const run = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/ai/triage', { symptoms });
      setResult(data);
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
      {result && <div className="mt-3 text-xs text-slate-600"><p className="font-medium">Severity: {result.severity}</p><p>{result.summary}</p></div>}
    </aside>
  );
}
