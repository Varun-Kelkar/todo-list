import { useState, useOptimistic, useTransition, useCallback } from "react";
import { useFetch } from "../hooks/useFetch";
import { sortTodos } from "../utils/todoUtils";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import TodoItem from "./TodoItem";
import TodoListSkeleton from "./TodoListSkeleton";
import ConfirmModal from "./ConfirmModal";
import AddTodoModal from "./AddTodoModal";

const API_BASE = "https://dummyjson.com/todos";

export default function TodoList() {
  const { theme, toggleTheme } = useTheme();
  const { data, loading, error } = useFetch(API_BASE);
  const [todos, setTodos] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showPendingOnly, setShowPendingOnly] = useState(false);

  const [_, startTransition] = useTransition();
  // Sync fetched data into local state once
  const todoList = sortTodos(todos ?? data?.todos ?? []);
  const [optimisticTodos, dispatchOptimistic] = useOptimistic(
    todoList,
    (currentTodos, action) => {
      switch (action.type) {
        case "update":
          return currentTodos.map((t) =>
            t.id === action.id ? { ...t, todo: action.newText } : t,
          );
        case "toggle_complete":
          return sortTodos(
            currentTodos.map((t) =>
              t.id === action.id ? { ...t, completed: true } : t,
            ),
          );
        default:
          return currentTodos;
      }
    },
  );

  const initTodos = useCallback(
    (updater) => {
      setTodos((prev) => {
        const current = prev ?? data?.todos ?? [];
        return typeof updater === "function" ? updater(current) : updater;
      });
    },
    [data?.todos],
  );

  // CREATE
  const handleAdd = async (text) => {
    if (!text) return;

    try {
      const res = await fetch(`${API_BASE}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todo: text, completed: false, userId: 1 }),
      });
      const created = await res.json();
      initTodos((prev) => sortTodos([created, ...prev]));
      setShowAddModal(false);
    } catch {
      // silently fail
    }
  };

  // UPDATE
  const handleUpdate = useCallback(
    async (id, newText) => {
      startTransition(async () => {
        dispatchOptimistic({ type: "update", id, newText });
        try {
          await fetch(`${API_BASE}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ todo: newText }),
          });
          initTodos((prev) =>
            prev.map((t) => (t.id === id ? { ...t, todo: newText } : t)),
          );
        } catch {
          // silently fail
        }
      });
    },
    [startTransition, dispatchOptimistic, initTodos],
  );

  // TOGGLE COMPLETE
  const handleToggleComplete = useCallback(
    async (id) => {
      startTransition(async () => {
        dispatchOptimistic({ type: "toggle_complete", id });
        try {
          await fetch(`${API_BASE}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: true }),
          });
          initTodos((prev) =>
            sortTodos(
              prev.map((t) => (t.id === id ? { ...t, completed: true } : t)),
            ),
          );
        } catch {
          // silently fail — optimistic update auto-reverts
        }
      });
    },
    [startTransition, dispatchOptimistic, initTodos],
  );

  // DELETE
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`${API_BASE}/${deleteTarget.id}`, { method: "DELETE" });
      initTodos((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    } catch {
      // silently fail
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return <TodoListSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600 dark:text-red-400">
        <p className="text-lg font-semibold">Failed to load todos</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{error}</p>
      </div>
    );
  }

  const filteredTodos = showPendingOnly
    ? optimisticTodos.filter((t) => !t.completed)
    : optimisticTodos;

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Todo List</h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-700" />}
        </button>
      </div>

      {/* Toolbar: Toggle + Add */}
      <div className="flex items-center justify-between mb-6">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <span className="text-sm text-gray-600 dark:text-gray-400">Show All</span>
          <div
            className={`relative w-10 h-5 rounded-full transition-colors ${
              showPendingOnly ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
            }`}
            onClick={() => setShowPendingOnly((v) => !v)}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                showPendingOnly ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Show Pending</span>
        </label>
        <button
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          onClick={() => setShowAddModal(true)}
        >
          + Add Todo
        </button>
      </div>

      {/* Todo List */}
      {filteredTodos.length === 0 ? (
        <p className="text-center text-gray-400 dark:text-gray-500 py-10">
          {showPendingOnly
            ? "No pending todos!"
            : "No todos yet. Add one above!"}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filteredTodos.map((todo, idx) => (
            <TodoItem
              key={todo.id}
              index={idx}
              todo={todo}
              onUpdate={handleUpdate}
              onDelete={setDeleteTarget}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </ul>
      )}

      {/* Add Todo Modal */}
      <AddTodoModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreate={handleAdd}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        todoText={deleteTarget?.todo ?? ""}
      />
    </div>
  );
}
