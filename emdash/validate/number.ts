import { AbstractSchema, SchemaType } from "./abstract";

export class NumberSchema extends AbstractSchema<SchemaType.NUMBER> {
  constructor() {
    super(SchemaType.NUMBER);
  }

  parse(value: unknown): number {
    if (typeof value === "number") {
      return value;
    }

    this.throwInvalidValueError(value);
  }
}

export function number(): NumberSchema {
  return new NumberSchema();
}
