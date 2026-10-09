import React, { useState } from 'react';
import { 
  Utensils, 
  ExternalLink, 
  X, 
  Check, 
  Coffee, 
  ShoppingBag, 
  Train 
} from 'lucide-react';
import { TrainDetails, RouteStop, UserProfile } from '../types/railway';

interface FoodOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrain: TrainDetails;
  currentStation: RouteStop;
  userProfile: UserProfile;
}

export const FoodOrderModal: React.FC<FoodOrderModalProps> = ({
  isOpen,
  onClose,
  currentTrain,
  currentStation,
  userProfile,
}) => {
  const [selectedMeal, setSelectedMeal] = useState('Standard Veg Thali');
  const [ordered, setOrdered] = useState(false);
  const [coachBerth, setCoachBerth] = useState('C3 / 42');

  if (!isOpen) return null;

  const pantryMeals = [
    { name: 'Standard Indian Veg Thali', price: 120, desc: 'Dal tadka, paneer sabzi, 3 rotis, jeera rice, curd & pickle' },
    { name: 'Hyderabadi Dum Veg Biryani', price: 140, desc: 'Fragrant basmati rice with spiced vegetables, mirchi ka salan & raita' },
    { name: 'Egg Curry with Parottas', price: 150, desc: '2 boiled eggs in spiced onion gravy with 2 flaky Malabar parottas' },
    { name: 'South Indian Breakfast Combo', price: 90, desc: '2 hot idlis, 1 medu vada, sambar and fresh coconut chutney' },
    { name: 'Kulhad Masala Chai & Samosa (2 pcs)', price: 50, desc: 'Cardamom ginger tea with crispy potato pea samosas' },
    { name: 'Rail Neer Packaged Drinking Water (1L)', price: 15, desc: 'Official purified mineral water bottle chilled' },
  ];

  const handleOrderPantry = (e: React.FormEvent) => {
    e.preventDefault();
    setOrdered(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-amber-500/50 bg-slate-900 p-6 shadow-2xl neon-glow-amber my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Utensils className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Train Food Order & e-Catering
              </h3>
              <p className="text-xs text-slate-400">Delivered directly to your train seat</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Official e-Catering Portals */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="https://www.ecatering.irctc.co.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl border border-amber-500/30 bg-slate-950 hover:bg-slate-800 transition-colors group"
          >
            <div>
              <div className="text-xs font-bold text-white group-hover:text-amber-400">
                IRCTC Official eCatering
              </div>
              <div className="text-[11px] text-slate-400">Haldiram, Domino&apos;s, Saravana</div>
            </div>
            <ExternalLink className="h-4 w-4 text-amber-400" />
          </a>

          <a
            href="https://www.railrestro.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800 transition-colors group"
          >
            <div>
              <div className="text-xs font-bold text-white group-hover:text-amber-400">
                RailRestro Restaurant
              </div>
              <div className="text-[11px] text-slate-400">Station Platform Delivery</div>
            </div>
            <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-amber-400" />
          </a>
        </div>

        {/* Pantry Car Quick Order */}
        {ordered ? (
          <div className="my-6 p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <Check className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-white">Meal Order Placed to Pantry Car</h4>
            <p className="text-xs text-slate-300">
              <strong>{selectedMeal}</strong> will be delivered to your berth ({coachBerth}) before {currentStation.stationName}.
            </p>
            <div className="text-[11px] text-slate-400">
              Payment mode: Cash on delivery (COD) or UPI to pantry attendant.
            </div>
            <button
              onClick={() => setOrdered(false)}
              className="mt-2 text-xs text-amber-400 underline font-semibold"
            >
              Order another meal
            </button>
          </div>
        ) : (
          <form onSubmit={handleOrderPantry} className="mt-4 space-y-3">
            <div className="text-xs font-semibold text-slate-300">
              Instant Onboard Pantry Menu ({currentTrain.trainName}):
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {pantryMeals.map((meal, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedMeal(meal.name)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    selectedMeal === meal.name
                      ? 'border-amber-400 bg-amber-500/10 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold">{meal.name}</span>
                    <span className="font-mono font-bold text-amber-400">₹{meal.price}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{meal.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Deliver to Coach & Berth:
              </label>
              <input
                type="text"
                value={coachBerth}
                onChange={(e) => setCoachBerth(e.target.value)}
                placeholder="e.g. C3 / 42"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none font-mono"
                required
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors shadow"
              >
                Confirm Pantry Order (Pay on Seat)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
