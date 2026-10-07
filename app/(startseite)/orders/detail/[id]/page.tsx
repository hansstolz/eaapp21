"use client";
import { useParams } from "next/navigation";
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

const goBack = () => window.history.back();

export default function OrderDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(TabNamesOrder.Diagnose);
  const { order, getOrderById, deleteOrderById } = useOrderStore();

  useEffect(() => {
    getOrderById(Number(id)); // Example: Fetch order with ID 1 on component mount
  }, [getOrderById, id]);

  return (
    <>
      <LineLR>
        <LineRow>
          <Button onClick={goBack} size="sm" title="List">
            <FiList /> List
          </Button>
          <Button onClick={() => deleteOrderById(Number(id))} size="sm">
            <FiDelete /> Delete
          </Button>
        </LineRow>
      </LineLR>
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
