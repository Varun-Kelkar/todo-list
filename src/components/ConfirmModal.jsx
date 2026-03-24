export default function ConfirmModal({ isOpen, onClose, onConfirm, todoText }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Confirm Delete</h3>
        <p className="text-gray-800 dark:text-gray-200">Are you sure you want to delete this todo?</p>
        <p className="text-gray-500 dark:text-gray-400 italic mt-1">"{todoText}"</p>
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
