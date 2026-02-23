<template>
  <div class="app-root">
    <div class="app-wrap">

      <!-- Header -->
      <header class="page-header">
        <h1>My Tasks</h1>
        <span v-if="items.length" class="counter">
          {{ pendingCount }} remaining
        </span>
      </header>

      <!-- Add input -->
      <div class="add-row">
        <el-input
          v-model="newTask"
          placeholder="What needs to be done?"
          @keyup.enter.native="handleAdd"
          size="large"
          clearable
        />
        <button class="btn-add" @click="handleAdd">+</button>
      </div>

      <!-- Empty state -->
      <p v-if="!items.length" class="empty-hint">No tasks yet — add one above.</p>

      <!-- Task list -->
      <el-scrollbar v-else class="list-scroll">
        <ul class="task-list">
          <li
            v-for="item in items"
            :key="item.id"
            class="task-row"
            :class="{ 'is-done': item.done }"
          >
            <el-checkbox
              :model-value="item.done"
              @change="() => toggleTask(item.id)"
            />

            <div class="task-body">
              <template v-if="editingId === item.id">
                <el-input
                  v-model="editText"
                  size="small"
                  @keyup.enter.native="() => saveEdit(item.id)"
                  @blur="() => saveEdit(item.id)"
                  autofocus
                />
              </template>
              <template v-else>
                <span class="task-text">{{ item.text }}</span>
              </template>
            </div>

            <div class="task-actions">
              <button class="act-btn" title="Edit" @click="startEdit(item)">✎</button>
              <button class="act-btn act-btn--del" title="Delete" @click="removeTask(item.id)">✕</button>
            </div>
          </li>
        </ul>
      </el-scrollbar>

      <!-- Footer -->
      <footer v-if="items.length" class="page-footer">
        <span>{{ doneCount }} / {{ items.length }} done</span>
        <button class="clear-btn" @click="confirmClearAll">Clear all</button>
      </footer>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import { useTodoStore, type TodoItem } from './stores/todoStore';

const store = useTodoStore();

const newTask = ref('');
const editingId = ref<string | null>(null);
const editText = ref('');

const items = computed(() => store.items);
const pendingCount = computed(() => store.pendingCount);
const doneCount = computed(() => store.doneCount);

function handleAdd() {
  if (!newTask.value.trim()) return;
  store.addTask(newTask.value);
  newTask.value = '';
}

function startEdit(item: TodoItem) {
  editingId.value = item.id;
  editText.value = item.text;
}

function saveEdit(id: string) {
  if (editingId.value !== id) return;
  if (!editText.value.trim()) {
    // If emptied, just cancel edit without saving
    editingId.value = null;
    editText.value = '';
    return;
  }
  store.updateTask(id, editText.value);
  editingId.value = null;
  editText.value = '';
}

function toggleTask(id: string) {
  store.toggleTask(id);
}

function removeTask(id: string) {
  store.removeTask(id);
}

function confirmClearAll() {
  if (!items.value.length) return;
  ElMessageBox.confirm(
    'This will permanently remove all tasks. Continue?',
    'Clear all tasks',
    {
      confirmButtonText: 'Yes, clear everything',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(() => {
      store.clearAll();
    })
    .catch(() => {
      /* cancelled */
    });
}
</script>

<style scoped>
/* ── Root ─────────────────────────────────────────── */
.app-root {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 16px;
  background: #f9fafb;
  font-family: system-ui, -apple-system, sans-serif;
  color: #374151;
}

.app-wrap {
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  padding: 24px;
}

/* ── Page header ─────────────────────────────────── */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.page-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
}

.counter {
  font-size: 0.85rem;
  color: #6b7280;
}

/* ── Add row ─────────────────────────────────────── */
.add-row {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.btn-add {
  flex-shrink: 0;
  padding: 0 16px;
  border-radius: 6px;
  border: none;
  background: #3b82f6;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-add:hover {
  background: #2563eb;
}

/* ── Empty hint ──────────────────────────────────── */
.empty-hint {
  text-align: center;
  color: #9ca3af;
  font-size: 0.95rem;
  padding: 32px 0;
}

/* ── Task list ───────────────────────────────────── */
.list-scroll {
  max-height: 400px;
}

.task-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.task-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 8px;
  border-radius: 6px;
  transition: background 0.15s;
}

.task-row:hover {
  background: #f3f4f6;
}

.task-body {
  flex: 1;
  min-width: 0;
}

.task-text {
  font-size: 0.95rem;
  color: #1f2937;
  line-height: 1.4;
}

.is-done .task-text {
  text-decoration: line-through;
  color: #9ca3af;
}

/* ── Task actions ────────────────────────────────── */
.task-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s;
}

.task-row:hover .task-actions {
  opacity: 1;
}

.act-btn {
  background: none;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #6b7280;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.act-btn:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.act-btn--del:hover {
  background: #fee2e2;
  color: #ef4444;
}

/* ── Footer ──────────────────────────────────────── */
.page-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.page-footer span {
  font-size: 0.85rem;
  color: #6b7280;
}

.clear-btn {
  background: none;
  border: none;
  font-size: 0.85rem;
  color: #ef4444;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.15s;
}

.clear-btn:hover {
  background: #fee2e2;
}

/* ── Responsive ──────────────────────────────────── */
@media (max-width: 600px) {
  .app-root {
    padding: 16px;
  }
  .task-actions {
    opacity: 1;
  }
}

/* ── Element Plus overrides ──────────────────────── */
:deep(.el-input__wrapper) {
  border-radius: 6px;
  box-shadow: 0 0 0 1px #d1d5db inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #3b82f6 inset;
}

:deep(.el-checkbox__inner) {
  border-radius: 4px;
  width: 18px;
  height: 18px;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}
</style>
