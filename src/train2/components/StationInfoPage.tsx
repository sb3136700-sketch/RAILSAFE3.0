import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  MapPin, 
  ExternalLink, 
  Wifi, 
  Utensils, 
  Armchair, 
  CreditCard, 
  ParkingCircle, 
  HeartPulse, 
  Car, 
  Accessibility, 
  Droplet, 
  Luggage, 
  Coffee, 
  Compass, 
  Hotel,
  Navigation
} from 'lucide-react';
import { getStationDetails, VERIFIED_STATIONS_DATA, StationFacilityData } from '../services/stationService';

export const StationInfoPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedStation, setSelectedStation] = useState<StationFacilityData>(VERIFIED_STATIONS_DATA[0]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const details = getStationDetails(searchInput);
    if (details) {
      setSelectedStation(details);
    }
  };

  const facilitiesList = [
    { key: 'restroom', label: 'Restrooms / Toilets', icon: '🚻', available: selectedStation.facilities.restroom },
    { key: 'food', label: 'Food Plaza / Canteen', icon: '🍴', available: selectedStation.facilities.food },
    { key: 'waitingRoom', label: 'AC Waiting Room', icon: '🪑', available: selectedStation.facilities.waitingRoom },
    { key: 'atm', label: 'Station ATM Kiosk', icon: '🏧', available: selectedStation.facilities.atm },
    { key: 'parking', label: '2-Wheeler / Car Parking', icon: '🅿️', available: selectedStation.facilities.parking },
    { key: 'medical', label: 'Emergency Medical Booth', icon: '🏥', available: selectedStation.facilities.medical },
    { key: 'taxi', label: 'Prepaid Taxi Stand', icon: '🚕', available: selectedStation.facilities.taxi },
    { key: 'auto', label: 'Auto Rickshaw Stand', icon: '🛺', available: selectedStation.facilities.auto },
    { key: 'accessibility', label: 'Wheelchair / Ramp Access', icon: '♿', available: selectedStation.facilities.accessibility },
    { key: 'wifi', label: 'RailWire High-Speed Wi-Fi', icon: '📶', available: selectedStation.facilities.wifi },
    { key: 'water', label: 'RO Drinking Water Booths', icon: '💧', available: selectedStation.facilities.water },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Search Header */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl neon-glow-cyan">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
          <Building2 className="h-4 w-4" />
          <span>Verified Indian Railways Station Directory</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white">
          Station Information & Navigation
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Verified platform facilities, waiting rooms, medical aid, and 1-tap local navigation
        </p>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="mt-5 flex flex-col sm:flex-row gap-2 max-w-xl">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by Station Name or Code (NDLS, CNB, MAS, CBE)..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md neon-glow-cyan"
          >
            <Search className="h-4 w-4" />
            <span>Search Station</span>
          </button>
        </form>

        {/* Station Quick Chips */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-500">Quick Stations:</span>
          {VERIFIED_STATIONS_DATA.map((st) => (
            <button
              key={st.stationCode}
              type="button"
              onClick={() => setSelectedStation(st)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors border ${
                selectedStation.stationCode === st.stationCode
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {st.stationCode} · {st.city}
            </button>
          ))}
        </div>
      </div>

      {/* Station Details Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                {selectedStation.stationCode}
              </span>
              <span className="text-xs text-slate-400">
                {selectedStation.city}, {selectedStation.state}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              {selectedStation.stationName}
            </h2>
            <div className="text-xs text-slate-400 mt-0.5">
              Platforms: <strong className="text-white font-mono">{selectedStation.platforms}</strong> · Coordinates: {selectedStation.latitude}, {selectedStation.longitude}
            </div>
          </div>

          <a
            href={selectedStation.navigationLinks.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md neon-glow-cyan"
          >
            <Navigation className="h-4 w-4" />
            <span>Directions (Google Maps)</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Station Navigation Quick Buttons */}
        <div className="mt-5">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
            Station Navigation & Nearby Services:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            <a
              href={selectedStation.navigationLinks.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-slate-800 bg-slate-950 hover:border-cyan-500/50 text-center transition-all group"
            >
              <Compass className="h-5 w-5 text-cyan-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white block">Directions</span>
            </a>

            <a
              href={selectedStation.navigationLinks.hospitalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-slate-800 bg-slate-950 hover:border-red-500/50 text-center transition-all group"
            >
              <HeartPulse className="h-5 w-5 text-red-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white block">Nearby Hospital</span>
            </a>

            <a
              href={selectedStation.navigationLinks.restaurantUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-slate-800 bg-slate-950 hover:border-amber-500/50 text-center transition-all group"
            >
              <Utensils className="h-5 w-5 text-amber-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white block">Restaurants</span>
            </a>

            <a
              href={selectedStation.navigationLinks.hotelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-slate-800 bg-slate-950 hover:border-indigo-500/50 text-center transition-all group"
            >
              <Hotel className="h-5 w-5 text-indigo-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white block">Retiring Rooms</span>
            </a>

            <a
              href={selectedStation.navigationLinks.cabUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-slate-800 bg-slate-950 hover:border-lime-500/50 text-center transition-all group"
            >
              <Car className="h-5 w-5 text-lime-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white block">Book Cab</span>
            </a>

            <a
              href={selectedStation.navigationLinks.autoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-slate-800 bg-slate-950 hover:border-yellow-500/50 text-center transition-all group"
            >
              <span className="text-lg block mb-0.5">🛺</span>
              <span className="text-xs font-bold text-white block">Station Auto</span>
            </a>
          </div>
        </div>

        {/* Verified Station Facilities Grid */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Verified Station Amenities & Facilities:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
            {facilitiesList.map((f) => (
              <div
                key={f.key}
                className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  f.available
                    ? 'border-slate-800 bg-slate-950 text-slate-200'
                    : 'border-slate-900 bg-slate-950/40 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{f.icon}</span>
                  <span className="font-semibold">{f.label}</span>
                </div>
                <span className={`text-[11px] font-bold ${f.available ? 'text-emerald-400' : 'text-slate-600'}`}>
                  {f.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
