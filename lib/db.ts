import Dexie, { type Table } from 'dexie';
import type { Category, Transaction } from './types';

class BudgetDB extends Dexie {
  categories!: Table<Category, string>;
  transactions!: Table<Transaction, string>;

  constructor() {
    super('budget-app');
    this.version(1).stores({
      categories: 'id, name',
      transactions: 'id, type, categoryId, date',
    });
  }
}

export const db = new BudgetDB();
