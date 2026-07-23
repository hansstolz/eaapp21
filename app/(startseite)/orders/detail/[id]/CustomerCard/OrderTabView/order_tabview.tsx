import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import {
  FaEuroSign,
  FaFileInvoice,
  FaFileInvoiceDollar,
  FaOutdent,
  FaReadme,
  FaStethoscope,
} from "react-icons/fa";

import { useOrderStore } from "@/app/stores/order/order_store";
import { usePaymentStore } from "@/app/stores/order/PaymentSlice";
import DiagnosisTab from "../../Tabs/diagnosis_tab";
import CostestimateTab from "../../Tabs/costestimate_tab";
import WorksheetPage from "../../Tabs/worksheet/WorksheetPage";
import InvoicePage from "../../Tabs/invoice/InvoicePage";
import CreditnotePage from "../../Tabs/creditnote/CreditnotePage";
import PaymentsPage from "../../Tabs/payments/PaymentsPage";
import RemindersPage from "../../Tabs/reminders/RemindersPage";

enum TabNamesOrder {
  Diagnose = "Diagnose",
  Costestimate = "Costestimate",
  Worksheet = "Worksheet",
  Invoice = "Invoice",
  Creditnote = "Creditnote",
  Payments = "Payments",
  Reminders = "Reminders",
}

export default function OrderTabView() {
  const { order } = useOrderStore();
  const { getPayments, paymentCount } = usePaymentStore();
  const [activeTab, setActiveTab] = useState<TabNamesOrder>(
    TabNamesOrder.Diagnose,
  );

  useEffect(() => {
    if (order) {
      void getPayments(order.uid_order);
    }
  }, [getPayments, order]);

  const tabs = () => {
    const items = [];
    if (!order?.isArticleSales) {
      items.push({
        label: TabNamesOrder.Diagnose,
        value: TabNamesOrder.Diagnose,
        icon: FaStethoscope,
      });
    }
    items.push({
      label: TabNamesOrder.Costestimate,
      value: TabNamesOrder.Costestimate,
      icon: FaEuroSign,
    });
    if (!order?.isArticleSales) {
      items.push({
        label: TabNamesOrder.Worksheet,
        value: TabNamesOrder.Worksheet,
        icon: FaOutdent,
      });
    }
    items.push({
      label: TabNamesOrder.Invoice,
      value: TabNamesOrder.Invoice,
      icon: FaFileInvoiceDollar,
    });
    items.push({
      label: TabNamesOrder.Creditnote,
      value: TabNamesOrder.Creditnote,
      icon: FaFileInvoice,
    });
    items.push({
      label: `Payments[${paymentCount}]`,
      value: TabNamesOrder.Payments,
      icon: FaEuroSign,
    });
    items.push({
      label: TabNamesOrder.Reminders,
      value: TabNamesOrder.Reminders,
      icon: FaReadme,
    });

    return items;
  };
  return (
    <>
      <Card className="p-3">
        {order && (
          <Tabs
            value={
              order.isArticleSales &&
              (activeTab === TabNamesOrder.Diagnose ||
                activeTab === TabNamesOrder.Worksheet)
                ? TabNamesOrder.Costestimate
                : activeTab
            }
            onValueChange={(value) => setActiveTab(value as TabNamesOrder)}
          >
            <TabsList className="flex gap-3">
              {tabs().map((tab) => (
                <TabsTrigger
                  className="tab-trigger data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  key={tab.label}
                  value={tab.value.toString()}
                >
                  {tab.icon && <tab.icon className="mr-2 inline-block" />}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="min-h-100 max-h-165 overflow-y-scroll">
              <TabsContent value={TabNamesOrder.Diagnose}>
                <DiagnosisTab />
              </TabsContent>
              <TabsContent value={TabNamesOrder.Costestimate}>
                <CostestimateTab />
              </TabsContent>
              <TabsContent value={TabNamesOrder.Worksheet}>
                <WorksheetPage />
              </TabsContent>
              <TabsContent value={TabNamesOrder.Invoice}>
                <InvoicePage />
              </TabsContent>
              <TabsContent value={TabNamesOrder.Creditnote}>
                <CreditnotePage />
              </TabsContent>
              <TabsContent value={TabNamesOrder.Payments}>
                <PaymentsPage />
              </TabsContent>
              <TabsContent value={TabNamesOrder.Reminders}>
                <RemindersPage />
              </TabsContent>
            </div>
          </Tabs>
        )}
      </Card>
    </>
  );
}
