type Capitalized<T extends string> = T extends `${infer Head} ${infer Tail}`
  ? `${Capitalize<Head>} ${Capitalized<Tail>}`
  : Capitalize<T>;

export function capitalize<T extends string>(str: T): Capitalized<T> {
  return str
    .split(" ")
    .reduce((acc, cur) => {
      return [...acc, cur.charAt(0).toUpperCase() + cur.slice(1)];
    }, [] as string[])
    .join(" ") as Capitalized<T>;
}
