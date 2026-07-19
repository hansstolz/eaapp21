import type { EaForksParts } from "@/app/data_types/forks/ea_forks";

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export function _createForkPart(part: EaForksParts) {
  return request<EaForksParts>("/forks/create_forkparts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(part),
  });
}

export function _getForkPartsByForkId(uidFork: number) {
  return request<EaForksParts[]>(`/forks/get_forksparts_by/${uidFork}`);
}

export function _deleteForkPart(uidForkPart: number) {
  return request<EaForksParts>(`/forks/delete_forkparts/${uidForkPart}`, {
    method: "DELETE",
  });
}

export function _updateForkPart(part: EaForksParts) {
  return request<EaForksParts>("/forks/update_forkparts", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(part),
  });
}
