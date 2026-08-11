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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🏷️');
  const [color, setColor] = useState(PALETTE[0]);
  const [budget, setBudget] = useState('');
  const [saving, setSaving] = useState(false);

  function startCreate() {
    setEditingId(null);
    setName('');
    setIcon('🏷️');
    setColor(PALETTE[0]);
    setBudget('');
  }

  function startEdit(c: Category) {
    setEditingId(c.id);
    setName(c.name);
    setIcon(c.icon);
    setColor(c.color);
    setBudget(c.monthlyBudget ? String(c.monthlyBudget) : '');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    const isEdit = editingId !== null;
    const cat: Category = {
      id: editingId ?? `custom-${uid()}`,
      name: name.trim(),
      icon,
      color,
      isCustom: isEdit ? !categories.find((c) => c.id === editingId)?.id.startsWith('income-') && editingId.startsWith('custom-') : true,
      monthlyBudget: budget ? parseFloat(budget) : undefined,
    };
    await onSave(cat);
    startCreate();
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Categorías</h2>
        {editingId && (
          <button onClick={startCreate} className="text-sm text-muted hover:text-theme transition-colors">
            + Nueva
          </button>
        )}
      </div>

      {/* Crear / Editar */}
      <form onSubmit={handleSubmit} className="bg-surface rounded-2xl p-4 space-y-3 border border-theme">
        <p className="text-sm font-semibold text-muted">
          {editingId ? 'Editar categoría' : 'Nueva categoría'}
        </p>
        <input
          type="text"
          placeholder="Nombre (ej. Gym)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-surface border border-theme rounded-xl px-4 py-3 text-theme focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
          required
        />
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Emoji"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="w-20 bg-surface border border-theme rounded-xl px-3 py-2 text-center text-theme focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
          />
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="Presupuesto mensual (opcional)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="flex-1 bg-surface border border-theme rounded-xl px-3 py-2 text-theme focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {PALETTE.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setColor(p)}
              className={`w-8 h-8 rounded-full transition-transform ${color === p ? 'ring-2 ring-theme scale-110' : ''}`}
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
          {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear categoría'}
        </button>
      </form>

      {/* Lista */}
      <ul className="space-y-2">
        {categories.map((c) => (
          <li key={c.id} className="flex items-center gap-3 bg-surface rounded-xl px-4 py-3 border border-theme">
            <button
              onClick={() => startEdit(c)}
              className="flex items-center gap-3 flex-1 min-w-0 text-left hover:opacity-80 transition-opacity"
            >
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                style={{ backgroundColor: c.color + '22' }}
              >
                {c.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{c.name}</p>
                <p className="text-xs text-muted">
                  {c.monthlyBudget ? `Presupuesto: $${c.monthlyBudget}` : 'Sin presupuesto'}
                  {c.isCustom ? ' · Personalizada' : ''}
                </p>
              </div>
            </button>
            {c.isCustom && (
              <button
                onClick={() => onDelete(c.id)}
                className="text-muted hover:text-[#EF4444] text-sm transition-colors shrink-0"
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
