import emdash from "..";
import { ObjectEntries } from "../types";

export function toEntries<T extends emdash.types.ObjectType>(obj: T): ObjectEntries<T> {
  return Object.entries(obj) as ObjectEntries<T>;
}
