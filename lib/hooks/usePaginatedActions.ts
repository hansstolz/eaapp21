import React, { useState } from "react";

type Props<T> = {
  defPaginated: TPaginatedResult<T>;
};

export default function usePaginatedActions<T>({ defPaginated }: Props<T>) {
  const [paginated, setPaginated] = useState(defPaginated);
  const actions: TPaginatedActions = {
    start() {
      const p = { ...paginated };
      p.page = 1;
      setPaginated(p);
    },
    prev() {
      const p = { ...paginated };
      p.page--;
      setPaginated(p);
    },
    next() {
      const p = { ...paginated };
      p.page++;
      setPaginated(p);
    },
    end() {
      const p = { ...paginated };
      p.page = paginated.total_pages;
      setPaginated(p);
    },
  };

  return { actions, paginated, setPaginated };
}
