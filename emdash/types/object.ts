export type ObjectType = {
  [x: string]: unknown;
};

export type ObjectKeys<T> = string & keyof T;

export type ObjectEntries<T> = [ObjectKeys<T>, T[ObjectKeys<T>]][];

type FlatKeys<T> = T extends object
  ? {
      [K in keyof T]: K | (T[K] extends object ? FlatKeys<T[K]> : never);
    }[keyof T]
  : never;

type FlatValues<T, K> = K extends keyof T
  ? T[K]
  : T extends object
  ? {
      [P in keyof T]: T[P] extends object ? FlatValues<T[P], K> : never;
    }[keyof T]
  : never;

export type FlattenObject<T extends ObjectType> = {
  [K in FlatKeys<T>]: FlatValues<T, K>;
};
