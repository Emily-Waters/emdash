import emdash from "..";

export function avg(values: number[]): number {
  return emdash.math.sum(values) / values.length;
}
