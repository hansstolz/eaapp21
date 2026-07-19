"use client";

import { _getForksHistoryByForkId } from "@/app/api/forks/forks_crud";
import ForkHistCol from "@/app/columns/forks/fork_history_columns";
import { EaForkHistory } from "@/app/data_types/forks/ea_fork_history";
import { useOrderStore } from "@/app/stores/order/order_store";
import MovableDialog from "@/components/app/movable_dialog";
import { DataTable } from "@/components/app/tanstack_table/data_table";
import { PageColumns } from "@/components/app/TwoPageColumns";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

import { useEffect, useRef, useState } from "react";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export default function ForkHistoryDialog({ isOpen, setIsOpen }: Props) {
  const columns = ForkHistCol();

  const { order } = useOrderStore();
  const [history, setHistory] = useState<EaForkHistory[]>([]);

  useEffect(() => {
    const getHistory = async () => {
      if (order) {
        const result = await _getForksHistoryByForkId(order.uid_fork);
        setHistory(result);
      }
    };

    getHistory();
  }, [order]);

  return (
    <>
      <MovableDialog
        className="min-w-3/5"
        open={isOpen}
        setOpen={setIsOpen}
        title={"Fork History"}
      >
        <form>
          <div className="dialog-main bg-white">
            <PageColumns className="grid-cols-1">
              <div className="flex flex-col gap-3">
                <DataTable columns={columns} data={history} />
              </div>
            </PageColumns>
          </div>
          <DialogFooter className="h-12 p-4">
            <div className="flex gap-12 justify-end mr-4">
              <Button
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Close
              </Button>
              <Button disabled={true} type="submit" size="sm">
                Save
              </Button>
            </div>
          </DialogFooter>
        </form>
      </MovableDialog>
    </>
  );
}
