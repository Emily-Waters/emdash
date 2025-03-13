import { ObjectEntries, ObjectKeys } from "../types/object";

export function omit<T extends Record<string, unknown>, K extends ObjectKeys<T>>(
  obj: T,
  ...keys: K[] & ObjectKeys<T>[]
): Omit<T, K> {
  return (Object.entries(obj) as ObjectEntries<T>).reduce((acc, [key, value]) => {
    if (keys.includes(key)) return acc;
    return { ...acc, [key]: value };
  }, {} as Omit<T, K>);
}
