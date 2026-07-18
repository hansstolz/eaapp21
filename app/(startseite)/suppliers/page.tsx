"use client";

import { Button } from "@/components/ui/button";
import usePaginatedActions from "@/lib/hooks/usePaginatedActions";
import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiFilePlus } from "react-icons/fi";
import SupplierSearch from "./SupplierSearch";
import SuppliersOverviewColumns from "@/app/columns/suppliers/suppliers_overview_columns";
import { EaCompanyOverview } from "@/app/data_types/companies/ea_companies_overview";
import LineLR from "@/components/app/LineLR";
import LineRow from "@/components/app/LineRow";
import { DataTable } from "@/components/app/tanstack_table/data_table";
import PaginatedContainer from "@/components/app/paging/PaginatedContainer";
import { _getCompaniesOverview } from "@/app/api/companies/companies_crud";

export default function SuppliersPage() {
  const router = useRouter();
  const columns = SuppliersOverviewColumns();
  const [search, setSearch] = useState("");
  const { actions, paginated, setPaginated } =
    usePaginatedActions<EaCompanyOverview>({
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
    const getCompanies = async () => {
      const result = await _getCompaniesOverview({
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

    getCompanies();
  }, [currentPage, perPage, search, setPaginated]);

  const updateQuery = (val: string) => {
    setSearch(val);
    actions.start();
  };

  const newHandler = () => {
    router.push("/suppliers/detail/0/true");
  };

  return (
    <>
      <LineLR>
        <LineRow>
          <SupplierSearch updateQuery={updateQuery} />
          <Button variant="destructive" onClick={newHandler}>
            <FiFilePlus /> New Supplier
          </Button>
        </LineRow>
      </LineLR>
      <DataTable
        onDoubleClick={(row: Row<EaCompanyOverview>) => {
          router.push(`/suppliers/detail/${row.original.uid_company}/false`);
        }}
        columns={columns}
        data={paginated.items}
        tableClassName="table-fixed"
      />
      <PaginatedContainer paginated={paginated} actions={actions} />
    </>
  );
}
