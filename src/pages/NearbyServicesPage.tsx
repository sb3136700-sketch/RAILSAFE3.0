import React, { useState } from 'react';
import { NearbyFacility } from '../types';
import { MapViewer } from '../components/MapViewer';
import {
  LifeBuoy,
  PhoneCall,
  MapPin,
  ExternalLink,
  Shield,
  HeartPulse,
  Pill,
  Clock,
  Compass,
} from 'lucide-react';

const SEEDED_FACILITIES: NearbyFacility[] = [
  {
    id: 'fac-1',
    name: 'Railway Divisional Hospital (Bhopal)',
    type: 'hospital',
    distanceKm: 0.8,
    address: 'Near Platform 1 Exit, Railway Colony, Bhopal',
    phone: '+917552741234',
    emergencyNumber: '139 (Ext. Medical)',
    lat: 23.2612,
    lng: 77.4145,
    isOpen24Hours: true,
  },
  {
    id: 'fac-2',
    name: 'Government Railway Police (GRP) Station',
    type: 'railway_police',
    distanceKm: 0.1,
    address: 'Platform 1 East Wing, Bhopal Junction',
    phone: '+917552554321',
    emergencyNumber: '182 / 139',
    lat: 23.2595,
    lng: 77.4121,
    isOpen24Hours: true,
  },
  {
    id: 'fac-3',
    name: 'Bhopal City Police Station (Jahangirabad)',
    type: 'police',
    distanceKm: 2.1,
    address: 'Station Road, Near Hamidia Road, Bhopal',
    phone: '+917552445566',
    emergencyNumber: '112',
    lat: 23.2514,
    lng: 77.4082,
    isOpen24Hours: true,
  },
  {
    id: 'fac-4',
    name: 'Apollo 24x7 Emergency Station Pharmacy',
    type: 'pharmacy',
    distanceKm: 0.3,
    address: 'Station Concourse, Platform 6 Exit',
    phone: '+917552889900',
    emergencyNumber: '108',
    lat: 23.2605,
    lng: 77.4112,
    isOpen24Hours: true,
  },
  {
    id: 'fac-5',
    name: 'Bansal Super Speciality Hospital & Trauma Care',
    type: 'hospital',
    distanceKm: 3.4,
    address: 'Chuna Bhatti, Shahpura, Bhopal',
    phone: '+917554086000',
    emergencyNumber: '108',
    lat: 23.2389,
    lng: 77.4241,
    isOpen24Hours: true,
  },
];

export const NearbyServicesPage: React.FC = () => {
  const [facilities, setFacilities] = useState<NearbyFacility[]>(SEEDED_FACILITIES);
  const [selectedType, setSelectedType] = useState<string>('all');

  const filtered = facilities.filter(
    (f) => selectedType === 'all' || f.type === selectedType
  );

  const markers = filtered.map((f) => ({
    lat: f.lat,
    lng: f.lng,
    title: f.name,
    subtitle: `${f.address} • Phone: ${f.phone}`,
    iconType: f.type.includes('police') ? ('police' as const) : ('hospital' as const),
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-white tracking-wide">NEARBY EMERGENCY SERVICES & MEDICAL CARE</h1>
          <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
            STATION VICINITY
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Hospitals, trauma units, Railway Police (RPF/GRP), and 24x7 pharmacies near Bhopal Junction and route halts.
        </p>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {[
          { id: 'all', label: 'All Facilities' },
          { id: 'hospital', label: 'Hospitals & Trauma' },
          { id: 'railway_police', label: 'Railway Police (RPF/GRP)' },
          { id: 'police', label: 'City Police Stations' },
          { id: 'pharmacy', label: 'Pharmacies' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedType(tab.id)}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-colors ${
              selectedType === tab.id
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Map & List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Interactive Map (7 cols) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="text-xs text-slate-400 flex items-center justify-between font-mono">
            <span>Center: Bhopal Junction Vicinity (23.2599, 77.4126)</span>
            <span>{filtered.length} locations plotted</span>
          </div>
          <MapViewer
            center={[23.2599, 77.4126]}
            zoom={13}
            markers={markers}
            className="h-[460px] w-full"
          />
        </div>

        {/* Facilities List (5 cols) */}
        <div className="lg:col-span-5 space-y-3 max-h-[490px] overflow-y-auto pr-1">
          {filtered.map((fac) => (
            <div
              key={fac.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white">{fac.name}</h4>
                  <div className="text-[11px] text-slate-400 mt-0.5">{fac.address}</div>
                </div>
                <span className="text-xs font-mono font-black text-cyan-400 shrink-0">
                  {fac.distanceKm} km
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-850">
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-mono">
                  {fac.isOpen24Hours ? 'OPEN 24 HOURS' : 'REGULAR HOURS'}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  Emergency: <strong className="text-white">{fac.emergencyNumber}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <a
                  href={`tel:${fac.phone}`}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold border border-slate-700 flex items-center justify-center gap-1.5"
                >
                  <PhoneCall size={13} className="text-cyan-400" /> Call Facility
                </a>
                <a
                  href={`https://www.google.com/maps?q=${fac.lat},${fac.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-cyan-400 font-bold border border-slate-800 flex items-center justify-center gap-1.5"
                >
                  <MapPin size={13} /> Directions
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
