import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
}

const STORAGE_KEY = 'generated_todo_items';

function loadFromStorage(): TodoItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TodoItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(item => ({
      id: String(item.id),
      text: String(item.text ?? ''),
      done: Boolean(item.done),
      createdAt: Number(item.createdAt ?? Date.now())
    }));
  } catch {
    return [];
  }
}

function saveToStorage(items: TodoItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const useTodoStore = defineStore('todo', () => {
  const items = ref<TodoItem[]>(loadFromStorage());

  const pendingCount = computed(() => items.value.filter(i => !i.done).length);
  const doneCount = computed(() => items.value.filter(i => i.done).length);

  function addTask(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newItem: TodoItem = {
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      text: trimmed,
      done: false,
      createdAt: Date.now()
    };
    items.value.unshift(newItem);
    saveToStorage(items.value);
  }

  function toggleTask(id: string) {
    const item = items.value.find(i => i.id === id);
    if (!item) return;
    item.done = !item.done;
    saveToStorage(items.value);
  }

  function updateTask(id: string, newText: string) {
    const trimmed = newText.trim();
    if (!trimmed) return;
    const item = items.value.find(i => i.id === id);
    if (!item) return;
    item.text = trimmed;
    saveToStorage(items.value);
  }

  function removeTask(id: string) {
    items.value = items.value.filter(i => i.id !== id);
    saveToStorage(items.value);
  }

  function clearAll() {
    items.value = [];
    saveToStorage(items.value);
  }

  return {
    items,
    pendingCount,
    doneCount,
    addTask,
    toggleTask,
    updateTask,
    removeTask,
    clearAll
  };
});
