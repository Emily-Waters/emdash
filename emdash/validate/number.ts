import { AbstractSchema, SchemaType, throwInvalidValueError } from "./abstract";

export class NumberSchema extends AbstractSchema<SchemaType.NUMBER> {
  constructor() {
    super(SchemaType.NUMBER);
  }

  parse(value: unknown): number {
    if (typeof value === "number") {
      return value;
    }

    throwInvalidValueError(value, this);
  }
}

export function number(): NumberSchema {
  return new NumberSchema();
}
