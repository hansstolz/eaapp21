import type { EaArticleOverview } from "@/app/data_types/articles/article_overview";
import type { PaginatedProps } from "@/app/data_types/general/tpaginated_props";
import type { TArticleOptions, TArticleResult } from "@/app/data_types/articles/article_result";
import type { EaArticles } from "@/app/schemas/articles/article_schema";

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export function _getArticlesOverview(props: PaginatedProps<EaArticleOverview>) {
  const query = new URLSearchParams({
    page: String(props.paginated.page),
    per_page: String(props.paginated.per_page),
    search: props.search,
  });
  return request<TPaginatedResult<EaArticleOverview>>(`/articles/get_articles_ov?${query}`);
}

export function _getArticles(search = "") {
  return request<TArticleResult[]>(`/articles/get_articles?search=${encodeURIComponent(search)}`);
}

export function _getArticleById(uidArticle: number) {
  return request<TArticleResult>(`/articles/get_article_by/${uidArticle}`);
}

export function _getArticleOptions() {
  return request<TArticleOptions>(`/articles/get_article_options`);
}

export function _updateArticle(data: EaArticles) {
  return request<TArticleResult>(`/articles/update_article`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function _createArticle(data: EaArticles) {
  return request<TArticleResult>(`/articles/create_article`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
