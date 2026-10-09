import React, { useState } from 'react';
import { 
  Car, 
  Hotel, 
  Utensils, 
  HeartPulse, 
  Film, 
  ShoppingBag, 
  ExternalLink, 
  MapPin, 
  Sparkles, 
  Navigation,
  Compass,
  Train
} from 'lucide-react';
import { TrainDetails, RouteStop } from '../types/railway';

interface NearbyServicesProps {
  currentTrain: TrainDetails;
  currentStation: RouteStop;
}

export const NearbyServices: React.FC<NearbyServicesProps> = ({
  currentTrain,
  currentStation,
}) => {
  const [selectedStationCode, setSelectedStationCode] = useState(currentStation.stationCode);

  const activeStation =
    currentTrain.routeStops.find((s) => s.stationCode === selectedStationCode) || currentStation;

  const stationEncoded = encodeURIComponent(`${activeStation.stationName} Railway Station ${activeStation.city}`);

  // Cabs & Auto providers with official deep links
  const cabServices = [
    {
      name: 'Ola Cabs',
      type: 'Auto & Cabs',
      color: 'from-lime-500 to-emerald-600',
      tag: 'Cabs & Auto',
      url: 'https://www.olacabs.com',
      desc: 'Book Prime Sedan, Mini, or Auto from railway station exit',
    },
    {
      name: 'Uber India',
      type: 'Premier & Auto',
      color: 'from-slate-700 to-slate-900',
      tag: 'Fast Pickup',
      url: 'https://m.uber.com',
      desc: 'Seamless station pickup points with digital PIN verification',
    },
    {
      name: 'Rapido',
      type: 'Bike Taxi & Auto',
      color: 'from-amber-500 to-yellow-600',
      tag: 'Quickest & Affordable',
      url: 'https://www.rapido.bike',
      desc: 'Fastest single passenger bike taxis and metered autos',
    },
    {
      name: 'Namma Yatri',
      type: 'Direct Auto & Cab',
      color: 'from-yellow-400 to-amber-500',
      tag: 'Zero Commission',
      url: 'https://nammayatri.in',
      desc: 'Direct auto-rickshaws with driver-direct payments',
    },
  ];

  // Hotels with real official portals
  const hotelServices = [
    {
      name: 'IRCTC Retiring Rooms',
      type: 'Inside Station',
      url: 'https://www.rr.irctc.co.in/',
      desc: 'Official AC dorms and deluxe rooms inside station premises',
      badge: 'Official IRCTC',
    },
    {
      name: 'MakeMyTrip Hotels',
      type: 'Verified Stays',
      url: `https://www.makemytrip.com/hotels/${encodeURIComponent(activeStation.city.toLowerCase())}-hotels.html`,
      desc: `Best rated budget & luxury hotels near ${activeStation.stationName}`,
      badge: 'Top Deals',
    },
    {
      name: 'Booking.com Stays',
      type: 'Instant Booking',
      url: `https://www.booking.com/searchresults.html?ss=${stationEncoded}`,
      desc: 'Free cancellation hotels within 1-2 km radius of platform',
      badge: 'Global Trust',
    },
    {
      name: 'OYO Rooms',
      type: 'Budget Stays',
      url: `https://www.oyorooms.com/search?location=${encodeURIComponent(activeStation.city)}`,
      desc: 'Economical overnight rooms with 24/7 check-in',
      badge: 'Budget Friendly',
    },
  ];

  // Restaurants & Food with official links
  const foodServices = [
    {
      name: 'IRCTC e-Catering',
      type: 'Deliver to Seat',
      url: 'https://www.ecatering.irctc.co.in/',
      desc: `Order hot meals delivered right to your train berth at ${activeStation.stationName}`,
      badge: 'Berth Delivery',
    },
    {
      name: 'Zomato Near Station',
      type: 'Dine-in & Delivery',
      url: `https://www.zomato.com/${encodeURIComponent(activeStation.city.toLowerCase())}/restaurants`,
      desc: 'Top customer-reviewed eateries, biryanis & local thalis near station',
      badge: 'Popular',
    },
    {
      name: 'Swiggy Food',
      type: 'Fast Food',
      url: `https://www.swiggy.com/city/${encodeURIComponent(activeStation.city.toLowerCase())}`,
      desc: 'Quick snacks, Domino’s, Haldiram and local chai stalls',
      badge: 'Fast Delivery',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header and Station Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl neon-glow-cyan">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold mb-1">
            <Compass className="h-4 w-4 animate-spin text-cyan-400" />
            <span className="neon-text-cyan">Official Real-Time Station Portal Services</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Nearby Services & Local Transit
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tap any service to open its official verified application or booking portal
          </p>
        </div>

        {/* Station switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 whitespace-nowrap">Location:</label>
          <select
            value={selectedStationCode}
            onChange={(e) => setSelectedStationCode(e.target.value)}
            className="rounded-xl border border-cyan-500/40 bg-slate-950 px-3 py-2 text-xs font-semibold text-white focus:border-cyan-400 focus:outline-none"
          >
            {currentTrain.routeStops.map((s) => (
              <option key={s.stationCode} value={s.stationCode}>
                {s.stationName} ({s.stationCode}) · {s.city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category 1: Cabs & Auto (Ola, Uber, Rapido, Namma Yatri) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-lime-500/10 text-lime-400">
              <Car className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Cabs & Auto Transit (Official Bookings)
            </h3>
          </div>
          <span className="text-xs text-slate-500">Pick up from station exit</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {cabServices.map((cab, idx) => (
            <a
              key={idx}
              href={cab.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/90 hover:border-lime-500/50 hover:bg-slate-900 transition-all shadow hover:shadow-lime-500/20 group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-400">{cab.type}</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-lime-400 transition-colors" />
                </div>
                <div className="text-base font-bold text-white group-hover:text-lime-300 transition-colors">
                  {cab.name}
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {cab.desc}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded bg-lime-500/10 text-lime-400 font-semibold">
                  {cab.tag}
                </span>
                <span className="text-xs text-lime-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Book Now →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Category 2: Hotels & Retiring Rooms */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Hotel className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Hotels & IRCTC Retiring Rooms
            </h3>
          </div>
          <span className="text-xs text-slate-500">Near {activeStation.stationName}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {hotelServices.map((hotel, idx) => (
            <a
              key={idx}
              href={hotel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/90 hover:border-indigo-500/50 hover:bg-slate-900 transition-all shadow hover:shadow-indigo-500/20 group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-400">{hotel.type}</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                </div>
                <div className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {hotel.name}
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {hotel.desc}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-semibold">
                  {hotel.badge}
                </span>
                <span className="text-xs text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  View Stays →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Category 3: Restaurants & Food */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Utensils className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Food & e-Catering Delivery
            </h3>
          </div>
          <span className="text-xs text-slate-500">Direct berth delivery or station dining</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {foodServices.map((food, idx) => (
            <a
              key={idx}
              href={food.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/90 hover:border-amber-500/50 hover:bg-slate-900 transition-all shadow hover:shadow-amber-500/20 group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-400">{food.type}</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                </div>
                <div className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  {food.name}
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {food.desc}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold">
                  {food.badge}
                </span>
                <span className="text-xs text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Order Online →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Category 4: Hospitals, Theatres & Markets (One-Click Google Maps & BookMyShow) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Hospitals */}
        <a
          href={`https://www.google.com/maps/search/emergency+hospitals+near+${stationEncoded}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-5 rounded-2xl border border-slate-800 bg-slate-900 hover:border-red-500/60 transition-all shadow-md group neon-glow-red"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <HeartPulse className="h-5 w-5" />
            </div>
            <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-red-400" />
          </div>
          <h4 className="text-base font-bold text-white mt-3 group-hover:text-red-300">
            Emergency Hospitals Near Station
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            24/7 trauma care, Apollo, Fortis & Railway division hospitals near {activeStation.stationName}
          </p>
          <div className="mt-4 text-xs font-semibold text-red-400 flex items-center gap-1">
            <span>Find Hospitals on Google Maps →</span>
          </div>
        </a>

        {/* Theatres */}
        <a
          href={`https://in.bookmyshow.com/explore/cinemas-${encodeURIComponent(activeStation.city.toLowerCase())}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-5 rounded-2xl border border-slate-800 bg-slate-900 hover:border-purple-500/60 transition-all shadow-md group"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Film className="h-5 w-5" />
            </div>
            <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-purple-400" />
          </div>
          <h4 className="text-base font-bold text-white mt-3 group-hover:text-purple-300">
            Cinemas & Theatres (BookMyShow)
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            PVR, INOX & Cinepolis multiplexes showing latest movies in {activeStation.city}
          </p>
          <div className="mt-4 text-xs font-semibold text-purple-400 flex items-center gap-1">
            <span>Book Movie Tickets →</span>
          </div>
        </a>

        {/* Local Shops & Bazaars */}
        <a
          href={`https://www.google.com/maps/search/famous+shopping+markets+near+${stationEncoded}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-5 rounded-2xl border border-slate-800 bg-slate-900 hover:border-cyan-500/60 transition-all shadow-md group"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-cyan-400" />
          </div>
          <h4 className="text-base font-bold text-white mt-3 group-hover:text-cyan-300">
            Station Bazaars & Shopping
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Famous markets, silk sarees, local spices & handicraft stores in {activeStation.city}
          </p>
          <div className="mt-4 text-xs font-semibold text-cyan-400 flex items-center gap-1">
            <span>Explore Local Markets →</span>
          </div>
        </a>
      </div>
    </div>
  );
};
