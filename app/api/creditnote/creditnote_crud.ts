export type CreditnoteForm = {
  worker_creditnote: string | null;
  creditnote_date: string | Date | null;
};

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export const _getCreditnote = (uidOrder: number) =>
  request<CreditnoteForm | null>(`/creditnote/get_creditnote_by_uid_order/${uidOrder}`);

export const _updateCreditnote = (uidOrder: number, data: CreditnoteForm) =>
  request<CreditnoteForm>("/creditnote/update_creditnote", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid_order: uidOrder, ...data }),
  });
