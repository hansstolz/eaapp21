import { _getDocumentBy } from "@/app/api/orders/orders_crud";
import DocumentColumns from "@/app/columns/document/document_columns";
import Section from "@/components/app/Section";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/app/tanstack_table/data_table";
import { TDocument } from "@/app/data_types/documents/tdocument";
import { useOrderStore } from "@/app/stores/order/order_store";
import { useEffect, useState } from "react";
import { useDocumentRefreshStore } from "@/app/stores/documents/document_store";
import { toast } from "sonner";

export default function DocumentCard() {
  const { order } = useOrderStore();
  const revision = useDocumentRefreshStore((state) => state.revision);
  const orderNo = order?.order_no;
  const [documents, setDocuments] = useState<TDocument[]>([]);
  const columns = DocumentColumns();

  useEffect(() => {
    if (!orderNo) return;
    const controller = new AbortController();
    void _getDocumentBy(orderNo, controller.signal).then((documents) => {
      if (!controller.signal.aborted) setDocuments(documents);
    }).catch(() => {
      if (!controller.signal.aborted) toast.error("Documents konnten nicht aktualisiert werden.");
    });
    return () => controller.abort();
  }, [orderNo, revision]);

  return (
    <Card className="h-full">
      <Section no={3} title={"Documents"} actions={undefined}>
        <div
          className={documents.length > 10 ? "max-h-[370px] w-full overflow-y-auto" : "w-full"}
          tabIndex={documents.length > 10 ? 0 : undefined}
          role="region"
          aria-label="Dokumentliste"
        >
          <DataTable showHeader={false} columns={columns} data={orderNo ? documents : []} />
        </div>
      </Section>
    </Card>
  );
}
