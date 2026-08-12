'use client';

import { useState } from 'react';
import type { Item } from '@/lib/types';
import { nowISO, uid } from '@/lib/types';

type Props = {
  listId: string;
  onAdd: (item: Item) => Promise<void>;
};

export function ItemForm({ listId, onAdd }: Props) {
  const [text, setText] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setSaving(true);
    await onAdd({
      id: uid(),
      listId,
      text: t,
      done: false,
      note: note.trim() || undefined,
      createdAt: nowISO(),
    });
    setText('');
    setNote('');
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="text"
          placeholder="Añadir ítem (ej. Leche, Pan...)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-surface border border-theme rounded-xl px-4 py-3 text-theme focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
          required
          autoFocus
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Nota (opcional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="flex-1 bg-surface border border-theme rounded-xl px-4 py-2.5 text-sm text-theme focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
        />
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-[#22C55E] text-white font-semibold hover:bg-[#16A34A] transition-colors disabled:opacity-50"
        >
          {saving ? '...' : 'Añadir'}
        </button>
      </div>
    </form>
  );
}
