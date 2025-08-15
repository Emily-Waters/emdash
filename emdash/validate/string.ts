import { AbstractSchema, SchemaType, throwInvalidValueError } from "./abstract";

class StringSchema extends AbstractSchema<SchemaType.STRING> {
  constructor() {
    super(SchemaType.STRING);
  }

  parse(value: unknown): string {
    if (typeof value === "string") {
      return value;
    }

    throwInvalidValueError(value, this);
  }
}

export function string() {
  return new StringSchema();
}
