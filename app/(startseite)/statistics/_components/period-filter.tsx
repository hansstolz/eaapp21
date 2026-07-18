"use client";

import type { StatisticPeriod } from "@/lib/statistics-data";

export default function PeriodFilter({
  period,
  articleOptions,
  selectedArticle,
}: {
  period: StatisticPeriod;
  articleOptions?: string[];
  selectedArticle?: string;
}) {
  const years = Array.from(
    { length: 10 },
    (_, index) => new Date().getFullYear() - 7 + index,
  );
  return (
    <form className="flex flex-col gap-6">
      <div className="flex flex-row gap-6">
        <Select name="startMonth" label="Start Month" value={period.startMonth} options={months} />
        <Select name="endMonth" label="End Month" value={period.endMonth} options={months} />
        <Select name="year" label="Years" value={period.year} options={years.map((year) => ({ label: String(year), value: year }))} />
      </div>
      {articleOptions ? (
        <label className="grid w-1/4 gap-1 text-sm">
          <span className="font-medium">Articles</span>
          <select name="article" defaultValue={selectedArticle ?? ""} onChange={submitForm} className="h-9 rounded-md border bg-background px-3">
            <option value="">All</option>
            {articleOptions.map((article, index) => (
              <option key={`${article}-${index}`} value={article}>
                {article}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </form>
  );
}

function Select({
  name,
  label,
  value,
  options,
}: {
  name: string;
  label: string;
  value: number;
  options: { label: string; value: number }[];
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-medium">{label}</span>
      <select
        name={name}
        defaultValue={value}
        onChange={submitForm}
        className="h-9 rounded-md border bg-background px-3"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function submitForm(event: React.ChangeEvent<HTMLSelectElement>) {
  event.currentTarget.form?.requestSubmit();
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
].map((label, index) => ({ label, value: index + 1 }));
