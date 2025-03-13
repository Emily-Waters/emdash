import emdash from "..";

type Camel<T extends string> = T extends `${infer Head} ${infer Tail}`
  ? Head extends " "
    ? Capitalize<Camel<Tail>>
    : `${Head}${Capitalize<Camel<Tail>>}`
  : T;

export function toCamel<T extends string>(str: T): Camel<T> {
  return str
    .split(" ")
    .reduce((acc, cur, idx) => {
      if (idx) return [...acc, emdash.string.capitalize(cur)];
      return [...acc, cur];
    }, [] as string[])
    .join("") as Camel<T>;
}
