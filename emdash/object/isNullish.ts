import emdash from "..";

export function isNullish(val: unknown): val is null | undefined {
  return emdash.object.isUndefined(val) || emdash.object.isNull(val);
}
