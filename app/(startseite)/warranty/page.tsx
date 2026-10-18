"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import type { EaWarrantyOverview } from "@/app/data_types/warranty/ea_warranty_overview";
import { warrantyOverviewColumns } from "@/app/columns/warranty/warranty_overview_columns";
import { DataTable } from "@/components/app/tanstack_table/data_table";
import PaginatedContainer from "@/components/app/paging/PaginatedContainer";
import Searchbar from "@/components/app/Searchbar";
import LineLR from "@/components/app/LineLR";
import usePaginatedActions from "@/lib/hooks/usePaginatedActions";
import useSearchOnTyping from "@/lib/hooks/useSearch";

import PaymentDialog from "./PaymentDialog";
import { remainingWarrantyCents } from "@/lib/warranty-payment";

export default function WarrantyPage() {
  const [paymentInvoice, setPaymentInvoice] = useState<EaWarrantyOverview | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { actions, paginated, setPaginated } = usePaginatedActions<EaWarrantyOverview>({
    defPaginated: { page: 1, per_page: 25, total_pages: 0, total_items: 0, items: [] },
  });
  const { typing, onChange, placeHolder } = useSearchOnTyping({
    placeHolderText: "Search warranty invoice/address",
    updateQuery: value => { setSearch(value); actions.start(); },
  });

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ page: String(paginated.page), per_page: String(paginated.per_page), search });
    async function load() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/warranty/get_warranty_overview?${query}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Warranty-Rechnungen konnten nicht geladen werden.");
        const result: TPaginatedResult<EaWarrantyOverview> = await response.json();
        if (!controller.signal.aborted) setPaginated(result);
      } catch (reason) {
        if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : "Laden fehlgeschlagen.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [paginated.page, paginated.per_page, search, setPaginated]);

  return <>
    <LineLR className="gap-3 flex-wrap"><Searchbar value={typing} setQuery={onChange} placeHolder={placeHolder} />
      <Link href="/warranty/new" className={buttonVariants()}>Create New Warranty</Link>
    </LineLR>
    {error && <p role="alert" className="p-2 text-red-600">{error}</p>}
    {loading && <p role="status" className="p-2 text-muted-foreground">Loading warranty invoices…</p>}
    <DataTable onDoubleClick={row => {
      if (remainingWarrantyCents(row.original.total_price_warranty, row.original.total_payment_warranty) > 0) setPaymentInvoice(row.original);
    }} columns={warrantyOverviewColumns} data={loading || error ? [] : paginated.items}
      enableColumnResizing tableClassName="table-fixed text-[#555] [&_thead]:bg-[#e6e6e6] [&_th]:text-[#444] [&_th]:font-bold [&_th:nth-child(7)]:text-[#ff0000] [&_th]:border [&_th]:border-[#aaa] [&_td]:border [&_td]:border-[#aaa] [&_tbody_tr:nth-child(odd)]:bg-white [&_tbody_tr:nth-child(even)]:bg-[#f2f2f2]" />
    {!loading && !error && paginated.items.length === 0 && <p role="status" className="p-2 text-muted-foreground">No warranty invoices found.</p>}
    <PaginatedContainer paginated={paginated} actions={actions} />
    {paymentInvoice && <PaymentDialog key={paymentInvoice.uid_warranty_invoice} invoice={paymentInvoice} onClose={() => setPaymentInvoice(null)} onSaved={updated => {
      setPaginated(current => ({ ...current, items: current.items.map(item => item.uid_warranty_invoice === updated.uid_warranty_invoice ? updated : item) }));
      setPaymentInvoice(null);
    }} />}
  </>;
}
