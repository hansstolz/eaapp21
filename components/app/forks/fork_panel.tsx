import ForksOverviewColumns from "@/app/columns/forks/forks_overview_columns";
import { EaForksOverview } from "@/app/data_types/forks/ea_forks_overview";
import { useCustomerBoundStore } from "@/app/stores/customer/CustomerStore";
import { useEffect, useState } from "react";
import { DataTable } from "../tanstack_table/data_table";
import { _getForksByCustomer } from "@/app/api/forks/forks_crud";

export default function ForksPanel() {
  const columns = ForksOverviewColumns();
  const [forks, setForks] = useState<EaForksOverview[]>([]);
  const uid_customer = useCustomerBoundStore(
    (state) => state.customer?.uid_customer,
  );

  useEffect(() => {
    if (!uid_customer) return;
    const getForks = async () => {
      const data = await _getForksByCustomer(uid_customer);
      setForks(data);
    };
    getForks();
  }, [uid_customer]);

  return <DataTable columns={columns} data={forks} />;
}
