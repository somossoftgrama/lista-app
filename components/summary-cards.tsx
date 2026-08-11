'use client';

import type { Transaction } from '@/lib/types';

type Props = {
  transactions: Transaction[];
};

export function SummaryCards({ transactions }: Props) {
  const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;
  const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-surface rounded-2xl p-4">
        <p className="text-xs text-muted mb-1">Ingresos</p>
        <p className="text-lg font-bold text-[#22C55E] truncate">{fmt.format(income)}</p>
      </div>
      <div className="bg-surface rounded-2xl p-4">
        <p className="text-xs text-muted mb-1">Gastos</p>
        <p className="text-lg font-bold text-[#EF4444] truncate">{fmt.format(expense)}</p>
      </div>
      <div className="bg-surface rounded-2xl p-4">
        <p className="text-xs text-muted mb-1">Balance</p>
        <p className={`text-lg font-bold truncate ${balance >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
          {fmt.format(balance)}
        </p>
      </div>
    </div>
  );
}
