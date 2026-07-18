import React from "react";
import PageOf from "./PageOf";
import PageButtons from "./PageButtons";

type Props<T> = {
  paginated: TPaginatedResult<T>;
  actions: TPaginatedActions;
};

export default function PaginatedContainer<T>({
  paginated,
  actions,
}: Props<T>) {
  return (
    <>
      <div className=" flex p-2 justify-between  ">
        <PageOf {...paginated} />
        <PageButtons actions={actions} paginated={paginated} />
      </div>
    </>
  );
}
