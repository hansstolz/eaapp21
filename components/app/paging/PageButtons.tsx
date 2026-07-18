import React from "react";

import usePaginated from "@/lib/hooks/usePaginated";
import {
  FiChevronLeft,
  FiChevronRight,
  FiSkipBack,
  FiSkipForward,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";

type Props = {
  paginated: TPaginated;
  actions: TPaginatedActions;
};

export default function PageButtons({ paginated, actions }: Props) {
  const { paginatedStates } = usePaginated({ paginatedIn: paginated });

  return (
    <>
      <div className={`flex flex-row gap-2 items-center`}>
        <Button
          variant="outline"
          disabled={paginatedStates.disableStart}
          onClick={actions.start}
          size="icon"
          title=""
        >
          <FiSkipBack />
        </Button>
        <Button
          disabled={paginatedStates.disablePrev}
          onClick={actions.prev}
          variant="outline"
          size="icon"
          title=""
        >
          <FiChevronLeft />
        </Button>
        <Button
          disabled={paginatedStates.disableNext}
          onClick={actions.next}
          variant="outline"
          size="icon"
          title=""
        >
          <FiChevronRight />
        </Button>
        <Button
          disabled={paginatedStates.disableEnd}
          onClick={actions.end}
          variant="outline"
          size="icon"
          title=""
        >
          <FiSkipForward />
        </Button>
      </div>
    </>
  );
}
