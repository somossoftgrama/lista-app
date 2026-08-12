import Dexie, { type Table } from 'dexie';
import type { List, Item } from './types';

class ListaDB extends Dexie {
  lists!: Table<List, string>;
  items!: Table<Item, string>;

  constructor() {
    super('lista-app');
    this.version(1).stores({
      lists: 'id, createdAt',
      items: 'id, listId, done',
    });
  }
}

export const db = new ListaDB();
