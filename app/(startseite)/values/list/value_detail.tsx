"use client";

import ValueColumns from "@/app/columns/values/value_columns";
import { DropdownItem } from "@/app/data_types/data/values_data";
import { EaValues } from "@/app/data_types/user/ea_values";
import { AlertDialog } from "@/app/dialogs/general/alert_dialog";
import ValueDialog from "@/app/dialogs/values/value_dialog";
import BaseSelect from "@/components/app/base_select";
import { DataTable } from "@/components/app/tanstack_table/data_table";
import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useValueStore } from "@/app/stores/values/value_store";

type Props = {
  optionsIn: DropdownItem[];
};

export default function ValueDetail({ optionsIn }: Props) {
  const columns = ValueColumns();
  const options = optionsIn;
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const values = useValueStore((state) => state.values);
  const selectedType = useValueStore((state) => state.selectedType);
  const loadValues = useValueStore((state) => state.loadValues);
  const openEdit = useValueStore((state) => state.openEdit);
  const deleteValue = useValueStore((state) => state.deleteValue);

  const router = useRouter();

  useEffect(() => {
    const initialType = optionsIn[0]?.value.toString();
    if (initialType) void loadValues(initialType);
  }, [optionsIn, loadValues]);

  const askDeleteItem = (row: Row<EaValues>) => {
    setOpen(true);
    setSelectedId(Number(row.index));
  };

  const deleteItem = async () => {
    if (selectedId !== null) {
      const rec = values[selectedId];
      if (!rec) return;

      await deleteValue(rec.uid_value);

      setOpen(false);
      setSelectedId(null);
      router.refresh();
    }
  };

  const getTitle = () => {
    return optionsIn.find((opt) => opt.value === selectedType)?.label || "";
  };

  const dblClick = (row: Row<EaValues>) => {
    const rec = values[row.index];
    if (!rec) return;
    openEdit(rec.uid_value);
  };

  return (
    <div>
      <hr className="mb-4 mt-4 border-blue-900 " />
      <div className=" flex flex-col gap-3 bg-blue rounded-lg border border-blue-900 py-4">
        <div className="flex gap-6">
          <ValueDialog title={getTitle()} />
          <AlertDialog
            open={open}
            setOpen={setOpen}
            onConfirm={() => {
              deleteItem();
            }}
          />

          {options.length > 1 && (
            <BaseSelect
              options={options}
              onChange={(value) => {
                if (value !== null) void loadValues(value);
              }}
            />
          )}
        </div>
        <DataTable
          onDoubleClick={dblClick}
          onCellClick={askDeleteItem}
          columns={columns}
          data={values}
        />
      </div>
    </div>
  );
}
