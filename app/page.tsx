'use client';

import { useEffect, useState } from 'react';
import { repo } from '@/lib/repository';
import type { Category, Transaction, MonthKey } from '@/lib/types';
import { monthKey, todayISO, uid } from '@/lib/types';
import { TransactionForm } from '@/components/transaction-form';
import { TransactionList } from '@/components/transaction-list';
import { SummaryCards } from '@/components/summary-cards';
import { BudgetProgress } from '@/components/budget-progress';
import { CategoryManager } from '@/components/category-manager';

type Tab = 'resumen' | 'registrar' | 'categorias';

export default function Home() {
  const [tab, setTab] = useState<Tab>('resumen');
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [month, setMonth] = useState<MonthKey>(monthKey(todayISO()));
  const [ready, setReady] = useState(false);

  async function load() {
    await (repo as any).ensureDefaultCategories?.();
    const cats = await repo.listCategories();
    const txs = await repo.listTransactions(month);
    setCategories(cats);
    setTransactions(txs);
    setReady(true);
  }

  useEffect(() => {
    load();
  }, [month]);

  // BudgetProgress dispara 'budget-save' al fijar presupuesto de categoría
  useEffect(() => {
    const handler = (e: Event) => {
      const cat = (e as CustomEvent<Category>).detail;
      if (cat) handleSaveCategory(cat);
    };
    window.addEventListener('budget-save', handler);
    return () => window.removeEventListener('budget-save', handler);
  }, []);

  async function handleSaveTransaction(data: Omit<Transaction, 'id' | 'createdAt'>) {
    const tx: Transaction = { ...data, id: uid(), createdAt: new Date().toISOString() };
    await repo.saveTransaction(tx);
    await load();
    setTab('resumen');
  }

  async function handleDeleteTransaction(id: string) {
    await repo.deleteTransaction(id);
    await load();
  }

  async function handleSaveCategory(c: Category) {
    await repo.saveCategory(c);
    await load();
  }

  async function handleDeleteCategory(id: string) {
    await repo.deleteCategory(id);
    await load();
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white">
        <p className="text-lg text-white/60">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
      <header className="sticky top-0 z-10 backdrop-blur bg-[#0A0A0A]/80 border-b border-white/10 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">💰 Presupuesto</h1>
          <span className="text-sm text-white/60">{month}</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-6">
        {tab === 'resumen' && (
          <>
            <SummaryCards transactions={transactions} />
            <div className="mt-8">
              <BudgetProgress transactions={transactions} categories={categories} />
            </div>
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Movimientos del mes</h2>
              <TransactionList transactions={transactions} categories={categories} onDelete={handleDeleteTransaction} />
            </div>
          </>
        )}

        {tab === 'registrar' && (
          <TransactionForm categories={categories} onSubmit={handleSaveTransaction} />
        )}

        {tab === 'categorias' && (
          <CategoryManager
            categories={categories}
            onSave={handleSaveCategory}
            onDelete={handleDeleteCategory}
          />
        )}
      </main>

      {/* Bottom nav (mobile) */}
      <nav className="fixed bottom-0 inset-x-0 z-10 bg-[#0A0A0A]/95 border-t border-white/10 backdrop-blur">
        <div className="max-w-lg mx-auto grid grid-cols-3">
          {(
            [
              ['resumen', '📊', 'Resumen'],
              ['registrar', '➕', 'Registrar'],
              ['categorias', '🏷️', 'Categorías'],
            ] as [Tab, string, string][]
          ).map(([key, icon, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`py-3 flex flex-col items-center gap-0.5 text-xs transition-colors ${
                tab === key ? 'text-[#22C55E]' : 'text-white/50'
              }`}
            >
              <span className="text-xl">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
