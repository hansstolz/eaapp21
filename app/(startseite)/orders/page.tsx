"use client";

import usePaginatedActions from "@/lib/hooks/usePaginatedActions";
import { useEffect, useMemo, useState } from "react";
import OrdersSearch from "./OrdersSearch";
import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";
import OrdersOverviewColumns from "@/app/columns/orders/orders_overview_columns";
import { EaOrdersOverview } from "@/app/data_types/orders/ea_orders_overview";
import { DropdownItem } from "@/app/data_types/data/values_data";
import LineLR from "@/components/app/LineLR";
import LineRow from "@/components/app/LineRow";
import DropDown from "@/components/app/DropDown";
import { DataTable } from "@/components/app/tanstack_table/data_table";
import PaginatedContainer from "@/components/app/paging/PaginatedContainer";
import {
  _getOrdersnewOverviewByStatus,
  _getOrdersOverviewPagninated,
} from "@/app/api/orders/orders_overview";

export default function OrdersPage() {
  const router = useRouter();
  const [searchStatus, setSearchStatus] = useState("all");
  const columns = OrdersOverviewColumns();
  const [search, setSearch] = useState("");

  const { actions, paginated, setPaginated } =
    usePaginatedActions<EaOrdersOverview>({
      defPaginated: {
        total_items: 0,
        per_page: 25,
        total_pages: 1,
        page: 1,
        items: [],
      },
    });

  useEffect(() => {
    let cancelled = false;
    const loadOrders = async () => {
      const result = searchStatus === "all"
        ? await _getOrdersOverviewPagninated(
            paginated.page,
            paginated.per_page,
            search,
          )
        : await _getOrdersnewOverviewByStatus(
            paginated.page,
            paginated.per_page,
            search,
          );
      if (!cancelled) setPaginated(result);
    };
    void loadOrders();
    return () => {
      cancelled = true;
    };
  }, [paginated.page, paginated.per_page, search, searchStatus, setPaginated]);

  const updateQuery = (val: string) => {
    setSearch(val);
    actions.start();
  };

  const stati = useMemo(
    () => [
      { label: "All", value: "all" },
      { label: "Diagnose", value: "Diagnose" },
      { label: "Costestimate", value: "Costestimate" },
      { label: "Worksheet", value: "Worksheet" },
      { label: "Invoice", value: "Invoice" },
      { label: "Invoice paid", value: "Invoice paid" },
      { label: "Credit", value: "Credit" },
    ],
    [],
  );

  const onStatiChange = (item: DropdownItem) => {
    if (item.label === "All") {
      setSearch("");
      setSearchStatus("all");
      return;
    }
    setSearchStatus("status");
    setSearch(item.value as string);
  };

  const goToOrderDetail = (row: Row<EaOrdersOverview>) => {
    const uid_order = row.original.uid_order;
    const route = `/orders/detail/${uid_order}`;
    router.push(route);
  };

  return (
    <>
      <LineLR>
        <LineRow>
          <DropDown valuesIn={stati} handler={onStatiChange} />
          <OrdersSearch
            disabled={searchStatus !== "all"}
            updateQuery={updateQuery}
          />
        </LineRow>
      </LineLR>
      <DataTable
        columns={columns}
        data={paginated.items}
        tableClassName="table-fixed"
        onRowClick={goToOrderDetail}
      />
      <PaginatedContainer paginated={paginated} actions={actions} />
    </>
  );
}
