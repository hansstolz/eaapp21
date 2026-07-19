"use client";
import React, { use } from "react";
import { Row } from "@tanstack/react-table";
import { useCustomerBoundStore } from "@/app/stores/customer/CustomerStore";
import { useDeleteStore } from "@/app/stores/delete/delete_slice";
import ClientColumns from "@/app/columns/clients/clients_columns";
import { EaClients } from "@/app/data_types/clients/ea_clients";
import { DataTable } from "../tanstack_table/data_table";
import AskFor from "../ask_for";

export default function ClientPanel() {
  const clients = useCustomerBoundStore((state) => state.clients);
  const deleteClient = useCustomerBoundStore((state) => state.deleteClient);
  const openDeleteDialog = useDeleteStore((state) => state.openDeleteDialog);
  const columns = ClientColumns();

  const askDelete = (row: Row<EaClients>) => {
    row.original.uid_client &&
      openDeleteDialog({
        uid: row.original.uid_client,
        label: row.original.last_name ?? "",
        title: "Delete",
        delete: async (uid: number) => deleteClient(uid),
      });
  };

  return (
    <>
      <DataTable onCellClick={askDelete} columns={columns} data={clients} />
      <AskFor />
    </>
  );
}
