'use client';

import { useState } from 'react';
import type { Item } from '@/lib/types';

type Props = {
  items: Item[];
  onToggle: (id: string, done: boolean) => Promise<void>;
  onEdit: (id: string, text: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function ItemList({ items, onToggle, onEdit, onDelete }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  if (items.length === 0) {
    return (
      <div className="text-center text-muted py-12">
        <p className="text-4xl mb-2">🗒️</p>
        <p className="text-sm">Esta lista está vacía. Añade tu primer ítem arriba.</p>
      </div>
    );
  }

  function startEdit(item: Item) {
    setEditingId(item.id);
    setDraft(item.text);
  }

  async function commitEdit(id: string) {
    const t = draft.trim();
    if (t) await onEdit(id, t);
    setEditingId(null);
    setDraft('');
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="group flex items-center gap-3 bg-surface border border-theme rounded-xl px-3 py-2.5"
        >
          {/* Checkbox */}
          <button
            onClick={() => onToggle(item.id, !item.done)}
            className={`shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
              item.done
                ? 'bg-[#22C55E] border-[#22C55E] text-white'
                : 'border-[#9CA3AF] hover:border-[#22C55E]'
            }`}
            aria-label={item.done ? 'Marcar como pendiente' : 'Marcar como hecho'}
          >
            {item.done ? '✓' : ''}
          </button>

          {/* Texto / edición */}
          <div className="flex-1 min-w-0">
            {editingId === item.id ? (
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={() => commitEdit(item.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitEdit(item.id);
                  if (e.key === 'Escape') { setEditingId(null); setDraft(''); }
                }}
                className="w-full bg-transparent border-b border-theme text-theme focus:outline-none"
              />
            ) : (
              <div
                className={`truncate cursor-pointer ${item.done ? 'line-through text-faint' : 'text-theme'}`}
                onDoubleClick={() => startEdit(item)}
                title={item.note || item.text}
              >
                {item.text}
                {item.note && (
                  <span className="ml-2 text-xs text-muted">· {item.note}</span>
                )}
              </div>
            )}
          </div>

          {/* Acciones */}
          {editingId !== item.id && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => startEdit(item)}
                className="text-xs text-muted hover:text-theme px-2 py-1 rounded"
                aria-label="Editar"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="text-xs text-muted hover:text-[#EF4444] px-2 py-1 rounded"
                aria-label="Borrar"
              >
                🗑️
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
