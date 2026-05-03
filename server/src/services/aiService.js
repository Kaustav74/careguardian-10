const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function runGroqPrompt(messages) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return { unavailable: true, message: 'GROQ_API_KEY is not configured.' };
  }

  const { data } = await axios.post(
    GROQ_API_URL,
    {
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      temperature: 0.2,
      messages,
      response_format: { type: 'json_object' },
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    }
  );

  return JSON.parse(data.choices?.[0]?.message?.content || '{}');
}

exports.analyzeSymptoms = async ({ symptoms, age, history }) => {
  const prompt = [
    { role: 'system', content: 'You are a healthcare triage assistant. Return strict JSON with keys: summary, probable_conditions (array), severity (low|medium|high), recommendation.' },
    { role: 'user', content: `Symptoms: ${symptoms}. Age: ${age || 'unknown'}. History: ${history || 'none'}.` },
  ];
  const result = await runGroqPrompt(prompt);

  if (result.unavailable) {
    return {
      summary: 'AI service unavailable; fallback triage used.',
      probable_conditions: ['Undetermined'],
      severity: /chest pain|breath|unconscious|bleeding/i.test(symptoms || '') ? 'high' : 'medium',
      recommendation: 'Contact doctor immediately if symptoms worsen.',
    };
  }

  return result;
};
