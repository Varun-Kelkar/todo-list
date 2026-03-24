import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function TodoListSkeleton({ count = 6 }) {
  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Todo List</h1>
      <div className="flex justify-end mb-6">
        <Skeleton width={120} height={40} borderRadius={8} />
      </div>
      <ul className="flex flex-col gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <li key={i} className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <Skeleton width={24} height={16} />
            <div className="flex-1 min-w-0">
              <Skeleton height={16} />
            </div>
            <Skeleton width={72} height={24} borderRadius={9999} />
            <div className="flex items-center gap-1">
              <Skeleton width={28} height={28} borderRadius={6} />
              <Skeleton width={28} height={28} borderRadius={6} />
              <Skeleton width={28} height={28} borderRadius={6} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
