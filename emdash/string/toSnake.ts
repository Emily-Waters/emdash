type Snake<T extends string> = T extends `${infer Head} ${infer Tail}`
  ? Head extends " "
    ? Snake<Tail>
    : `${Uncapitalize<Head>}_${Snake<Tail>}`
  : Uncapitalize<T>;

export function toSnake<T extends string>(str: T): Snake<T> {
  return str.trim().replace(/\s+/g, "_").toLowerCase() as Snake<T>;
}
