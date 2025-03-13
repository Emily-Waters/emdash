import { ObjectEntries, ObjectKeys } from "../types";

export function pick<T extends Record<string, unknown>, K extends ObjectKeys<T>>(
  obj: T,
  ...keys: K[] & ObjectKeys<T>[]
): Pick<T, K> {
  return (Object.entries(obj) as ObjectEntries<T>).reduce((acc, [key, value]) => {
    if (keys.includes(key)) return { ...acc, [key]: value };
    return acc;
  }, {} as Pick<T, K>);
}
