type Props = {
  paginatedIn: TPaginated;
};

export default function usePaginated({ paginatedIn }: Props) {
  const { page, total_pages } = paginatedIn;
  const paginatedStates: TPaginatedStates = {
    disableStart: total_pages <= 1 || page <= 1,
    disablePrev: total_pages <= 1 || page <= 1,
    disableNext: total_pages <= 1 || page >= total_pages,
    disableEnd: total_pages <= 1 || page >= total_pages,
  };

  return { paginatedStates };
}
