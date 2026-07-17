type TPaginated = {
  page: number;
  per_page: number;
  total_pages: number;
  total_items: number;
};

type TPaginatedResult<T> = TPaginated & {
  items: T[];
};

type TPaginatedActions = {
  start: () => void;
  prev: () => void;
  next: () => void;
  end: () => void;
};

type TPaginatedStates = {
  disableStart: boolean;
  disablePrev: boolean;
  disableNext: boolean;
  disableEnd: boolean;
};
