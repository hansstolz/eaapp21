import type { EaClients } from "@/app/data_types/clients/ea_clients";

export async function _deleteClient(uidClient: number) {
  const response = await fetch(`/clients/delete_client/${uidClient}`, {
    method: "DELETE",
  });
  if (!response.ok) return null;
  return response.json() as Promise<EaClients>;
}
