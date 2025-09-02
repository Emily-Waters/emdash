import { ObjectKeys, ObjectType } from "../types";

export function pick<T extends ObjectType, K extends ObjectKeys<T>>(
  obj: T,
  ...keys: K[] & ObjectKeys<T>[]
) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (keys.includes(key)) {
      return { ...acc, [key]: value };
    }

    return acc;
  }, {} as { [Key in K]: T[Key] });
}
