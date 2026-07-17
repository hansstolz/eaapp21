import { EaOrdersOverview } from "@/data_types/orders/ea_orders_overview";
import useGerman from "@/lib/hooks/useGerman";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export const StatusMap = new Map<string, string>([
  ["Invoice", "bg-[#EF717A]"],
  ["Worksheet", "bg-[#3498DB]"],
  ["Costestimate", "bg-[#F0DEB4]"],
  ["CostConfirm", "bg-[#F0DEB4]"],
  ["Invoice paid", "bg-[#00c000]"],
  ["Credit", "bg-[#006900]"],
  ["Warranty", "bg-[#b201b2]"],
  ["Diagnose", "bg-[#B8C9F1]"],
  ["default", "bg-black-700"],
]);

export default function OrdersOverviewColumns() {
  const { to2DigitDateFromString, truncate } = useGerman();

  const toWarranty = (str: number) => {
    return str === 0 ? "" : `WA:${str}`;
  };
  const toColor = (str: string) => {
    if (str === null) return "bg-black-700";
    const col = str.split("||").at(0);

    return col ? StatusMap.get(col) : "bg-black-700";
  };

  const toStatus = (str: string) => {
    if (str === null) return "No Stat";
    return str.split("||").at(0);
  };

  const columns = useMemo<ColumnDef<EaOrdersOverview>[]>(
    () => [
      {
        accessorKey: "created_at",
        header: () => "Date",
        cell: (info) => {
          const value = info.getValue() as string | null;
          return value ? to2DigitDateFromString(value) : "";
        },
        size: 70,
      },

      {
        accessorKey: "customer_no",
        header: () => "No",
        size: 60,
        meta: {
          align: "right",
        },
      },
      {
        accessorKey: "customer_address",
        header: () => "Customer",
        cell: (info) => truncate(String(info.getValue() ?? ""), 50),
        size: 280,
      },
      {
        accessorKey: "customer_client_name",
        header: () => "Client",
        cell: (info) => truncate(String(info.getValue() ?? ""), 25),
        size: 140,
      },
      {
        accessorKey: "fork_no",
        header: () => "Fo",
        size: 40,
        meta: {
          align: "right",
        },
      },
      {
        accessorKey: "fork_model",
        header: () => "Fork Model",
        cell: (info) => truncate(String(info.getValue() ?? ""), 35),
        size: 170,
      },
      {
        accessorKey: "warranty_no",
        header: () => "WA",
        footer: (props) => props.column.id,
        cell: (info) => (
          <div className="px-2 rounded-md bg-amber-500">
            {toWarranty(info.getValue() as number)}
          </div>
        ),
        size: 60,
        align: "center",
      },
      {
        accessorKey: "order_status",
        header: () => "Status",
        footer: (props) => props.column.id,
        cell: (info) => {
          const str = info.getValue() as string;
          return (
            <div className={`px-2 rounded-md ${toColor(str)}`}>
              {toStatus(str)}
            </div>
          );
        },
        size: 80,
        align: "center",
      },
    ],
    [to2DigitDateFromString, truncate],
  );

  return columns;
}
