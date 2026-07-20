import React from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiSkipBack,
  FiSkipForward,
} from "react-icons/fi";
import { Button } from "../ui/button";

type Props = {
  isNew?: boolean;
  itemOf: string;
  actions: TPaginatedActions;
};

export default function PagingContainer({
  itemOf,
  actions,
  isNew = false,
}: Props) {
  return (
    <div className={`flex flex-row items-center gap-4`}>
      <Button
        disabled={isNew}
        variant={"outline"}
        onClick={actions.start}
        size="icon-sm"
        className="text-slate-200 border-slate-200 bg-alternate-600"
      >
        <FiSkipBack />
      </Button>
      <Button
        disabled={isNew}
        variant={"outline"}
        onClick={actions.prev}
        size="icon-sm"
        className="text-slate-200 border-slate-200 bg-alternate-600"
      >
        <FiChevronLeft />
      </Button>
      <Button
        disabled={isNew}
        variant={"outline"}
        onClick={actions.next}
        size="icon-sm"
        title=""
        className="text-slate-200 border-slate-200 bg-alternate-600"
      >
        <FiChevronRight />
      </Button>
      <Button
        disabled={isNew}
        variant={"outline"}
        onClick={actions.end}
        size="icon-sm"
        className="text-slate-200 border-slate-200 bg-alternate-600"
      >
        <FiSkipForward />
      </Button>
      {!isNew && <div className="w-10 text-slate-200">{itemOf}</div>}
    </div>
  );
}
