import { AbstractSchema, SchemaType, throwInvalidValueError } from "./abstract";

export class BooleanSchema extends AbstractSchema<SchemaType.BOOLEAN> {
  constructor() {
    super(SchemaType.BOOLEAN);
  }

  parse(value: unknown): boolean {
    if (typeof value === "boolean") {
      return value;
    }

    throwInvalidValueError(value, this);
  }
}

export function boolean() {
  return new BooleanSchema();
}
