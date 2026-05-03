import { useState } from 'react';
import PageContainer from '../../components/PageContainer';
import { api } from '../../services/api';

export default function AIAssistantPage() {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const runTriage = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/ai/analyze', { symptoms });
      setResult(data);
    } catch (_e) {
      setError('Unable to run AI triage right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <section className="mx-auto max-w-2xl card">
        <h1 className="text-2xl font-semibold">AI Assistant</h1>
        <p className="mt-2 text-sm text-slate-500">Describe symptoms for triage guidance.</p>
        <form onSubmit={runTriage} className="mt-4 space-y-3">
          <textarea className="input min-h-32" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="e.g., fever, chest discomfort, breathlessness" />
          <button className="btn-primary" disabled={loading}>{loading ? 'Analyzing...' : 'Run Triage'}</button>
        </form>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {result && (
          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm space-y-1">
            <p><span className="font-semibold">Severity:</span> {result.severity}</p>
            <p><span className="font-semibold">Recommendation:</span> {result.recommendation}</p>
            <p><span className="font-semibold">Specialist:</span> {result.specialist}</p>
          </div>
        )}
      </section>
    </PageContainer>
  );
}
