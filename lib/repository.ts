import { db } from './db';
import type { Category, Transaction, MonthKey } from './types';

// ─── Interfaz agnóstica ────────────────────────────────────────────────
// La UI usa SOLO esta interfaz. Hoy la implementación es local (IndexedDB).
// Si mañana hay backend, se crea ApiRepository con la misma interfaz y se
// intercambia aquí — la UI no cambia.
export interface BudgetRepository {
  listCategories(): Promise<Category[]>;
  saveCategory(c: Category): Promise<void>;
  deleteCategory(id: string): Promise<void>;
  listTransactions(month: MonthKey): Promise<Transaction[]>;
  saveTransaction(t: Transaction): Promise<void>;
  deleteTransaction(id: string): Promise<void>;
}

// ─── Categorías por defecto ────────────────────────────────────────────
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'food', name: 'Comida', icon: '🍽️', color: '#F97316', isCustom: false },
  { id: 'rent', name: 'Arriendo / Hipoteca', icon: '🏠', color: '#0E75D4', isCustom: false },
  { id: 'transport', name: 'Transporte', icon: '🚌', color: '#22C55E', isCustom: false },
  { id: 'utilities', name: 'Servicios (luz, agua, internet)', icon: '💡', color: '#EAB308', isCustom: false },
  { id: 'health', name: 'Salud', icon: '🏥', color: '#EF4444', isCustom: false },
  { id: 'fun', name: 'Entretenimiento', icon: '🎬', color: '#A855F7', isCustom: false },
  { id: 'savings', name: 'Ahorro', icon: '💰', color: '#10B981', isCustom: false },
  { id: 'other', name: 'Otros', icon: '📦', color: '#6B7280', isCustom: false },
  { id: 'income-salary', name: 'Sueldo', icon: '👔', color: '#22C55E', isCustom: false },
  { id: 'income-extra', name: 'Ingreso extra', icon: '💵', color: '#10B981', isCustom: false },
];

// ─── Implementación local (IndexedDB) ──────────────────────────────────
export class LocalRepository implements BudgetRepository {
  async listCategories(): Promise<Category[]> {
    return db.categories.toArray();
  }

  async saveCategory(c: Category): Promise<void> {
    await db.categories.put(c);
  }

  async deleteCategory(id: string): Promise<void> {
    await db.categories.delete(id);
    // Al borrar una categoría, también se borran sus transacciones (evita datos huérfanos)
    await db.transactions.where('categoryId').equals(id).delete();
  }

  async listTransactions(month: MonthKey): Promise<Transaction[]> {
    const all = await db.transactions.toArray();
    return all.filter((t) => t.date.startsWith(month));
  }

  async saveTransaction(t: Transaction): Promise<void> {
    await db.transactions.put(t);
  }

  async deleteTransaction(id: string): Promise<void> {
    await db.transactions.delete(id);
  }

  async ensureDefaultCategories(): Promise<void> {
    const count = await db.categories.count();
    if (count === 0) {
      await db.categories.bulkPut(DEFAULT_CATEGORIES);
    }
  }
}

export const repo: BudgetRepository = new LocalRepository();
