export function arrayFrom(value: number) {
  return Array.from({ length: value }).map((_, idx) => idx);
}
