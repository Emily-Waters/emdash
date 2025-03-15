import emdash from "..";
import { ObjectEntries } from "../types";

export function entries<T extends emdash.types.ObjectType>(obj: T): ObjectEntries<T> {
  return Object.entries(obj) as ObjectEntries<T>;
}
