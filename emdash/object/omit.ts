import { ObjectKeys, ObjectType } from "../types/object";

export function omit<T extends ObjectType, K extends ObjectKeys<T>>(
  obj: T,
  ...keys: K[] & ObjectKeys<T>[]
) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (keys.includes(key)) {
      return acc;
    }

    return { ...acc, [key]: value };
  }, {} as { [Key in keyof T as K extends Key ? never : Key]: T[Key] });
}
