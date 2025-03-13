import emdash from "..";

type Pascal<T extends string> = T extends `${infer Head} ${infer Tail}`
  ? Head extends " "
    ? Pascal<Tail>
    : `${Capitalize<Head>}${Pascal<Tail>}`
  : Capitalize<T>;

export function toPascal<T extends string>(str: T): Pascal<T> {
  return emdash.string.capitalize(str).replace(/\s+/g, "") as Pascal<T>;
}
