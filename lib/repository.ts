import { db } from './db';
import type { List, Item } from './types';

// ─── Interfaz agnóstica ────────────────────────────────────────────────
// La UI usa SOLO esta interfaz. Hoy la implementación es local (IndexedDB).
// Si mañana hay backend, se crea ApiRepository con la misma interfaz y se
// intercambia aquí — la UI no cambia.
export interface ListaRepository {
  listLists(): Promise<List[]>;
  saveList(l: List): Promise<void>;
  deleteList(id: string): Promise<void>;

  listItems(listId: string): Promise<Item[]>;
  saveItem(item: Item): Promise<void>;
  toggleItem(id: string, done: boolean): Promise<void>;
  deleteItem(id: string): Promise<void>;
}

// ─── Implementación local (IndexedDB) ──────────────────────────────────
export class LocalRepository implements ListaRepository {
  async listLists(): Promise<List[]> {
    const all = await db.lists.toArray();
    return all.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async saveList(l: List): Promise<void> {
    await db.lists.put(l);
  }

  async deleteList(id: string): Promise<void> {
    await db.lists.delete(id);
    // Borrar también los ítems de esa lista (evita datos huérfanos)
    await db.items.where('listId').equals(id).delete();
  }

  async listItems(listId: string): Promise<Item[]> {
    const all = await db.items.where('listId').equals(listId).toArray();
    return all.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async saveItem(item: Item): Promise<void> {
    await db.items.put(item);
  }

  async toggleItem(id: string, done: boolean): Promise<void> {
    await db.items.update(id, { done });
  }

  async deleteItem(id: string): Promise<void> {
    await db.items.delete(id);
  }
}

export const repo: ListaRepository = new LocalRepository();
