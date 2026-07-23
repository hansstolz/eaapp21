"use client";

import { Button } from "@/components/ui/button";
import usePaginatedActions from "@/lib/hooks/usePaginatedActions";
import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiFilePlus } from "react-icons/fi";
import ArticleSearch from "./ArticleSearch";
import ArticlesOverviewColumns from "@/app/columns/articles/articles_overview_columns";
import { EaArticleOverview } from "@/app/data_types/articles/article_overview";
import LineLR from "@/components/app/LineLR";
import LineRow from "@/components/app/LineRow";
import { DataTable } from "@/components/app/tanstack_table/data_table";
import PaginatedContainer from "@/components/app/paging/PaginatedContainer";
import { _getArticlesOverview } from "@/app/api/articles/articles_crud";

export default function ArticlesPage() {
  const router = useRouter();
  const columns = ArticlesOverviewColumns();
  const [search, setSearch] = useState("");
  const { actions, paginated, setPaginated } =
    usePaginatedActions<EaArticleOverview>({
      defPaginated: {
        total_items: 0,
        per_page: 15,
        total_pages: 1,
        page: 1,
        items: [],
      },
    });
  const currentPage = paginated.page;
  const perPage = paginated.per_page;

  useEffect(() => {
    const getArticles = async () => {
      const result = await _getArticlesOverview({
        paginated: {
          page: currentPage,
          per_page: perPage,
          total_items: 0,
          total_pages: 0,
          items: [],
        },
        search,
      });
      setPaginated(result);
    };

    getArticles();
  }, [currentPage, perPage, search, setPaginated]);

  const updateQuery = (val: string) => {
    setSearch(val);
    actions.start();
  };

  const newHandler = () => {
    router.push("/articles/detail/0/true");
  };

  return (
    <>
      <LineLR>
        <LineRow>
          <ArticleSearch updateQuery={updateQuery} />
          <Button onClick={newHandler}>
            <FiFilePlus /> New Article
          </Button>
        </LineRow>
      </LineLR>
      <DataTable
        onDoubleClick={(row: Row<EaArticleOverview>) => {
          router.push(`/articles/detail/${row.original.uid_article}/false`);
        }}
        columns={columns}
        data={paginated.items}
        tableClassName="table-fixed"
      />
      <PaginatedContainer paginated={paginated} actions={actions} />
    </>
  );
}
