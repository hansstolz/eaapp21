import React, { useState } from "react";

import { CellContext, ColumnDef } from "@tanstack/react-table";

export type ActiveCell = { rowId: string; columnId: string } | null;

function EditableCell<TData>({ getValue, row, column, table }: CellContext<TData, unknown>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);

  if (prevInitialValue !== initialValue) {
    setPrevInitialValue(initialValue);
    setValue(initialValue);
  }

  return (
    <button
      type="button"
      className="w-full text-left"
      onClick={() =>
        table.options.meta?.setActiveCell?.({
          rowId: row.id,
          columnId: column.id,
        })
      }
    >
      {value as string}
    </button>
  );
}

export function useDefaultColumn<TData>() {
  const defaultColumn: Partial<ColumnDef<TData>> = {
    cell: (props) => <EditableCell {...props} />,
  };
  return defaultColumn;
}

export function useSkipper() {
  const shouldSkipRef = React.useRef(true);
  const shouldSkip = shouldSkipRef.current;

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = React.useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  React.useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip] as const;
}
