type Kebab<T extends string> = T extends `${infer Head} ${infer Tail}`
  ? Head extends " "
    ? Kebab<Tail>
    : `${Uncapitalize<Head>}-${Kebab<Tail>}`
  : Uncapitalize<T>;

export function toKebab<T extends string>(str: T): Kebab<T> {
  return str.trim().replace(/\s+/g, "-").toLowerCase() as Kebab<T>;
}
