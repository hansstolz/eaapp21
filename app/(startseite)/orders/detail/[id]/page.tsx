"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiDelete, FiList } from "react-icons/fi";
import "../order.css";
import { useOrderStore } from "@/app/stores/order/order_store";
import LineLR from "@/components/app/LineLR";
import LineRow from "@/components/app/LineRow";
import { Button } from "@/components/ui/button";
import CustomerCard from "./CustomerCard/customer_card";
import ForkCard from "./ForkCard/fork_card";
import DocumentCard from "./DocumentCard/document_card";
import ArticleSales from "./CustomerCard/ArticleSales/article_sales";
import OrderCalc from "./OrderCalc";
import { TabNamesOrder } from "./order-tabs";
import OrderTabView from "./CustomerCard/OrderTabView/order_tabview";
import ConfirmDialog from "@/components/app/confirm-dialog";
import { toast } from "sonner";
import { canDeleteOrder } from "@/lib/order-deletion";

const goBack = () => window.history.back();

export default function OrderDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState(TabNamesOrder.Diagnose);
  const { order, getOrderById, deleteOrderById } = useOrderStore();
  const canDelete = order?.uid_order === Number(id) && canDeleteOrder(order.getOrder());

  useEffect(() => {
    getOrderById(Number(id)); // Example: Fetch order with ID 1 on component mount
  }, [getOrderById, id]);

  const deleteOrder = async () => {
    if (isDeleting || !canDelete) return;
    setShowDelete(false);
    setIsDeleting(true);
    try {
      await deleteOrderById(Number(id));
      toast.success("Order deleted");
      router.replace("/orders");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Auftrag konnte nicht gelöscht werden.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <LineLR>
        <LineRow>
          <Button onClick={goBack} size="sm" title="List">
            <FiList /> List
          </Button>
          <Button disabled={isDeleting || !canDelete} title={canDelete ? "Delete order" : "Löschen ist nur bis Worksheet und ohne Rechnung erlaubt."} onClick={() => setShowDelete(true)} size="sm">
            <FiDelete /> Delete
          </Button>
        </LineRow>
      </LineLR>
      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title="Delete order"
        description="Delete this order and all its article positions, texts, costestimates, diagnosis, worksheet, creditnote, warranty and payments? This cannot be undone."
        confirmText="Delete"
        onConfirm={() => void deleteOrder()}
      />
      <div className="order-grid">
        <div className="order-customer">
          <CustomerCard />
        </div>
        {order?.isArticleSales === false && (
          <div className="order-fork">
            <ForkCard />
          </div>
        )}
        {order?.isArticleSales && (
          <div className="order-fork">
            <ArticleSales />
          </div>
        )}
        <div className="order-client flex flex-col gap-3">
          <DocumentCard />
        </div>

        <div className="order-tabs">
          <OrderTabView activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <div className="order-calc">
          <OrderCalc activeTab={order?.isArticleSales && (activeTab === TabNamesOrder.Diagnose || activeTab === TabNamesOrder.Worksheet) ? TabNamesOrder.Costestimate : activeTab} />
        </div>
      </div>
    </>
  );
}
