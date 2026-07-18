import type { EaContacts } from "@/app/schemas/contacts/contact_schema";

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export function _createContact(data: EaContacts) {
  return request<EaContacts>(`/contacts/create_contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function _updateContact(data: EaContacts) {
  return request<EaContacts>(`/contacts/update_contact`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function _deleteContact(uidContact: number) {
  return request<EaContacts>(`/contacts/delete_contact/${uidContact}`, {
    method: "DELETE",
  });
}
