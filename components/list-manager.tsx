'use client';

import { useState } from 'react';
import type { List } from '@/lib/types';
import { nowISO, uid } from '@/lib/types';

const PALETTE = ['#22C55E', '#0E75D4', '#F97316', '#A855F7', '#EF4444', '#EAB308', '#06B6D4', '#EC4899'];
const ICONS = ['🛒', '📝', '🏠', '✈️', '🎯', '💡', '📦', '🎁', '📚', '🍎'];

type Props = {
  lists: List[];
  onSelect: (id: string) => void;
  onCreate: (l: List) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function ListManager({ lists, onSelect, onCreate, onDelete }: Props) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(PALETTE[0]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    await onCreate({
      id: uid(),
      name: n,
      icon,
      color,
      createdAt: nowISO(),
    });
    setName('');
    setIcon(ICONS[0]);
    setColor(PALETTE[0]);
  }

  return (
    <div className="space-y-6">
      {/* Crear nueva lista */}
      <form onSubmit={handleCreate} className="bg-surface border border-theme rounded-2xl p-4 space-y-4">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Nueva lista</h2>
        <input
          type="text"
          placeholder="Nombre (ej. Compras del súper)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-surface border border-theme rounded-xl px-4 py-3 text-theme focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
          required
        />

        <div>
          <p className="text-sm text-muted mb-2">Ícono</p>
          <div className="flex flex-wrap gap-2">
            {ICONS.map((ic) => (
              <button
                key={ic}
                type="button"
                onClick={() => setIcon(ic)}
                className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center border transition-colors ${
                  icon === ic ? 'border-[#22C55E] bg-surface-hover' : 'border-theme'
                }`}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted mb-2">Color</p>
          <div className="flex flex-wrap gap-2">
            {PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${
                  color === c ? 'border-white scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-[#22C55E] text-white font-bold hover:bg-[#16A34A] transition-colors"
        >
          Crear lista
        </button>
      </form>

      {/* Mis listas */}
      <div>
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Mis listas</h2>
        {lists.length === 0 ? (
          <p className="text-sm text-muted">Aún no tienes listas. Crea la primera arriba.</p>
        ) : (
          <ul className="space-y-2">
            {lists.map((l) => (
              <li
                key={l.id}
                className="flex items-center gap-3 bg-surface border border-theme rounded-xl px-3 py-3"
              >
                <button
                  onClick={() => onSelect(l.id)}
                  className="flex-1 flex items-center gap-3 text-left min-w-0"
                >
                  <span
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                    style={{ backgroundColor: `${l.color}22` }}
                  >
                    {l.icon}
                  </span>
                  <span className="font-medium text-theme truncate">{l.name}</span>
                </button>
                <button
                  onClick={() => onDelete(l.id)}
                  className="text-muted hover:text-[#EF4444] px-2 py-1"
                  aria-label="Borrar lista"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
