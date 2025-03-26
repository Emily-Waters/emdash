// @ts-nocheck
type BuildNumberRange<
  Current extends number,
  Min extends number,
  Max extends number,
  Accumulated extends number[] = []
> = Current extends Max
  ? [...Accumulated, Max]
  : Accumulated[number] extends Min
  ? BuildNumberRange<[...Accumulated, Current]["length"], Min, Max, [...Accumulated, Current]>
  : BuildNumberRange<[...Accumulated, Current]["length"], Min, Max, [...Accumulated, Current]>;

export type NumberRange<Min extends number, Max extends number> = BuildNumberRange<
  Min,
  Min,
  Max
>[number];
