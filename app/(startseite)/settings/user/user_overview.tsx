"use client";

import UserColumns from "@/app/columns/user/user_columts";
import { EaUser } from "@/app/data_types/user/ea_user";
import Overview from "@/components/app/over_view";
import React from "react";

export default function UserOverview({ data }: { data: EaUser[] }) {
  const columns = UserColumns();

  const editRoute = (index: number) => {
    const uid = data[index].uid_user;
    return `/settings/user/${uid}`;
  };

  const delete_user = async (
    selectedId: number,
  ): Promise<{ status: number }> => {
    const response = await fetch(`/user/delete_user/${selectedId}`, {
      method: "DELETE",
    });

    return { status: response.ok ? 200 : response.status };
  };
  const deleteUser = async (
    selectedId: number,
  ): Promise<{ status: number }> => {
    // Implement the delete user logic here, e.g., call an API endpoint
    // For now, we will just return a mock status
    return await delete_user(selectedId);
  };

  return (
    <Overview
      id_name="uid_user"
      data={data}
      columns={columns}
      getRouteEdit={editRoute}
      routeNew="/settings/user/0"
      deleteAction={deleteUser}
    />
  );
}
