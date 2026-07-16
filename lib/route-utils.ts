export function parsePositiveId(value: unknown): number | null {
  const id = typeof value === "number" ? value : Number(value);

  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function readJsonObject(
  request: Request,
): Promise<Record<string, unknown> | null> {
  try {
    const body: unknown = await request.json();

    return body !== null && typeof body === "object" && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export function pickDefinedFields<T>(
  source: Record<string, unknown>,
  fields: readonly (keyof T)[],
): Partial<T> {
  const result: Partial<T> = {};

  for (const field of fields) {
    if (source[field as string] !== undefined) {
      result[field] = source[field as string] as T[keyof T];
    }
  }

  return result;
}

export function errorResponse(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}
