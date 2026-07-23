"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { FiPlus, FiRefreshCw, FiShoppingCart } from "react-icons/fi";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { NewOrderCustomer } from "../new-order/types";
import Searchbar from "@/components/app/Searchbar";
import Section from "@/components/app/Section";
import { DataTable } from "@/components/app/tanstack_table/data_table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const columns: ColumnDef<NewOrderCustomer>[] = [
  { accessorKey: "customer_no", header: "No" },
  { accessorKey: "cal_name_list", header: "Customer" },
  { accessorKey: "street_address", header: "Address" },
  { accessorKey: "city", header: "City" },
  { accessorKey: "category_customer", header: "Cat" },
];

export default function ArticleSalesClient({ initialCustomers }: { initialCustomers: NewOrderCustomer[] }) {
  const router = useRouter();
  const worker = useAuthStore((state) => state.user?.username ?? "");
  const [customers, setCustomers] = useState(initialCustomers);
  const [customer, setCustomer] = useState<NewOrderCustomer | null>(null);
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const searchTimer = useRef<number | null>(null);
  const searchRequest = useRef<AbortController | null>(null);

  const updateQuery = (value: string) => {
    setQuery(value);
    if (searchTimer.current !== null) window.clearTimeout(searchTimer.current);
    searchRequest.current?.abort();
    searchTimer.current = window.setTimeout(async () => {
      const controller = new AbortController();
      searchRequest.current = controller;
      try {
        const response = await fetch(`/new-order/customers?search=${encodeURIComponent(value)}`, { signal: controller.signal });
        if (!response.ok) throw new Error();
        setCustomers(await response.json());
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) toast.error("Customers could not be loaded");
      }
    }, 250);
  };
  const createSale = async () => {
    if (!customer) return;
    setCreating(true);
    const response = await fetch("/article-sales/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid_customer: customer.uid_customer, worker }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      toast.error(body?.error ?? "Article sale could not be created");
      setCreating(false);
      return;
    }
    const result = await response.json() as { uid_order: number };
    toast.success("Article sale created");
    router.push(`/orders/detail/${result.uid_order}`);
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-4">
        <div className={`truncate rounded-md px-3 py-2 text-sm ${customer ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          {customer ? `${customer.customer_no} ${customer.cal_name_list}` : "Customer"}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => { setCustomer(null); setQuery(""); }}><FiRefreshCw /> Clear</Button>
          <Button disabled={!customer || creating} type="button" onClick={createSale}><FiShoppingCart /> {creating ? "Creating…" : "New Sales"}</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="p-4">
          <Section no={1} title="Customer" actions={<Button size="sm" type="button" onClick={() => router.push("/customers/true")}><FiPlus /> New Customer</Button>}>
            <div className="grid gap-4">
              <Searchbar value={query} setQuery={updateQuery} />
              <div className="h-[600px] overflow-auto">
                <DataTable columns={columns} data={customers} onDoubleClick={(row: Row<NewOrderCustomer>) => setCustomer(row.original)} />
              </div>
            </div>
          </Section>
        </Card>
      </div>
    </div>
  );
}
