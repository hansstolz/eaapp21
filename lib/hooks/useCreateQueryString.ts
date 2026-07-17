import { ReadonlyURLSearchParams } from "next/navigation";

export function useCreateQueryString(obj: Record<string, any>) {
  const params = new URLSearchParams();

  const keys = Object.keys(obj);

  keys.forEach((key) => {
    params.set(key, obj[key]);
  });

  return params.toString();
}

export function createRouteString(obj: Record<string, any>) {
  const keys = Object.keys(obj);

  return keys.map((key) => `${obj[key]}`).join("/");
}

export function createObjFromUrlParams(params: ReadonlyURLSearchParams) {
  const result: Record<string, any> = {};

  for (const [key, value] of params) {
    // each 'entry' is a [key, value] tupple

    result[key] = value;
  }

  return result;
}
