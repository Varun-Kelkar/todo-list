/**
 * Sorts todos so pending items appear first, then completed items.
 * Within each group, the original order is preserved.
 */
export function sortTodos(todos) {
  return [...todos].sort((a, b) => Number(a.completed) - Number(b.completed));
}
