import React from "react";

export default function useGerman() {
  const toISOString = (date: Date) => {
    return date.toISOString().slice(0, 10);
  };

  const toISODTString = (date: Date) => {
    return date.toISOString().slice(0, 16);
  };

  const to2DigitDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    };
    return date === null
      ? ""
      : new Intl.DateTimeFormat("de-DE", options).format(date);
  };

  const toUSDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };

    return new Intl.DateTimeFormat("us-US", options).format(date);
  };

  const toCurrency = (value: number) => {
    const Euro = new Intl.NumberFormat("de-De", {
      style: "currency",
      currency: "EUR",
    });

    return `${Euro.format(value)}`;
  };

  const truncate = (str: string, n: number = 50) => {
    return str === null || str === undefined
      ? ""
      : str.length > n
        ? str.slice(0, n - 1) + "..."
        : str;
  };

  const daysBetween = (date1: Date, date2: Date) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

    return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
  };

  const to2DigitDateFromString = (isoString: string) => {
    const date = new Date(isoString);

    const deutschesDatum = date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return deutschesDatum;
  };

  const to2DigitStr = (num: number): string => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  return {
    to2DigitDate,
    toCurrency,
    truncate,
    toISOString,
    toISODTString,
    daysBetween,
    to2DigitDateFromString,
    to2DigitStr,
  };
}
