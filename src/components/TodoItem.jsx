import { useState, memo } from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import { Check, Pencil, Trash2, GripVertical } from "lucide-react";

function TodoItem({ index, todo, onUpdate, onDelete, onToggleComplete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.todo);

  const { ref } = useSortable({ id: todo.id, index });

  const handleSave = () => {
    if (!editValue.trim()) return;
    onUpdate(todo.id, editValue.trim());
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setEditValue(todo.todo);
      setIsEditing(false);
    }
  };

  return (
    <li
      ref={ref}
      className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
    >
      <GripVertical className="text-gray-400 dark:text-gray-500 cursor-move" />
      {/* Serial Number */}
      <span className="text-gray-500 dark:text-gray-400 font-mono text-sm w-8 shrink-0">
        {index + 1}.
      </span>

      {/* Todo Text / Inline Edit */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            autoFocus
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
          />
        ) : (
          <span
            className={`block truncate ${todo.completed ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-800 dark:text-gray-200"}`}
          >
            {todo.todo}
          </span>
        )}
      </div>

      {/* Status Badge */}
      <span
        className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
          todo.completed
            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
            : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
        }`}
      >
        {todo.completed ? "Completed" : "Pending"}
      </span>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Mark Complete */}
        {!todo.completed && (
          <button
            className="p-1.5 rounded hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 transition-colors cursor-pointer"
            aria-label="Mark as complete"
            onClick={() => onToggleComplete(todo.id)}
          >
            <Check size={16} />
          </button>
        )}

        {/* Edit */}
        <button
            className="p-1.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer"
          aria-label="Edit todo"
          onClick={() => {
            setEditValue(todo.todo);
            setIsEditing(true);
          }}
        >
          <Pencil size={16} />
        </button>

        {/* Delete */}
        <button
            className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
          aria-label="Delete todo"
          onClick={() => onDelete(todo)}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
}
export default memo(TodoItem);
