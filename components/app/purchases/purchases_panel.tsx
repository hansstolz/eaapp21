import { DataTable } from "@/components/app/tanstack_table/data_table";
import PurchasesColumns from "@/app/columns/purchases/purchases_columns";
import { useBoundStore } from "@/app/stores/suppliers/suppliers_store";

export default function PurchasesPanel() {
  const columns = PurchasesColumns();
  const purchases = useBoundStore((state) => state.purchases);

  return (
    <>
      <DataTable columns={columns} data={purchases} />
    </>
  );
}
