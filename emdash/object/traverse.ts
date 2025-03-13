//@ts-nocheck
import emdash from "..";
import { FlattenObject } from "../types";

export function traverse<T extends emdash.types.ObjectType>(
  obj: T,
  callback: <K extends keyof emdash.types.FlattenObject<T>>(
    key: K,
    value: FlattenObject<T>[K]
  ) => void
) {
  const copy = { ...obj };

  for (const key in obj) {
    callback(key, obj[key]);

    if (emdash.object.isPojo(copy[key])) {
      copy[key] = traverse(copy[key], callback);
    }
  }

  return copy;
}
