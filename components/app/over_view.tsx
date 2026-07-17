"use client";
import { AlertDialog } from "@/app/dialogs/general/alert_dialog";
import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { DataTable } from "./tanstack_table/data_table";
import { getObjektWert } from "@/lib/get_value";

type FormsOverviewProps<T> = {
  id_name: keyof T;
  data: T[];
  columns: ColumnDef<T>[];
  routeNew: string;
  getRouteEdit: (item: number) => string;
  deleteAction: (selectedId: number) => Promise<{ status: number }>;
};
export default function Overview<T>({
  id_name,
  data,
  columns,
  getRouteEdit,
  routeNew,
  deleteAction,
}: FormsOverviewProps<T>) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  const dblClick = (row: Row<any>) => {
    const index = Number(row.index);
    const route = getRouteEdit(index);
    router.push(route);
  };

  const askDeleteItem = (row: Row<any>) => {
    setOpen(true);
    setSelectedId(Number(row.index));
  };

  const deleteItem = async () => {
    if (selectedId !== null) {
      const rec = data[selectedId];

      const rec_id = getObjektWert(rec, id_name) as unknown as number;

      const result = await deleteAction(rec_id);
      if (result.status === 200) {
        toast.success("Form deleted successfully");
      } else {
        toast.error("Error deleting form");
      }

      setOpen(false);
      setSelectedId(null);
      router.refresh();
    }
  };

  const newItem = () => {
    router.push(routeNew);
  };

  return (
    <div className="flex flex-col gap-3 bg-blue rounded-lg border border-gray-600 py-4">
      <Button onClick={() => newItem()} className="ml-3 px-3 w-fit">
        New User
      </Button>
      <AlertDialog
        open={open}
        setOpen={setOpen}
        onConfirm={() => {
          deleteItem();
        }}
      />
      <DataTable
        onCellClick={askDeleteItem}
        onDoubleClick={dblClick}
        columns={columns}
        data={data}
      />
    </div>
  );
}
