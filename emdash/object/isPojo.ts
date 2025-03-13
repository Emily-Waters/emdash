import emdash from "..";

export function isPojo(val: unknown): val is emdash.types.ObjectType {
  return (
    typeof val === "object" &&
    !emdash.object.isNull(val) &&
    Object.getPrototypeOf(val) === Object.prototype
  );
}
