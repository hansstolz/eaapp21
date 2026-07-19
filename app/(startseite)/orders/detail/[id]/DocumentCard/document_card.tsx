import { _getDocumentBy } from "@/app/api/orders/orders_crud";
import DocumentColumns from "@/app/columns/document/document_columns";
import Section from "@/components/app/Section";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/app/tanstack_table/data_table";
import { TDocument } from "@/app/data_types/documents/tdocument";
import { useOrderStore } from "@/app/stores/order/order_store";
import { useEffect, useState } from "react";

export default function DocumentCard() {
  const { order } = useOrderStore(); // Replace with actual order number from the store or prop
  const [documents, setDocuments] = useState<TDocument[]>([]);
  const columns = DocumentColumns();

  useEffect(() => {
    const getDocuments = async () => {
      if (!order) return;
      const documents = await _getDocumentBy(order.order_no);
      setDocuments(documents);
    };
    if (order) void getDocuments();
  }, [order]);

  return (
    <Card className="h-full">
      <Section no={3} title={"Documents"} actions={undefined}>
        <div className="w-full flex flex-col gap-3">
          <DataTable showHeader={false} columns={columns} data={documents} />
        </div>
      </Section>
    </Card>
  );
}
