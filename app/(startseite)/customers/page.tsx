"use client";

import { Button } from "@/components/ui/button";
import usePaginatedActions from "@/lib/hooks/usePaginatedActions";
import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiFilePlus } from "react-icons/fi";
import CustomerSearch from "./CustomerSearch";
import CustomersOverviewColumns from "@/app/columns/customers/customers_overview_columns";
import { EaCustomerOverview } from "@/app/data_types/customer/ea_customer_overview";
import LineLR from "@/components/app/LineLR";
import LineRow from "@/components/app/LineRow";
import { DataTable } from "@/components/app/tanstack_table/data_table";
import PaginatedContainer from "@/components/app/paging/PaginatedContainer";
import { _getCustomersOverview } from "@/app/api/customers/customers_crud";

export default function CustomersPage() {
  const router = useRouter();
  const columns = CustomersOverviewColumns();
  const [search, setSearch] = useState("");
  const { actions, paginated, setPaginated } =
    usePaginatedActions<EaCustomerOverview>({
      defPaginated: {
        total_items: 0,
        per_page: 25,
        total_pages: 1,
        page: 1,
        items: [],
      },
    });
  const currentPage = paginated.page;
  const perPage = paginated.per_page;

  useEffect(() => {
    const getCustomers = async () => {
      const result = await _getCustomersOverview({
        paginated: {
          page: currentPage,
          per_page: perPage,
          total_items: 0,
          total_pages: 0,
          items: [],
        },
        search,
      });
      setPaginated(result);
    };

    getCustomers();
  }, [currentPage, perPage, search, setPaginated]);

  const updateQuery = (val: string) => {
    setSearch(val);
    actions.start();
  };

  const newHandler = () => {
    router.push("/customers/detail/0/true");
  };

  return (
    <>
      <LineLR>
        <LineRow>
          <CustomerSearch updateQuery={updateQuery} />
          <Button onClick={newHandler}>
            <FiFilePlus /> New Customer
          </Button>
        </LineRow>
      </LineLR>
      <DataTable
        onDoubleClick={(row: Row<EaCustomerOverview>) => {
          router.push(`/customers/detail/${row.original.uid_customer}/false`);
        }}
        columns={columns}
        data={paginated.items}
        tableClassName="table-fixed"
      />
      <PaginatedContainer paginated={paginated} actions={actions} />
    </>
  );
}
