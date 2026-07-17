"use client";
import FormColumns from "@/app/columns/forms/form_columns";
import { EaFormOverview } from "@/app/data_types/forms/ea_forms";
import { AlertDialog } from "@/app/dialogs/general/alert_dialog";
import { DataTable } from "@/components/app/tanstack_table/data_table";
import { Button } from "@/components/ui/button";
import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

type FormsOverviewProps = {
  data: EaFormOverview[];
};
export default function FormsOverview({ data }: FormsOverviewProps) {
  const { columns } = FormColumns();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  const dblClick = (row: Row<EaFormOverview>) => {
    const index = Number(row.index);
    const route = `/settings/forms/${data[index].uid_forms_item}`;
    //setState("Edit");
    router.push(route);
  };

  const askDeleteItem = (row: Row<EaFormOverview>) => {
    setOpen(true);
    setSelectedId(Number(row.index));
  };
  const deleteItem = async () => {
    if (selectedId !== null) {
      const response = await fetch(
        `/forms/delete_form/${data[selectedId].uid_forms_item}`,
        { method: "DELETE" },
      );
      if (response.ok) {
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
    //setState("New");
    router.push("/settings/forms/0");
  };

  return (
    <div className="flex flex-col gap-3 bg-blue rounded-lg border border-gray-400 py-4">
      <Button
        onClick={() => newItem()}
        className="ml-3 px-3 w-fit"
        size={"sm"}
        variant={"destructive"}
      >
        New Item
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
