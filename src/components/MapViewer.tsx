import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapMarker {
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  iconType?: 'train' | 'station' | 'sos' | 'hospital' | 'police';
  isCurrent?: boolean;
}

interface MapViewerProps {
  center: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  polyline?: [number, number][];
  className?: string;
}

export const MapViewer: React.FC<MapViewerProps> = ({
  center,
  zoom = 6,
  markers = [],
  polyline = [],
  className = 'h-96 w-full',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true,
      });

      // CartoDB Dark Matter high-contrast tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
    } else {
      mapInstanceRef.current.setView(center, zoom);
    }

    // Render layers
    if (layerGroupRef.current) {
      layerGroupRef.current.clearLayers();

      // Render polyline if provided
      if (polyline.length > 1) {
        const line = L.polyline(polyline, {
          color: '#06b6d4',
          weight: 4,
          opacity: 0.85,
          dashArray: '6, 8',
        });
        layerGroupRef.current.addLayer(line);
      }

      // Render markers
      markers.forEach((m) => {
        let colorClass = 'bg-cyan-500 text-slate-950 border-cyan-300';
        let iconSvg = '🚆';

        if (m.iconType === 'sos') {
          colorClass = 'bg-red-600 text-white border-red-300 animate-pulse';
          iconSvg = '🚨';
        } else if (m.iconType === 'hospital') {
          colorClass = 'bg-rose-500 text-white border-rose-300';
          iconSvg = '🏥';
        } else if (m.iconType === 'police') {
          colorClass = 'bg-blue-600 text-white border-blue-300';
          iconSvg = '👮';
        } else if (m.iconType === 'station') {
          colorClass = m.isCurrent ? 'bg-amber-500 text-slate-950 border-white ring-4 ring-amber-400/40' : 'bg-slate-700 text-white border-slate-500';
          iconSvg = '🚉';
        }

        const customIcon = L.divIcon({
          className: 'custom-leaflet-icon',
          html: `<div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;font-size:16px;box-shadow:0 4px 10px rgba(0,0,0,0.5);border:2px solid;" class="${colorClass}">${iconSvg}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([m.lat, m.lng], { icon: customIcon });
        marker.bindPopup(`
          <div style="font-family:sans-serif;color:#0f172a;padding:4px;font-size:12px;">
            <strong style="font-size:13px;color:#0284c7;">${m.title}</strong>
            ${m.subtitle ? `<div style="margin-top:2px;color:#475569;">${m.subtitle}</div>` : ''}
            <div style="margin-top:4px;font-family:monospace;font-size:10px;color:#64748b;">${m.lat.toFixed(4)}, ${m.lng.toFixed(4)}</div>
          </div>
        `);
        layerGroupRef.current?.addLayer(marker);
      });
    }

    return () => {
      // Keep map alive or clean up on route change
    };
  }, [center, zoom, markers, polyline]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      <div className="absolute top-2 right-2 z-10 bg-slate-950/80 backdrop-blur-sm border border-slate-800 text-[10px] text-slate-400 px-2 py-1 rounded font-mono">
        Map &copy; OpenStreetMap
      </div>
    </div>
  );
};
