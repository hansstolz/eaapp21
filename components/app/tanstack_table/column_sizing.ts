import type { ColumnSizingState } from "@tanstack/react-table";

type SizingColumn = { id: string; size: number; minSize: number; maxSize: number };

export function fillColumnSpace(
  columns: SizingColumn[],
  previous: ColumnSizingState,
  next: ColumnSizingState,
  containerWidth: number,
): ColumnSizingState {
  const sizeOf = (column: SizingColumn, sizing: ColumnSizingState) =>
    Math.max(column.minSize, Math.min(column.maxSize, sizing[column.id] ?? column.size));
  const result = { ...next };
  let remaining = containerWidth - columns.reduce((sum, column) => sum + sizeOf(column, next), 0);
  // Fill spare space in other columns, keeping the dragged column's exact width.
  for (const column of [...columns].reverse()) {
    if (remaining <= 0 || sizeOf(column, next) !== sizeOf(column, previous)) continue;
    const size = sizeOf(column, next);
    const increase = Math.min(remaining, column.maxSize - size);
    result[column.id] = size + increase;
    remaining -= increase;
  }
  return result;
}
