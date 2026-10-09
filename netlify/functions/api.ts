import type { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

const trainLiveCache = new Map<string, { fetchedAtMs: number; payload: Record<string, any> }>();

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
          smsProvider: { status: process.env.MSG91_AUTH_KEY && process.env.MSG91_TEMPLATE_ID ? 'configured' : 'manual_fallback', provider: process.env.MSG91_AUTH_KEY && process.env.MSG91_TEMPLATE_ID ? 'MSG91' : 'Manual device SMS fallback' },
        },
      }),
    };
  }


  // Provider-backed Train 2 live tracking endpoint. Secrets remain server-side.
  const liveTrainMatch = path.match(/^\/trains\/([^/]+)\/live$/);
  if (liveTrainMatch && method === 'GET') {
    const trainNumber = decodeURIComponent(liveTrainMatch[1] || '').trim();
    if (!/^\d{5}$/.test(trainNumber)) {
      return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, status: 'invalid', error: 'Train number must contain exactly 5 digits.' }) };
    }
    const providerKey = process.env.RAILRADAR_API_KEY;
    const rawBase = (process.env.RAILRADAR_BASE_URL || 'https://api.railradar.in/v1').replace(/\/+$/, '');
    const baseUrl = /\/v1$/i.test(rawBase) ? rawBase : rawBase + '/v1';
    if (!providerKey) {
      return { statusCode: 503, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, status: 'unavailable', provider: null, message: 'Live tracking is not configured. No simulated location is shown as live.' }) };
    }
    const query = event.queryStringParameters || {};
    const date = String(query.date || '');
    const cacheKey = trainNumber + ':' + date;
    const cached = trainLiveCache.get(cacheKey);
    if (cached && Date.now() - cached.fetchedAtMs < 20_000 && query.refresh !== 'true') {
      return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify({ ...cached.payload, cacheAgeSeconds: Math.floor((Date.now() - cached.fetchedAtMs) / 1000) }) };
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);
    try {
      const url = new URL(baseUrl + '/trains/' + encodeURIComponent(trainNumber) + '/live');
      if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) url.searchParams.set('date', date);
      url.searchParams.set('authoritative', 'true');
      url.searchParams.set('includeCoordinates', 'true');
      url.searchParams.set('geometry', 'true');
      url.searchParams.set('format', 'geojson');
      const upstream = await fetch(url, { headers: { Authorization: 'Bearer ' + providerKey, Accept: 'application/json' }, signal: controller.signal });
      const body = await upstream.json().catch(() => ({} as Record<string, any>)) as Record<string, any>;
      if (!upstream.ok || body.success === false) {
        const status = upstream.status === 401 || upstream.status === 403 ? 'provider_auth_error' : upstream.status === 404 ? 'not_found' : upstream.status === 429 ? 'rate_limited' : 'provider_error';
        return { statusCode: upstream.status === 404 ? 404 : upstream.status === 429 ? 429 : 502, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, status, provider: 'RailRadar', message: body?.error?.message || 'Live status provider returned HTTP ' + upstream.status + '.' }) };
      }
      const data = body.data || body;
      const payload = {
        ok: true,
        status: data.isLive === true ? 'live' : 'stale',
        provider: 'RailRadar',
        fetchedAt: new Date().toISOString(),
        sourceUpdatedAt: data.lastUpdatedAt || null,
        providerResponseAt: body.meta?.timestamp || null,
        trainNumber: data.trainNumber || trainNumber,
        trainName: data.trainName || data.train?.name || null,
        runDate: data.startDate || null,
        runningStatus: data.status || null,
        delayMinutes: Number.isFinite(data.delayMinutes) ? data.delayMinutes : null,
        currentLocation: data.currentLocation || null,
        previousHalt: data.previousHalt || null,
        nextHalt: data.nextHalt || null,
        route: Array.isArray(data.route) ? data.route : [],
        geometry: data.geometry || data.geojson || null,
        isLive: data.isLive === true
      };
      trainLiveCache.set(cacheKey, { fetchedAtMs: Date.now(), payload });
      return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify(payload) };
    } catch (error) {
      const timedOut = error instanceof Error && error.name === 'AbortError';
      return { statusCode: 502, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, status: timedOut ? 'timeout' : 'provider_unavailable', provider: 'RailRadar', message: timedOut ? 'Live status request timed out. Try again shortly.' : 'Unable to retrieve live train status right now.' }) };
    } finally {
      clearTimeout(timeout);
    }
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
