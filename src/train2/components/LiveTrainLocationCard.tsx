import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, Clock3, ExternalLink, MapPin, RefreshCw, TrainFront } from 'lucide-react';

type RoutePoint = {
  sequence?: number;
  stationCode?: string;
  stationName?: string;
  lat?: number;
  lng?: number;
  distance?: number;
  status?: string;
};

type Halt = {
  stationCode?: string;
  stationName?: string;
  sequence?: number;
  distance?: number;
};

type LivePayload = {
  ok: boolean;
  status: string;
  provider?: string | null;
  message?: string;
  fetchedAt?: string;
  sourceUpdatedAt?: string | null;
  providerResponseAt?: string | null;
  trainNumber?: string;
  trainName?: string | null;
  runDate?: string | null;
  runningStatus?: string | null;
  delayMinutes?: number | null;
  currentLocation?: {
    stationCode?: string;
    sequence?: number;
    status?: string;
    isActualPosition?: boolean;
    segmentProgress?: number;
    speedKmh?: number;
    bearingDegrees?: number;
    lat?: number;
    lng?: number;
    latitude?: number;
    longitude?: number;
  } | null;
  previousHalt?: Halt | null;
  nextHalt?: Halt | null;
  route?: RoutePoint[];
  geometry?: unknown;
  isLive?: boolean;
};

type Point = { lat: number; lng: number; source: 'provider' | 'estimated' };

interface LiveTrainLocationCardProps {
  trainNumber: string;
  trainName: string;
}

const validCoordinate = (lat: unknown, lng: unknown): lat is number =>
  typeof lat === 'number' && Number.isFinite(lat) && lat >= -90 && lat <= 90 &&
  typeof lng === 'number' && Number.isFinite(lng) && lng >= -180 && lng <= 180;


type LngLat = [number, number];

const getTrackCoordinates = (geometry: unknown): LngLat[] => {
  if (!geometry || typeof geometry !== 'object') return [];
  const value = geometry as {
    coordinates?: unknown;
    geometry?: { coordinates?: unknown };
    geojson?: { geometry?: { coordinates?: unknown } };
  };
  const raw = Array.isArray(value.coordinates) ? value.coordinates :
    Array.isArray(value.geometry?.coordinates) ? value.geometry.coordinates :
    Array.isArray(value.geojson?.geometry?.coordinates) ? value.geojson.geometry.coordinates : [];
  return raw.filter((item): item is LngLat =>
    Array.isArray(item) && item.length >= 2 &&
    typeof item[0] === 'number' && Number.isFinite(item[0]) && item[0] >= -180 && item[0] <= 180 &&
    typeof item[1] === 'number' && Number.isFinite(item[1]) && item[1] >= -90 && item[1] <= 90
  );
};

// Locate station endpoints on the provider's rail-track geometry and interpolate by
// the provider's reported segment progress. Falls back to station-to-station interpolation
// below when geometry is absent or cannot be aligned to the reported stops.
const interpolateOnTrack = (
  coordinates: LngLat[],
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  progress: number
): { lat: number; lng: number } | null => {
  if (coordinates.length < 2 || progress < 0 || progress > 1) return null;
  const meanLat = (start.lat + end.lat) / 2;
  const cosLat = Math.cos(meanLat * Math.PI / 180);
  const xy = (point: LngLat) => ({ x: point[0] * cosLat, y: point[1] });
  const cumulative = [0];
  for (let i = 1; i < coordinates.length; i++) {
    const a = xy(coordinates[i - 1]);
    const b = xy(coordinates[i]);
    cumulative.push(cumulative[i - 1] + Math.hypot(b.x - a.x, b.y - a.y));
  }

  const along = (target: { lat: number; lng: number }) => {
    const tPoint = { x: target.lng * cosLat, y: target.lat };
    let bestDistance = Number.POSITIVE_INFINITY;
    let bestAlong = 0;
    for (let i = 1; i < coordinates.length; i++) {
      const a = xy(coordinates[i - 1]);
      const b = xy(coordinates[i]);
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const denom = dx * dx + dy * dy;
      const t = denom === 0 ? 0 : Math.max(0, Math.min(1, ((tPoint.x - a.x) * dx + (tPoint.y - a.y) * dy) / denom));
      const projectedX = a.x + t * dx;
      const projectedY = a.y + t * dy;
      const distance = (tPoint.x - projectedX) ** 2 + (tPoint.y - projectedY) ** 2;
      if (distance < bestDistance) {
        bestDistance = distance;
        bestAlong = cumulative[i - 1] + Math.sqrt(denom) * t;
      }
    }
    return bestAlong;
  };

  const from = along(start);
  const to = along(end);
  if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from) return null;
  const target = from + (to - from) * progress;
  for (let i = 1; i < coordinates.length; i++) {
    if (target <= cumulative[i]) {
      const length = cumulative[i] - cumulative[i - 1];
      const t = length === 0 ? 0 : (target - cumulative[i - 1]) / length;
      return {
        lng: coordinates[i - 1][0] + (coordinates[i][0] - coordinates[i - 1][0]) * t,
        lat: coordinates[i - 1][1] + (coordinates[i][1] - coordinates[i - 1][1]) * t
      };
    }
  }
  const last = coordinates[coordinates.length - 1];
  return { lng: last[0], lat: last[1] };
};

const formatUpdated = (value?: string | null) => {
  if (!value) return 'Timestamp not supplied by provider';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Timestamp unavailable' : date.toLocaleString();
};

export const LiveTrainLocationCard: React.FC<LiveTrainLocationCardProps> = ({ trainNumber, trainName }) => {
  const [payload, setPayload] = useState<LivePayload | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    if (!/^\d{5}$/.test(trainNumber)) {
      setErrorMessage('Select a valid 5-digit train number.');
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`/api/trains/${encodeURIComponent(trainNumber)}/live?refresh=true`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        signal
      });
      const result = await response.json() as LivePayload;
      setLastCheckedAt(new Date().toISOString());
      if (!response.ok || result.ok !== true) {
        setErrorMessage(result.message || result.status || 'Live train data is unavailable.');
        return;
      }
      setPayload(result);
      setErrorMessage(null);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      setErrorMessage('Could not reach the live tracking service. The last result, if any, is retained.');
    } finally {
      setLoading(false);
    }
  }, [trainNumber]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setPayload(null);
    setErrorMessage(null);
    void refresh(controller.signal);

    const poll = window.setInterval(() => {
      if (!document.hidden) void refresh();
    }, 30_000);
    const onVisibilityChange = () => {
      if (!document.hidden) void refresh();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      controller.abort();
      window.clearInterval(poll);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [refresh]);

  const point = useMemo<Point | null>(() => {
    const location = payload?.currentLocation;
    if (!payload || !location) return null;
    const exactLat = location.lat ?? location.latitude;
    const exactLng = location.lng ?? location.longitude;
    if (typeof exactLat === 'number' && typeof exactLng === 'number' && validCoordinate(exactLat, exactLng)) return { lat: exactLat, lng: exactLng, source: 'provider' };

    const route = payload.route || [];
    const prev = route.find((p) =>
      (payload.previousHalt?.sequence != null && p.sequence === payload.previousHalt.sequence) ||
      (payload.previousHalt?.stationCode && p.stationCode === payload.previousHalt.stationCode)
    );
    const next = route.find((p) =>
      (payload.nextHalt?.sequence != null && p.sequence === payload.nextHalt.sequence) ||
      (payload.nextHalt?.stationCode && p.stationCode === payload.nextHalt.stationCode)
    );
    const progress = location.segmentProgress;
    if (
      prev && next && typeof prev.lat === 'number' && typeof prev.lng === 'number' && typeof next.lat === 'number' && typeof next.lng === 'number' && validCoordinate(prev.lat, prev.lng) && validCoordinate(next.lat, next.lng) &&
      typeof progress === 'number' && Number.isFinite(progress) && progress >= 0 && progress <= 1
    ) {
      const trackCoordinates = getTrackCoordinates(payload.geometry);
      const trackPoint = interpolateOnTrack(
        trackCoordinates,
        { lat: prev.lat, lng: prev.lng },
        { lat: next.lat, lng: next.lng },
        progress
      );
      if (trackPoint && validCoordinate(trackPoint.lat, trackPoint.lng)) {
        return { ...trackPoint, source: 'estimated' };
      }

      // Fallback: station-to-station interpolation is not a GPS fix. Always label it approximate.
      return {
        lat: prev.lat + (next.lat - prev.lat) * progress,
        lng: prev.lng + (next.lng - prev.lng) * progress,
        source: 'estimated'
      };
    }
    return null;
  }, [payload]);

  const location = payload?.currentLocation;
  const sourceTime = payload?.sourceUpdatedAt || null;
  const sourceAgeMs = sourceTime ? Date.now() - new Date(sourceTime).getTime() : null;
  const sourceIsStale = sourceAgeMs != null && (!Number.isFinite(sourceAgeMs) || sourceAgeMs > 120_000);
  const sourceFresh = Boolean(sourceTime && !sourceIsStale);
  const liveConfirmed = Boolean(payload?.isLive && sourceFresh);
  const mapUrl = point
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${(point.lng - 0.12).toFixed(5)}%2C${(point.lat - 0.08).toFixed(5)}%2C${(point.lng + 0.12).toFixed(5)}%2C${(point.lat + 0.08).toFixed(5)}&layer=mapnik&marker=${point.lat.toFixed(6)}%2C${point.lng.toFixed(6)}`
    : null;
  const mapLink = point ? `https://www.openstreetmap.org/?mlat=${point.lat}&mlon=${point.lng}#map=13/${point.lat}/${point.lng}` : null;

  return (
    <section className="overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-950 shadow-xl">
      <div className="flex flex-col gap-3 border-b border-slate-800 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
            <TrainFront className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-white">Real-time train status</h2>
              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                liveConfirmed ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' :
                payload ? 'border-amber-500/40 bg-amber-500/10 text-amber-300' :
                'border-slate-700 bg-slate-900 text-slate-400'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${liveConfirmed ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                {liveConfirmed ? 'Provider reports live' : sourceIsStale ? 'Stale data' : payload && sourceFresh ? 'Provider status' : payload ? 'Check freshness' : 'Not connected'}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">{trainNumber} · {trainName}</p>
          </div>
        </div>
        <button
          onClick={() => { setLoading(true); void refresh(); }}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-500/50 disabled:opacity-60"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[1.05fr_1fr]">
        <div className="space-y-4">
          {errorMessage && (
            <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-200">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-semibold">{payload ? 'Live refresh failed' : 'Live data unavailable'}</p>
                <p className="mt-1 leading-relaxed">{errorMessage}</p>
                {!payload && <p className="mt-2 text-amber-100/70">Set RAILRADAR_API_KEY in the server environment to connect a live provider. No moving train simulation is presented as real data.</p>}
              </div>
            </div>
          )}

          {payload ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                  <p className="text-[11px] font-medium text-slate-400">Running status</p>
                  <p className="mt-1 text-lg font-bold capitalize text-white">{(payload.runningStatus || 'Unknown').replace(/-/g, ' ')}</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                  <p className="text-[11px] font-medium text-slate-400">Delay</p>
                  <p className="mt-1 text-lg font-bold text-white">{payload.delayMinutes == null ? '—' : payload.delayMinutes === 0 ? 'On time' : `${payload.delayMinutes} min`}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-slate-400">Reported position</p>
                    <p className="mt-1 break-words text-sm font-bold text-white">
                      {location?.stationCode || payload.previousHalt?.stationName || payload.previousHalt?.stationCode || 'Position not supplied'}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      {payload.previousHalt?.stationName || payload.previousHalt?.stationCode || 'Previous station unavailable'}
                      {' → '}
                      {payload.nextHalt?.stationName || payload.nextHalt?.stationCode || 'Next station unavailable'}
                    </p>
                    {typeof location?.segmentProgress === 'number' && (
                      <div className="mt-3">
                        <div className="mb-1 flex justify-between text-[10px] text-slate-400">
                          <span>Reported segment progress</span><span>{Math.round(location.segmentProgress * 100)}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                          <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400" style={{ width: `${Math.max(0, Math.min(100, location.segmentProgress * 100))}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {typeof location?.speedKmh === 'number' && (
                  <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-3">
                    <span className="text-xs text-slate-400">Provider-reported speed</span>
                    <span className="font-mono text-lg font-bold text-cyan-200">{location.speedKmh} <span className="text-xs font-medium text-slate-400">km/h</span></span>
                  </div>
                )}
              </div>
              <div className="flex items-start gap-2 text-[11px] text-slate-400">
                <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <div>
                  <p>Data timestamp: {formatUpdated(sourceTime)}</p>
                  {sourceIsStale && <p className="mt-1 font-semibold text-amber-300">This data is older than 2 minutes. Treat the position as stale.</p>}
                  {payload.providerResponseAt && <p className="mt-1">Provider response: {formatUpdated(payload.providerResponseAt)}</p>}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-6 text-center">
              <Activity className="mx-auto h-7 w-7 text-slate-500" />
              <p className="mt-2 text-sm font-semibold text-slate-200">{loading ? 'Connecting to live provider…' : 'Waiting for live data'}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">This panel only displays provider responses. It will not generate artificial coordinates or speed values.</p>
              {lastCheckedAt && <p className="mt-3 text-[10px] text-slate-500">Last checked {formatUpdated(lastCheckedAt)}</p>}
            </div>
          )}
        </div>

        <div className="min-h-[240px] overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          {point && mapUrl ? (
            <>
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 px-3 py-2">
                <span className="text-[11px] font-semibold text-slate-300">{point.source === 'provider' ? 'Provider coordinate' : 'Approximate route position'}</span>
                {mapLink && <a href={mapLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-300 hover:text-cyan-200">Open map <ExternalLink className="h-3 w-3" /></a>}
              </div>
              <iframe title={`Train ${trainNumber} map`} src={mapUrl} className="h-[240px] w-full sm:h-[280px]" loading="lazy" referrerPolicy="no-referrer" />
              <p className="border-t border-slate-800 px-3 py-2 text-[10px] leading-relaxed text-slate-400">
                {point.source === 'provider' ? 'Coordinates supplied directly by the live provider.' : 'Approximate point interpolated between station coordinates using provider segment progress. This is not a GPS fix.'}
              </p>
            </>
          ) : (
            <div className="flex h-[240px] flex-col items-center justify-center px-6 text-center sm:h-[280px]">
              <MapPin className="h-8 w-8 text-slate-600" />
              <p className="mt-3 text-sm font-semibold text-slate-300">Map position not available</p>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">A map marker appears only when the provider supplies coordinates or station coordinates plus segment progress. We will not invent a GPS point.</p>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-slate-800 px-4 py-3 text-[10px] leading-relaxed text-slate-500 sm:px-5">
        Provider: {payload?.provider || 'Not connected'} · Auto-refresh every 30 seconds while this page is visible · Actual accuracy depends on the provider's feed and timestamp.
      </div>
    </section>
  );
};
