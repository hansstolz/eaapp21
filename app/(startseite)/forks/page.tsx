"use client";

import usePaginatedActions from "@/lib/hooks/usePaginatedActions";
import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ForkSearch from "./ForkSearch";
import ForksOverviewColumns from "@/app/columns/forks/forks_overview_columns";
import { EaForksOverview } from "@/app/data_types/forks/ea_forks_overview";
import LineLR from "@/components/app/LineLR";
import LineRow from "@/components/app/LineRow";
import { DataTable } from "@/components/app/tanstack_table/data_table";
import PaginatedContainer from "@/components/app/paging/PaginatedContainer";
import { _getForksOverview } from "@/app/api/forks/forks_crud";

export default function ForksPage() {
  const router = useRouter();
  const columns = ForksOverviewColumns();
  const [search, setSearch] = useState("");
  const { actions, paginated, setPaginated } =
    usePaginatedActions<EaForksOverview>({
      defPaginated: {
        total_items: 0,
        per_page: 25,
        total_pages: 1,
        page: 1,
        items: [],
      },
    });
  const { page, per_page: perPage } = paginated;

  useEffect(() => {
    const getForks = async () => {
      const result = await _getForksOverview({
        paginated: {
          page,
          per_page: perPage,
          total_items: 0,
          total_pages: 0,
          items: [],
        },
        search,
      });
      setPaginated(result);
    };

    getForks();
  }, [page, perPage, search, setPaginated]);

  const updateQuery = (val: string) => {
    setSearch(val);
    actions.start();
  };

  return (
    <>
      <LineLR>
        <LineRow>
          <ForkSearch updateQuery={updateQuery} />
        </LineRow>
      </LineLR>
      <DataTable
        onDoubleClick={(row: Row<EaForksOverview>) => {
          router.push(`/forks/detail/${row.original.uid_fork}/false`);
        }}
        columns={columns}
        data={paginated.items}
        tableClassName="table-fixed"
      />
      <PaginatedContainer paginated={paginated} actions={actions} />
    </>
  );
}
