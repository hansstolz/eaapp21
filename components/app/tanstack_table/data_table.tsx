import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRef, useState } from "react";
import { ActiveCell, useDefaultColumn, useSkipper } from "./default_column";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  tableClassName?: string;
  onDoubleClick?: (row: Row<TData>) => void;
  onRowClick?: (row: Row<TData>) => void;
  onCellClick?: (row: Row<TData>) => void;
  updateData?: (rowIndex: number, columnId: string, value: unknown) => void;
  showHeader?: boolean;
  columnVisibility?: Record<string, boolean>;

  /** optional: initial sorting */
  initialSorting?: SortingState;
}

export function DataTable<TData>({
  columns,
  columnVisibility,
  data,
  tableClassName,
  onDoubleClick,
  onRowClick,
  onCellClick,
  updateData,
  initialSorting,
  showHeader = true,
}: DataTableProps<TData>) {
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);
  const prevDataRef = useRef(data);

  if (prevDataRef.current !== data) {
    prevDataRef.current = data;
    setActiveCell(null);
  }

  const defaultColumn = useDefaultColumn<TData>();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>(initialSorting ?? []);
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    state: { columnFilters, sorting, columnVisibility },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),

    autoResetPageIndex,
    meta: {
      updateData,
      activeCell,
      setActiveCell,
      skipAutoResetPageIndex, // falls du das in updateData nutzt
    },
  });

  return (
    <div className="border rounded-lg">
      <Table className={tableClassName}>
        {showHeader ? (
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortDir = header.column.getIsSorted(); // false | "asc" | "desc"

                  return (
                    <TableHead
                      key={header.id}
                      aria-sort={
                        sortDir === "asc"
                          ? "ascending"
                          : sortDir === "desc"
                            ? "descending"
                            : "none"
                      }
                      style={{
                        width: header.getSize(),
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          className={[
                            "w-full text-left inline-flex items-center gap-2",
                            canSort
                              ? "cursor-pointer select-none"
                              : "cursor-default",
                          ].join(" ")}
                          onClick={
                            canSort
                              ? header.column.getToggleSortingHandler()
                              : undefined
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}

                          {canSort && (
                            <span className="text-xs">
                              {sortDir === "asc"
                                ? "▲"
                                : sortDir === "desc"
                                  ? "▼"
                                  : "↕"}
                            </span>
                          )}
                        </button>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
        ) : null}

        <TableBody className="">
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="hover:bg-accent/50 cursor-pointer"
                onDoubleClick={() => onDoubleClick?.(row)}
                onClickCapture={(event) => {
                  const target = event.target;

                  if (
                    target instanceof Element &&
                    target.closest('[data-row-click="ignore"]')
                  ) {
                    return;
                  }

                  onRowClick?.(row);
                }}
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    data-row-click={
                      cell.column.columnDef.meta?.isClickable
                        ? "ignore"
                        : undefined
                    }
                    className={cell.column.columnDef.meta?.className}
                    style={{
                      width: cell.column.getSize(),
                      textAlign: cell.column.columnDef.meta?.align,
                    }}
                    onClick={() =>
                      cell.column.columnDef.meta?.isClickable &&
                      onCellClick?.(row)
                    }
                  >
                    {(() => {
                      const rendered = flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      );
                      const rawValue = cell.getValue();
                      const renderedText =
                        typeof rendered === "string" ||
                        typeof rendered === "number"
                          ? String(rendered)
                          : "";
                      const fallbackText =
                        typeof rawValue === "string" ||
                        typeof rawValue === "number"
                          ? String(rawValue)
                          : "";
                      const tooltipText = renderedText || fallbackText;
                      const showTooltip =
                        tooltipText.length > 0 &&
                        cell.column.columnDef.meta?.showTooltip !== false;

                      if (!showTooltip) return rendered;

                      return (
                        <Tooltip>
                          <TooltipTrigger render={<div className="w-full" />}>
                            {rendered}
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm wrap-break-word">
                            {tooltipText}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })()}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
