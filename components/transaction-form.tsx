'use client';

import { useState } from 'react';
import type { Category, Transaction } from '@/lib/types';
import { todayISO, uid } from '@/lib/types';

type Props = {
  categories: Category[];
  onSubmit: (data: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
};

export function TransactionForm({ categories, onSubmit }: Props) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const incomeCategories = categories.filter((c) => c.id.startsWith('income-'));
  const expenseCategories = categories.filter((c) => !c.id.startsWith('income-'));
  const available = type === 'income' ? incomeCategories : expenseCategories;

  // Si el usuario cambia de tipo y la categoría seleccionada no aplica, limpiar
  const currentCategory = available.find((c) => c.id === categoryId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0) return;
    if (!currentCategory) return;
    setSaving(true);
    await onSubmit({
      type,
      amount: Math.round(num * 100) / 100,
      categoryId: currentCategory.id,
      date,
      note: note.trim() || undefined,
    });
    setAmount('');
    setNote('');
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-bold">Registrar movimiento</h2>

      {/* Tipo */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => { setType('expense'); setCategoryId(''); }}
          className={`py-3 rounded-xl font-semibold transition-colors ${
            type === 'expense' ? 'bg-[#EF4444] text-white' : 'bg-surface text-muted'
          }`}
        >
          💸 Gasto
        </button>
        <button
          type="button"
          onClick={() => { setType('income'); setCategoryId(''); }}
          className={`py-3 rounded-xl font-semibold transition-colors ${
            type === 'income' ? 'bg-[#22C55E] text-white' : 'bg-surface text-muted'
          }`}
        >
          💵 Ingreso
        </button>
      </div>

      {/* Monto */}
      <div>
        <label className="block text-sm text-muted mb-1.5">Monto (USD)</label>
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-surface border border-theme rounded-xl px-4 py-3 text-lg font-semibold text-theme focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
          required
        />
      </div>

      {/* Categoría */}
      <div>
        <label className="block text-sm text-muted mb-1.5">Categoría</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full bg-surface border border-theme rounded-xl px-4 py-3 text-theme focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
          required
        >
          <option value="">Selecciona...</option>
          {available.map((c) => (
            <option key={c.id} value={c.id} className="bg-surface">
              {c.icon} {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Fecha */}
      <div>
        <label className="block text-sm text-muted mb-1.5">Fecha</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-surface border border-theme rounded-xl px-4 py-3 text-theme focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
        />
      </div>

      {/* Nota */}
      <div>
        <label className="block text-sm text-muted mb-1.5">Nota (opcional)</label>
        <input
          type="text"
          placeholder="Ej. Supermercado semanal"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full bg-surface border border-theme rounded-xl px-4 py-3 text-theme focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full py-4 rounded-xl bg-[#22C55E] text-white font-bold text-lg hover:bg-[#16A34A] transition-colors disabled:opacity-50"
      >
        {saving ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}
