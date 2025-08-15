import { AbstractSchema, SchemaType } from "./abstract";

class StringSchema extends AbstractSchema<SchemaType.STRING> {
  constructor() {
    super(SchemaType.STRING);
  }

  parse(value: unknown): string {
    if (typeof value === "string") {
      return value;
    }

    this.throwInvalidValueError(value);
  }
}

export function string() {
  return new StringSchema();
}
