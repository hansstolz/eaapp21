import PositionsColumns from "@/app/columns/costestimate/position_columns";
import { EaOrdersPosition } from "@/app/data_types/orders/ea_orders_position";
import AddArtDialog from "@/app/dialogs/costestimate/add_article";
import { useDeleteStore } from "@/app/stores/delete/delete_slice";
import { useCostestimateStore } from "@/app/stores/costestimate/costestimate_store";
import AskFor from "@/components/app/ask_for";
import { DataTable } from "@/components/app/tanstack_table/data_table";
import { Button } from "@/components/ui/button";
import { Row } from "@tanstack/react-table";
import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";

export default function OrderPositions() {
  const [showArticleDialog, setShowArticleDialog] = useState(false);
  const [addArticle, setAddArticle] = useState(false);
  const { positions, getPosition, deletePosition } = useCostestimateStore();
  const openDeleteDialog = useDeleteStore((state) => state.openDeleteDialog);

  const columns = PositionsColumns();
  const onPositionClick = (row: Row<EaOrdersPosition>) => {
    const index = row.index;
    getPosition(index);
    setShowArticleDialog(true);
    setAddArticle(false);
  };

  const askForDelete = (row: Row<EaOrdersPosition>) => {
    const uid = row.original.uid_orders_position;
    if (!uid) return;

    openDeleteDialog({
      uid,
      label: row.original.articlecode ?? row.original.articlecharacter ?? "",
      title: "Delete article",
      delete: deletePosition,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={() => {
          setShowArticleDialog(true);
          setAddArticle(true);
        }}
        className="w-25"
        size="sm"
      >
        <FiPlus /> Add Article
      </Button>
      <div className="h-60 overflow-scroll">
        <DataTable
          onDoubleClick={onPositionClick}
          columns={columns}
          data={positions}
          onCellClick={askForDelete}
          columnVisibility={{
            customer_category_no: false,
          }}
        />
      </div>
      <AskFor />
      {showArticleDialog && (
        <AddArtDialog
          isOpen={showArticleDialog}
          setIsOpen={setShowArticleDialog}
          addArticle={addArticle}
        />
      )}
    </div>
  );
}
