import React from "react";
import LineRow from "../LineRow";
import SmallText from "../Texts";

type Props = TPaginated & {};

export default function PageOf({ page, total_pages, per_page }: Props) {
  return (
    <>
      <LineRow>
        <SmallText>
          Page {page} of {total_pages}
        </SmallText>
        <SmallText>{per_page} per Page</SmallText>
      </LineRow>
    </>
  );
}
