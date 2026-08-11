export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  isCustom: boolean;
  monthlyBudget?: number;
};

export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  categoryId: string;
  date: string; // ISO 'YYYY-MM-DD'
  note?: string;
  createdAt: string;
};

export type MonthKey = string; // 'YYYY-MM'

export function monthKey(dateStr: string): MonthKey {
  return dateStr.slice(0, 7);
}

export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
