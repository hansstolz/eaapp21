import {
  ColumnDef,
  ColumnFiltersState,
  ColumnSizingState,
  functionalUpdate,
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
import { useEffect, useRef, useState } from "react";
import { fillColumnSpace } from "./column_sizing";
import { cn } from "@/lib/utils";
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
  enableColumnResizing?: boolean;
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
  enableColumnResizing = false,
}: DataTableProps<TData>) {
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);
  const prevDataRef = useRef(data);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidthRef = useRef(0);
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});

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
    enableColumnResizing,
    columnResizeMode: "onChange",
    state: { columnFilters, sorting, columnVisibility, columnSizing },
    onColumnSizingChange: (updater) => {
      setColumnSizing((previous) => {
        const next = functionalUpdate(updater, previous);
        if (!enableColumnResizing) return next;
        return fillColumnSpace(
          table.getVisibleLeafColumns().map((column) => ({
            id: column.id,
            size: column.columnDef.size ?? 150,
            minSize: column.columnDef.minSize ?? 20,
            maxSize: column.columnDef.maxSize ?? Number.MAX_SAFE_INTEGER,
          })),
          previous,
          next,
          containerWidthRef.current,
        );
      });
    },
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

  useEffect(() => {
    const container = containerRef.current;
    if (!enableColumnResizing || !container) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = Math.floor(entry.contentRect.width);
      containerWidthRef.current = width;
      const visibleColumns = table.getVisibleLeafColumns();
      const total = table.getTotalSize();
      if (width <= total || total === 0) return;
      table.setColumnSizing((previous) => {
        const next = { ...previous };
        visibleColumns.forEach((column) => {
          next[column.id] = Math.min(column.columnDef.maxSize ?? Number.MAX_SAFE_INTEGER, column.getSize() * width / total);
        });
        return next;
      });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [enableColumnResizing, columnVisibility, table]);

  return (
    <div ref={containerRef} className="min-w-0 border rounded-lg">
      <Table
        className={cn(tableClassName, enableColumnResizing && "table-fixed")}
        style={enableColumnResizing ? { width: table.getTotalSize() } : undefined}
      >
        {enableColumnResizing && (
          <colgroup>
            {table.getVisibleLeafColumns().map((column) => (
              <col key={column.id} style={{ width: column.getSize() }} />
            ))}
          </colgroup>
        )}
        {showHeader ? (
          <TableHeader className="bg-stone-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortDir = header.column.getIsSorted(); // false | "asc" | "desc"

                  return (
                    <TableHead
                      key={header.id}
                      className={enableColumnResizing ? "p-0" : undefined}
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
                      <div className={enableColumnResizing ? "relative flex h-10 items-center px-2" : undefined} style={enableColumnResizing ? { position: "relative", height: 40 } : undefined}>
                        {header.isPlaceholder ? null : (
                          <button
                            type="button"
                            className={[
                              "w-full overflow-hidden text-left inline-flex items-center gap-2",
                              enableColumnResizing ? "pr-2" : "",
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
                        {enableColumnResizing && header.column.getCanResize() && (
                          <button
                            type="button"
                            aria-label={`Spaltenbreite für ${header.column.id} ändern`}
                            title="Ziehen zum Ändern der Breite · Doppelklick zum Zurücksetzen"
                            className={cn(
                              "hover:border-primary focus-visible:border-primary focus-visible:outline-none",
                              header.column.getIsResizing() && "border-primary bg-primary/20",
                            )}
                            style={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              width: 10,
                              height: "100%",
                              cursor: "col-resize",
                              touchAction: "none",
                              userSelect: "none",
                              zIndex: 10,
                              borderRight: "2px solid var(--border)",
                            }}
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            onClick={(event) => event.stopPropagation()}
                            onDoubleClick={(event) => {
                              event.stopPropagation();
                              header.column.resetSize();
                            }}
                            onKeyDown={(event) => {
                              if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
                              event.preventDefault();
                              event.stopPropagation();
                              const delta = event.key === "ArrowRight" ? 10 : -10;
                              const size = Math.max(header.column.columnDef.minSize ?? 20, Math.min(header.column.columnDef.maxSize ?? Number.MAX_SAFE_INTEGER, header.column.getSize() + delta));
                              table.setColumnSizing((previous) => ({ ...previous, [header.column.id]: size }));
                            }}
                          />
                        )}
                      </div>
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
                    className={cn(cell.column.columnDef.meta?.className, enableColumnResizing && "overflow-hidden text-ellipsis [&_*]:max-w-full [&_*]:overflow-hidden [&_*]:text-ellipsis")}
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
