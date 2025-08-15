import { AbstractSchema, SchemaType } from "./abstract";

export class BooleanSchema extends AbstractSchema<SchemaType.BOOLEAN> {
  constructor() {
    super(SchemaType.BOOLEAN);
  }

  parse(value: unknown): boolean {
    if (typeof value === "boolean") {
      return value;
    }

    this.throwInvalidValueError(value);
  }
}

export function boolean() {
  return new BooleanSchema();
}
