"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { FiPlus, FiRefreshCw, FiShoppingCart } from "react-icons/fi";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/stores/auth-store";
import Searchbar from "@/components/app/Searchbar";
import Section from "@/components/app/Section";
import { DataTable } from "@/components/app/tanstack_table/data_table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AddForkDialog from "./AddForkDialog";
import TransferForkDialog from "./TransferForkDialog";
import type { NewOrderCustomer, NewOrderFork } from "./types";

const customerColumns: ColumnDef<NewOrderCustomer>[] = [
  { accessorKey: "customer_no", header: "No" },
  { accessorKey: "cal_name_list", header: "Customer" },
  { accessorKey: "street_address", header: "Address" },
  { accessorKey: "city", header: "City" },
  { accessorKey: "category_customer", header: "Cat" },
];
const forkColumns: ColumnDef<NewOrderFork>[] = [
  { accessorKey: "fork_no", header: "No" },
  { accessorKey: "fork_model", header: "Model" },
  { accessorKey: "client_name", header: "Customer Client" },
];

export default function NewOrderClient({ initialCustomers }: { initialCustomers: NewOrderCustomer[] }) {
  const router = useRouter();
  const worker = useAuthStore((state) => state.user?.username ?? "");
  const [customers, setCustomers] = useState<NewOrderCustomer[]>(initialCustomers);
  const [forks, setForks] = useState<NewOrderFork[]>([]);
  const [customer, setCustomer] = useState<NewOrderCustomer | null>(null);
  const [fork, setFork] = useState<NewOrderFork | null>(null);
  const [customerQuery, setCustomerQuery] = useState("");
  const [forkQuery, setForkQuery] = useState("");
  const [showForkDialog, setShowForkDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const searchTimer = useRef<number | null>(null);
  const searchRequest = useRef<AbortController | null>(null);

  const updateCustomerQuery = (query: string) => {
    setCustomerQuery(query);
    if (searchTimer.current !== null) window.clearTimeout(searchTimer.current);
    searchRequest.current?.abort();
    searchTimer.current = window.setTimeout(async () => {
      const controller = new AbortController();
      searchRequest.current = controller;
      try {
        const response = await fetch(`/new-order/customers?search=${encodeURIComponent(query)}`, { signal: controller.signal });
        if (!response.ok) throw new Error();
        setCustomers(await response.json());
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) toast.error("Customers could not be loaded");
      }
    }, 250);
  };

  const selectCustomer = async (selected: NewOrderCustomer) => {
    setCustomer(selected);
    setFork(null);
    const response = await fetch(`/forks/get_forks_by_customer_id/${selected.uid_customer}`);
    if (!response.ok) return toast.error("Forks could not be loaded");
    setForks(await response.json());
  };
  const filteredForks = forks.filter((item) =>
    !forkQuery || String(item.fork_no ?? "").startsWith(forkQuery) ||
    (item.fork_model ?? "").toLowerCase().includes(forkQuery.toLowerCase()),
  );
  const reset = () => {
    setCustomer(null); setFork(null); setForks([]); setCustomerQuery(""); setForkQuery("");
  };
  const createOrder = async () => {
    if (!customer || !fork) return;
    setCreating(true);
    const response = await fetch("/new-order/create", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid_customer: customer.uid_customer, uid_fork: fork.uid_fork, worker }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      toast.error(body?.error ?? "Order could not be created");
      setCreating(false);
      return;
    }
    const result = await response.json() as { uid_order: number };
    toast.success("Order created");
    router.push(`/orders/detail/${result.uid_order}`);
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {[
            { key: "customer", label: customer ? `${customer.customer_no} ${customer.cal_name_list}` : "Customer", active: Boolean(customer) },
            { key: "fork", label: fork ? `${fork.fork_no} ${fork.fork_model}` : "Fork", active: Boolean(fork) },
          ].map((step, index) => (
              <div key={step.key} className="flex min-w-0 items-center gap-2">
                {index > 0 && <span className="text-muted-foreground">›</span>}
                <div className={`truncate rounded-md px-3 py-2 text-sm ${step.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{step.label}</div>
              </div>
            ))}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={reset}><FiRefreshCw /> Clear</Button>
          <Button disabled={!customer || !fork || creating} type="button" onClick={createOrder}><FiShoppingCart /> {creating ? "Creating…" : "New Order"}</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="p-4">
          <Section no={1} title="Customer" actions={<Button size="sm" type="button" onClick={() => router.push("/customers/true")}><FiPlus /> New Customer</Button>}>
            <div className="grid gap-4">
              <Searchbar value={customerQuery} setQuery={updateCustomerQuery} />
              <div className="h-[600px] overflow-auto">
                <DataTable columns={customerColumns} data={customers} onDoubleClick={(row: Row<NewOrderCustomer>) => void selectCustomer(row.original)} />
              </div>
            </div>
          </Section>
        </Card>
        <Card className="p-4">
          <Section no={2} title="Fork" actions={<div className="flex gap-2"><Button disabled={!customer} variant="outline" size="sm" type="button" onClick={() => setShowTransferDialog(true)}>Transfer</Button><Button disabled={!customer} size="sm" type="button" onClick={() => setShowForkDialog(true)}><FiPlus /> New Fork</Button></div>}>
            <div className="grid gap-4">
              <Searchbar disabled={!customer} focus={false} placeHolder="Fork No or model" value={forkQuery} setQuery={setForkQuery} />
              <div className="h-[600px] overflow-auto">
                <DataTable columns={forkColumns} data={filteredForks} onDoubleClick={(row: Row<NewOrderFork>) => setFork(row.original)} />
              </div>
            </div>
          </Section>
        </Card>
      </div>
      {customer && <AddForkDialog open={showForkDialog} setOpen={setShowForkDialog} customer={customer} onCreated={(created) => { setForks((items) => [created, ...items]); setFork(created); }} />}
      {customer && <TransferForkDialog open={showTransferDialog} setOpen={setShowTransferDialog} customer={customer} onTransferred={(transferred) => { setForks((items) => [transferred, ...items.filter((item) => item.uid_fork !== transferred.uid_fork)]); setFork(transferred); }} />}
    </div>
  );
}
