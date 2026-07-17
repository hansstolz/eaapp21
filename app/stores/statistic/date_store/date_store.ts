import { DropdownItem } from "@/data_types/data/values_data";
import { use, useEffect } from "react";
import { StateCreator, create } from "zustand";

export interface SetDateSlice {
  months: DropdownItem[];
  years: DropdownItem[];

  startMonth: number;
  endMonth: number;
  year: number;

  startDate: Date;

  setStartMonth: (startMonth: number) => void;
  setEndMonth: (endMonth: number) => void;
  setYear: (year: number) => void;
  init: () => void;

  checkMonthEnd: (end: number) => boolean;
  checkMonthStart: (start: number) => boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const createDateSlice: StateCreator<
  SetDateSlice,
  [],
  [],
  SetDateSlice
> = (set, get) => ({
  months: [
    { label: "Januar", value: 1 },
    { label: "Februar", value: 2 },
    { label: "März", value: 3 },
    { label: "April", value: 4 },
    { label: "Mai", value: 5 },
    { label: "Juni", value: 6 },
    { label: "Juli", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "Oktober", value: 10 },
    { label: "November", value: 11 },
    { label: "Dezember", value: 12 },
  ],
  years: [
    { label: "2003", value: 2003 },
    { label: "2004", value: 2004 },
    { label: "2005", value: 2005 },
    { label: "2006", value: 2006 },
    { label: "2007", value: 2007 },
    { label: "2008", value: 2008 },
    { label: "2009", value: 2009 },
    { label: "2010", value: 2010 },
    { label: "2011", value: 2011 },
    { label: "2012", value: 2012 },
    { label: "2013", value: 2013 },
    { label: "2014", value: 2014 },
    { label: "2015", value: 2015 },
    { label: "2016", value: 2016 },
    { label: "2017", value: 2017 },
    { label: "2018", value: 2018 },
    { label: "2019", value: 2019 },
    { label: "2020", value: 2020 },
    { label: "2021", value: 2021 },
    { label: "2022", value: 2022 },
    { label: "2023", value: 2023 },
    { label: "2024", value: 2024 },
    { label: "2025", value: 2025 },
    { label: "2026", value: 2026 },
    { label: "2027", value: 2027 },
    { label: "2028", value: 2028 },
  ],
  startMonth: 0,
  endMonth: 0,
  year: 0,
  startDate: new Date(),

  setStartMonth: (startMonth: number) => set({ startMonth: startMonth }),
  setEndMonth: (endMonth: number) => set({ endMonth: endMonth }),
  setYear: (year: number) => set({ year: year }),

  init: () => {
    const act = get().startDate;
    get().setStartMonth(act.getMonth() + 1);
    get().setEndMonth(act.getMonth() + 1);
    get().setYear(act.getFullYear());
  },

  checkMonthStart: (start: number): boolean => {
    if (start > get().endMonth) {
      alert("Start Month > End Month");
      return false;
    }
    return true;
  },

  checkMonthEnd: (end: number): boolean => {
    if (get().startMonth > end) {
      alert("Start Month > End Month");
      return false;
    }
    return true;
  },

  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    let search = false;

    switch (e.target.id) {
      case "startMonth":
        const start = Number(e.target.value);
        search = get().checkMonthStart(start);
        if (search) get().setStartMonth(start);
        break;
      case "endMonth":
        const end = Number(e.target.value);
        search = get().checkMonthEnd(end);
        if (search) get().setEndMonth(end);
        break;
      case "year":
        get().setYear(Number(e.target.value));
        break;
    }
  },
});

export const useDateSlice = create<SetDateSlice>()((...a) => ({
  ...createDateSlice(...a),
}));

export const useSetDateStore = () => {
  const init = useDateSlice((state) => state.init);
  const months = useDateSlice((state) => state.months);
  const years = useDateSlice((state) => state.years);
  const startDate = useDateSlice((state) => state.startDate);
  const startMonth = useDateSlice((state) => state.startMonth);
  const endMonth = useDateSlice((state) => state.endMonth);
  const year = useDateSlice((state) => state.year);
  const onChange = useDateSlice((state) => state.onChange);

  useEffect(() => {
    init();
  }, []);

  return { months, years, startDate, startMonth, endMonth, year, onChange };
};
