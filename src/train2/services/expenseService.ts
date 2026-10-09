import { TravelExpense } from '../types/railway';

const EXPENSES_STORAGE_KEY = 'tg_travel_expenses_v1';

export const INITIAL_EXPENSES: TravelExpense[] = [
  { id: 'exp_1', description: 'Train Ticket (Vande Bharat CC)', category: 'Ticket', amount: 1750, date: '2026-09-24', trainNumber: '22436' },
  { id: 'exp_2', description: 'Pantry Breakfast & Chai', category: 'Food', amount: 190, date: '2026-09-24', trainNumber: '22436' },
  { id: 'exp_3', description: 'Station Auto to Hotel', category: 'Auto', amount: 120, date: '2026-09-24' },
  { id: 'exp_4', description: 'Kanpur Thaggu Ke Laddu', category: 'Shopping', amount: 450, date: '2026-09-24' },
];

export function getTravelExpenses(): TravelExpense[] {
  const saved = localStorage.getItem(EXPENSES_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_EXPENSES;
    }
  }
  localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(INITIAL_EXPENSES));
  return INITIAL_EXPENSES;
}

export function saveTravelExpense(expense: Omit<TravelExpense, 'id'>): TravelExpense[] {
  const current = getTravelExpenses();
  const newExp: TravelExpense = {
    ...expense,
    id: `exp_${Date.now()}`,
  };
  const updated = [newExp, ...current];
  localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteTravelExpense(id: string): TravelExpense[] {
  const current = getTravelExpenses();
  const updated = current.filter((e) => e.id !== id);
  localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function calculateExpenseSummary(expenses: TravelExpense[]) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const byCategory: Record<string, number> = {
    Ticket: 0,
    Food: 0,
    Cab: 0,
    Auto: 0,
    Hotel: 0,
    Shopping: 0,
    Other: 0,
  };

  expenses.forEach((e) => {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
  });

  const transportTotal = byCategory.Cab + byCategory.Auto;

  return {
    total,
    food: byCategory.Food,
    transport: transportTotal,
    hotel: byCategory.Hotel,
    ticket: byCategory.Ticket,
    shopping: byCategory.Shopping,
    other: byCategory.Other,
    breakdown: byCategory,
  };
}
