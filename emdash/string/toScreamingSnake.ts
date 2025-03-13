type ScreamingSnake<T extends string> = T extends `${infer Head} ${infer Tail}`
  ? Head extends " "
    ? ScreamingSnake<Tail>
    : `${Uppercase<Head>}_${ScreamingSnake<Tail>}`
  : Uppercase<T>;

export function toScreamingSnake<T extends string>(str: T): ScreamingSnake<T> {
  return str.toUpperCase().replace(/\s+/g, "_") as ScreamingSnake<T>;
}
