export type List = {
  id: string;
  name: string;
  icon: string;          // emoji
  color: string;         // hex para resaltar
  createdAt: string;     // ISO timestamp
};

export type Item = {
  id: string;
  listId: string;
  text: string;
  done: boolean;
  note?: string;
  createdAt: string;     // ISO timestamp
};

export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function nowISO(): string {
  return new Date().toISOString();
}
