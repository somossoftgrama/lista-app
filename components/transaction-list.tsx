'use client';

import type { Category, Transaction } from '@/lib/types';

type Props = {
  transactions: Transaction[];
  categories: Category[];
  onDelete: (id: string) => Promise<void>;
};

export function TransactionList({ transactions, categories, onDelete }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 text-muted">
        <p className="text-4xl mb-2">🗒️</p>
        <p>No hay movimientos este mes</p>
        <p className="text-sm mt-1">Registra tu primer gasto o ingreso</p>
      </div>
    );
  }

  const catById = new Map(categories.map((c) => [c.id, c]));
  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));
  const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  return (
    <ul className="space-y-2">
      {sorted.map((t) => {
        const cat = catById.get(t.categoryId);
        const isIncome = t.type === 'income';
        return (
          <li
            key={t.id}
            className="flex items-center gap-3 bg-surface rounded-xl px-4 py-3"
          >
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
              style={{ backgroundColor: (cat?.color ?? '#6B7280') + '22' }}
            >
              {cat?.icon ?? '❓'}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{cat?.name ?? 'Sin categoría'}</p>
              {t.note && <p className="text-xs text-muted truncate">{t.note}</p>}
            </div>
            <span className={`font-semibold ${isIncome ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
              {isIncome ? '+' : '−'}{fmt.format(t.amount)}
            </span>
            <button
              onClick={() => onDelete(t.id)}
              className="text-muted hover:text-[#EF4444] text-sm transition-colors shrink-0"
              aria-label="Eliminar"
            >
              ✕
            </button>
          </li>
        );
      })}
    </ul>
  );
}
