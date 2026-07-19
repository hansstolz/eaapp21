export function overviewPagination(request: Request) {
  const params = new URL(request.url).searchParams;
  return {
    params,
    page: Math.max(1, Number(params.get("page")) || 1),
    perPage: Math.min(
      200,
      Math.max(1, Number(params.get("per_page")) || 25),
    ),
  };
}

export function paginatedResponse<T>(
  page: number,
  perPage: number,
  totalItems: number,
  items: T[],
) {
  return Response.json({
    page,
    per_page: perPage,
    total_items: totalItems,
    total_pages: Math.ceil(totalItems / perPage),
    items,
  });
}

export function exactDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}
