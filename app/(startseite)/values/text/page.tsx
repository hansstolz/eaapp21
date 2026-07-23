"use client";

import { EaText } from "@/app/data_types/text/ea_text";
import TextsDialog from "@/app/dialogs/texts/texts_dialog";
import { useTextStore } from "@/app/stores/texts/text_store";
import ConfirmDialog from "@/components/app/confirm-dialog";
import Trash from "@/components/app/trash";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Reorder } from "motion/react";
import { Activity, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

export default function ValuesTextPage() {
  const {
    texts,
    loadTexts,
    deleteText,
    reorderTexts,
    updateOrderTexts,
    hasChanges,
    isUpdating,
    selectText,
  } = useTextStore(
    useShallow((state) => ({
      texts: state.texts,
      loadTexts: state.loadTexts,
      deleteText: state.deleteText,
      reorderTexts: state.reorderTexts,
      updateOrderTexts: state.updateOrderTexts,
      hasChanges: state.hasChanges,
      isUpdating: state.isUpdating,
      selectText: state.selectText,
    })),
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<EaText | null>(null);
  const isFiltered = searchTerm.trim() !== "";

  useEffect(() => {
    loadTexts();
  }, [loadTexts]);

  const filteredData = texts.filter((row) =>
    row.text_code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const deleteAction = (row: EaText) => {
    setPendingDelete(row);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) {
      return;
    }
    await deleteText(pendingDelete.uid_text);

    setPendingDelete(null);
  };

  useEffect(() => {
    if (!isDragging && hasChanges) {
      updateOrderTexts();
    }
  }, [hasChanges, isDragging, updateOrderTexts]);

  return (
    <>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Filter by code"
          />
        </div>
      </div>
      <Activity mode={isUpdating === true ? "hidden" : "visible"}>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full">
            <thead className="bg-stone-200 border-b">
              <tr>
                {!isFiltered && (
                  <th className="w-12 px-4 py-3 text-left text-sm font-semibold text-blue-900">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </th>
                )}
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                  No
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                  Code
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                  Text
                </th>
                <th className="px-4 py-3 text-right">
                  <TextsDialog title="Texts" buttonClassName="ml-0" />
                </th>
              </tr>
            </thead>
            {isFiltered ? (
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((row) => (
                  <tr
                    onDoubleClick={() => selectText(row.uid_text)}
                    key={row.uid_text}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {row.text_code}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {row.text_no}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {row.text_value}
                    </td>
                    <td
                      onClick={() => deleteAction(row)}
                      className="px-4 py-3 text-sm text-gray-900"
                    >
                      <Trash />
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Keine Ergebnisse gefunden
                    </td>
                  </tr>
                )}
              </tbody>
            ) : (
              <Reorder.Group
                as="tbody"
                axis="y"
                values={texts}
                onReorder={reorderTexts}
                className="divide-y divide-gray-200"
              >
                {texts.map((row) => (
                  <Reorder.Item
                    key={row.uid_text}
                    value={row}
                    as="tr"
                    className="hover:bg-gray-50 cursor-grab active:cursor-grabbing"
                    whileDrag={{
                      scale: 1.02,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                      backgroundColor: "#f9fafb",
                    }}
                    transition={{ duration: 0.2 }}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={() => setIsDragging(false)}
                    onDoubleClick={() => selectText(row.uid_text)}
                  >
                    <td className="px-4 py-3 text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {row.text_no}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {row.text_code}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {row.text_value}
                    </td>
                    <td
                      onClick={() => deleteAction(row)}
                      className="px-4 py-3 text-sm text-gray-900"
                    >
                      <Trash />
                    </td>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            )}
          </table>
        </div>
      </Activity>
      <Activity mode={isUpdating === true ? "visible" : "hidden"}>
        <div className="flex items-center gap-3 p-4 text-center text-lg text-blue-900 font-semibold">
          <Spinner /> Aktualisiere Reihenfolge...
        </div>
      </Activity>
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDelete(null);
          }
        }}
        title="Delete entry?"
        description={
          pendingDelete
            ? `Moechtest du den Code "${pendingDelete.text_code}" wirklich loeschen?`
            : undefined
        }
        confirmText="Loeschen"
        cancelText="Abbrechen"
        onConfirm={confirmDelete}
      />
    </>
  );
}
