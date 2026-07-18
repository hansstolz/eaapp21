import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function addOrUpdateArray<T>(
  field: T,
  fields: T[],
  compare: (f: T) => boolean,
): T[] {
  const index = fields.findIndex((f: T) => compare(f));
  //Not found, add on end.
  if (-1 === index) {
    return [...fields, field];
  }
  //found, so return:
  //Clone of items before item being update.
  //updated item
  //Clone of items after item being updated.
  return [...fields.slice(0, index), field, ...fields.slice(index + 1)];
}

export function removeFromArray<T>(
  array: T[],
  compare: (f: T) => boolean,
): T[] {
  const index = array.findIndex((f: T) => compare(f));
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
}

export const onlyDigitsPoint = (
  event: React.KeyboardEvent<HTMLInputElement>,
): boolean => {
  const value = (event.target as HTMLInputElement).value;

  if (event.key == "." && value.includes(".")) {
    event.preventDefault();
    return false;
  }

  if (!isNaN(Number(event.key))) {
    const parts = value.split(".");

    if (parts.length > 1) {
      //alert(event.location);
      if (parts[1].length >= 2) {
        event.preventDefault();
        return false;
      }
    }
  }

  if (
    isNaN(Number(event.key)) &&
    event.key !== "Backspace" &&
    event.key !== "." &&
    event.key !== "-" &&
    event.key !== "Tab" &&
    event.key !== "ArrowRight" &&
    event.key !== "ArrowLeft"
  ) {
    event.preventDefault();
    return false;
  }
  return true;
};

export const onlyDigits = (
  event: React.KeyboardEvent<HTMLInputElement>,
): boolean => {
  if (
    isNaN(Number(event.key)) &&
    event.key !== "Backspace" &&
    event.key !== "Tab" &&
    event.key !== "ArrowRight" &&
    event.key !== "ArrowLeft"
  ) {
    event.preventDefault();
    return false;
  }
  return true;
};
