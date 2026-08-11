'use client';

import { useState } from 'react';
import type { Category, Transaction } from '@/lib/types';

type Props = {
  transactions: Transaction[];
  categories: Category[];
};

export function BudgetProgress({ transactions, categories }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const expenseByCat = new Map<string, number>();
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => expenseByCat.set(t.categoryId, (expenseByCat.get(t.categoryId) ?? 0) + t.amount));

  const budgetCats = categories.filter((c) => !c.id.startsWith('income-'));
  const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  function saveBudget(c: Category) {
    const num = parseFloat(editValue);
    c.monthlyBudget = !isNaN(num) && num > 0 ? num : undefined;
    // Disparar persistencia via custom event (el page escucha)
    window.dispatchEvent(new CustomEvent('budget-save', { detail: c }));
    setEditingId(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Presupuesto del mes</h2>
        <span className="text-xs text-white/40">Toca una categoría para fijar presupuesto</span>
      </div>

      {budgetCats.length === 0 ? (
        <p className="text-white/40 text-sm">Crea categorías para ver el presupuesto.</p>
      ) : (
        <div className="space-y-3">
          {budgetCats.map((c) => {
            const spent = expenseByCat.get(c.id) ?? 0;
            const budget = c.monthlyBudget;

            if (budget === undefined && editingId !== c.id) {
              return (
                <button
                  key={c.id}
                  onClick={() => { setEditingId(c.id); setEditValue(''); }}
                  className="w-full flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 text-left hover:bg-white/10 transition-colors"
                >
                  <span className="text-xl">{c.icon}</span>
                  <span className="flex-1 text-sm">{c.name}</span>
                  <span className="text-xs text-white/40">+ fijar presupuesto</span>
                </button>
              );
            }

            if (editingId === c.id) {
              return (
                <div key={c.id} className="bg-white/5 rounded-xl px-4 py-3 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{c.icon}</span>
                    <span className="flex-1 text-sm">{c.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0"
                      placeholder="Presupuesto mensual (USD)"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                      autoFocus
                    />
                    <button
                      onClick={() => saveBudget(c)}
                      className="px-4 py-2 rounded-lg bg-[#22C55E] text-white text-sm font-semibold hover:bg-[#16A34A]"
                    >
                      OK
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-2 rounded-lg bg-white/10 text-white/70 text-sm hover:bg-white/20"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            }

            const budgetVal = c.monthlyBudget ?? 0;
            const pct = budgetVal > 0 ? Math.min((spent / budgetVal) * 100, 100) : 0;
            const over = spent > budgetVal;
            return (
              <button
                key={c.id}
                onClick={() => { setEditingId(c.id); setEditValue(String(budgetVal ?? '')); }}
                className="w-full bg-white/5 rounded-xl px-4 py-3 text-left hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm flex items-center gap-2">
                    <span className="text-lg">{c.icon}</span>
                    {c.name}
                  </span>
                  <span className={`text-xs font-medium ${over ? 'text-[#EF4444]' : 'text-white/50'}`}>
                    {fmt.format(spent)} / {fmt.format(budgetVal)}
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${over ? 'bg-[#EF4444]' : 'bg-[#22C55E]'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {over && <p className="text-[10px] text-[#EF4444] mt-1">Sobre presupuesto</p>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
