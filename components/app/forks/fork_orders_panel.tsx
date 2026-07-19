import { useEffect } from "react";
import { DataTable } from "@/components/app/tanstack_table/data_table";
import { useForkStore } from "@/app/stores/forks/fork_store";
import ForkOrdersColumns from "@/app/columns/forks/fork_orders_column";
import { Card } from "@/components/ui/card";

export default function ForkOrdersPanel() {
  const columns = ForkOrdersColumns();
  const orders = useForkStore((state) => state.orders);
  const fork = useForkStore((state) => state.fork);
  const getOrdersByForkId = useForkStore((state) => state.getOrdersByForkId);

  useEffect(() => {
    if (fork) getOrdersByForkId();
  }, [fork, getOrdersByForkId]);

  return (
    <Card>
      <DataTable columns={columns} data={orders} />
    </Card>
  );
}
