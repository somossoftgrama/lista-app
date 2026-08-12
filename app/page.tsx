'use client';

import { useEffect, useState } from 'react';
import { repo } from '@/lib/repository';
import type { List, Item } from '@/lib/types';
import { ListManager } from '@/components/list-manager';
import { ItemForm } from '@/components/item-form';
import { ItemList } from '@/components/item-list';
import { ProgressBar } from '@/components/progress-bar';

export default function Home() {
  const [lists, setLists] = useState<List[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [ready, setReady] = useState(false);

  async function loadLists() {
    const ls = await repo.listLists();
    setLists(ls);
    return ls;
  }

  async function openList(id: string) {
    setActiveId(id);
    const it = await repo.listItems(id);
    setItems(it);
  }

  async function load() {
    const ls = await loadLists();
    setReady(true);
    if (ls.length > 0 && !activeId) {
      await openList(ls[0].id);
    } else if (activeId) {
      await openList(activeId);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreateList(l: List) {
    await repo.saveList(l);
    await loadLists();
    await openList(l.id);
  }

  async function handleDeleteList(id: string) {
    await repo.deleteList(id);
    setActiveId(null);
    const ls = await loadLists();
    if (ls.length > 0) await openList(ls[0].id);
    else setItems([]);
  }

  async function handleAddItem(item: Item) {
    await repo.saveItem(item);
    await openList(item.listId);
  }

  async function handleToggle(id: string, done: boolean) {
    await repo.toggleItem(id, done);
    if (activeId) await openList(activeId);
  }

  async function handleEdit(id: string, text: string) {
    await repo.saveItem({ ...items.find((i) => i.id === id)!, text });
    if (activeId) await openList(activeId);
  }

  async function handleDeleteItem(id: string) {
    await repo.deleteItem(id);
    if (activeId) await openList(activeId);
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app text-theme">
        <p className="text-lg text-muted">Cargando...</p>
      </div>
    );
  }

  const activeList = lists.find((l) => l.id === activeId) || null;
  const doneCount = items.filter((i) => i.done).length;

  return (
    <div className="min-h-screen bg-app text-theme pb-10">
      <header className="sticky top-0 z-10 backdrop-blur bg-app border-b border-theme px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">🗒️ Listas</h1>
          {activeList && (
            <button
              onClick={() => setActiveId(null)}
              className="text-sm text-muted hover:text-theme"
            >
              ← Todas
            </button>
          )}
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-6">
        {!activeList ? (
          <ListManager
            lists={lists}
            onSelect={openList}
            onCreate={handleCreateList}
            onDelete={handleDeleteList}
          />
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ backgroundColor: `${activeList.color}22` }}
              >
                {activeList.icon}
              </span>
              <h2 className="text-lg font-bold text-theme">{activeList.name}</h2>
            </div>

            <ProgressBar total={items.length} done={doneCount} />

            <ItemForm listId={activeList.id} onAdd={handleAddItem} />

            <ItemList
              items={items}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDeleteItem}
            />
          </div>
        )}
      </main>
    </div>
  );
}
