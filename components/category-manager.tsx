'use client';

import { useState } from 'react';
import type { Category } from '@/lib/types';
import { uid } from '@/lib/types';

type Props = {
  categories: Category[];
  onSave: (c: Category) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

const PALETTE = ['#F97316', '#0E75D4', '#22C55E', '#EAB308', '#EF4444', '#A855F7', '#10B981', '#6B7280'];

export function CategoryManager({ categories, onSave, onDelete }: Props) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🏷️');
  const [color, setColor] = useState(PALETTE[0]);
  const [budget, setBudget] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    const cat: Category = {
      id: `custom-${uid()}`,
      name: name.trim(),
      icon,
      color,
      isCustom: true,
      monthlyBudget: budget ? parseFloat(budget) : undefined,
    };
    await onSave(cat);
    setName('');
    setIcon('🏷️');
    setBudget('');
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Categorías</h2>

      {/* Crear nueva */}
      <form onSubmit={handleCreate} className="bg-white/5 rounded-2xl p-4 space-y-3">
        <p className="text-sm font-semibold text-white/70">Nueva categoría</p>
        <input
          type="text"
          placeholder="Nombre (ej. Gym)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
          required
        />
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Emoji"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
          />
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="Presupuesto mensual (opcional)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {PALETTE.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setColor(p)}
              className={`w-8 h-8 rounded-full transition-transform ${color === p ? 'ring-2 ring-white scale-110' : ''}`}
              style={{ backgroundColor: p }}
              aria-label={`Color ${p}`}
            />
          ))}
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-xl bg-[#22C55E] text-white font-semibold hover:bg-[#16A34A] transition-colors disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Crear categoría'}
        </button>
      </form>

      {/* Lista */}
      <ul className="space-y-2">
        {categories.map((c) => (
          <li key={c.id} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
              style={{ backgroundColor: c.color + '22' }}
            >
              {c.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{c.name}</p>
              <p className="text-xs text-white/40">
                {c.monthlyBudget ? `Presupuesto: $${c.monthlyBudget}` : 'Sin presupuesto'}
                {c.isCustom ? ' · Personalizada' : ''}
              </p>
            </div>
            {c.isCustom && (
              <button
                onClick={() => onDelete(c.id)}
                className="text-white/30 hover:text-[#EF4444] text-sm transition-colors shrink-0"
                aria-label="Eliminar"
              >
                🗑️
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
