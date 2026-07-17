import React, { useMemo, useState } from "react";

type Props = {
  paginatedIn: TPaginated;
};

export default function usePaginated({ paginatedIn }: Props) {
  const [paginatedStates, setPaginatedStates] = useState<TPaginatedStates>({
    disableEnd: true,
    disableNext: true,
    disablePrev: true,
    disableStart: true,
  });

  useMemo(() => {
    const { page, total_pages, per_page } = paginatedIn;

    const updateState = (state: TPaginatedStates) => {
      setPaginatedStates(state);
    };

    if (page === 1 && total_pages > 1) {
      updateState({
        disableStart: true,
        disablePrev: true,
        disableNext: false,
        disableEnd: false,
      });
    }

    if (page === total_pages && total_pages > 1) {
      updateState({
        disableStart: false,
        disablePrev: false,
        disableNext: true,
        disableEnd: true,
      });
    }

    if (page > 1 && page < total_pages) {
      updateState({
        disableStart: false,
        disablePrev: false,
        disableNext: false,
        disableEnd: false,
      });
    }

    if (page === 1 && total_pages === 1) {
      updateState({
        disableStart: true,
        disablePrev: true,
        disableNext: true,
        disableEnd: true,
      });
    }
  }, [paginatedIn.page, paginatedIn.total_pages]);

  return { paginatedStates };
}
