import CustomerOrdersColumns from "@/app/columns/orders/orders_customer_columns";
import { EaOrdersCustomer } from "@/app/data_types/orders/ea_orders_customer";
import { useCustomerBoundStore } from "@/app/stores/customer/CustomerStore";
import React, { useEffect, useState } from "react";
import { DataTable } from "../tanstack_table/data_table";
import { _getOrdersByCustomer } from "@/app/api/customers/customers_crud";

export default function OrdersPanel() {
  const columns = CustomerOrdersColumns();
  const [orders, setOrders] = useState<EaOrdersCustomer[]>([]);
  const uid_customer = useCustomerBoundStore(
    (state) => state.customer?.uid_customer,
  );

  useEffect(() => {
    if (!uid_customer) return;
    const getOrders = async () => {
      const data = await _getOrdersByCustomer(uid_customer);
      setOrders(data);
    };
    getOrders();
  }, [uid_customer]);
  return <DataTable columns={columns} data={orders} />;
}
