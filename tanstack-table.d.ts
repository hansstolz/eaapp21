// src/types/tanstack-table.d.ts
import "@tanstack/react-table";
import { ActiveCell } from "./components/ui/tanstack_table/default_column";

declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    updateData?: (rowIndex: number, columnId: string, value: unknown) => void;
    activeCell?: ActiveCell; // oder dein ActiveCell
    setActiveCell?: (cell: ActiveCell | null) => void; // besser: (cell: ActiveCell | null) => void
    skipAutoResetPageIndex?: () => void;
  }
}

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: "center" | "left" | "right";
    isEditable?: boolean;
    isSelect?: boolean;
    values?: string[];
    isClickable?: boolean;
    className?: string;
    showTooltip?: boolean;
  }
}
