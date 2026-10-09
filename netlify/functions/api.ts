import type { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

export const handler: Handler = async (event, context) => {
  const path = event.path.replace(/^\/\.netlify\/functions\/api/, '').replace(/^\/api/, '');
  const method = event.httpMethod;

  // Health check
  if (path === '/health' && method === 'GET') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        runtime: 'Netlify Serverless Functions',
        services: {
          database: { status: 'connected', mode: 'Supabase PostgreSQL Cloud' },
          geminiAi: { status: process.env.GEMINI_API_KEY ? 'connected' : 'unconfigured', model: 'gemini-3.8-flash' },
          railwayApi: { status: process.env.RAILRADAR_API_KEY ? 'connected' : 'demo_mode' },
          smsProvider: { status: 'configured', provider: process.env.SMS_PROVIDER || 'DEMO_MOCK' },
        },
      }),
    };
  }

  // Handle Gemini assistant
  if (path === '/ai/assistant' && method === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      if (!process.env.GEMINI_API_KEY) {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reply: 'RailSafe Emergency Advisor: For immediate assistance aboard Indian Railways, dial 139 or 112.',
          }),
        };
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: body.prompt || 'How do I contact railway emergency?',
      });

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: response.text }),
      };
    } catch (err: any) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: err.message }),
      };
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'RailSafe Netlify Serverless API Active' }),
  };
};
