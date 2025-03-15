import { AbstractSchema, SchemaType } from "./abstract";

export class StringSchema extends AbstractSchema<SchemaType.STRING> {
  constructor() {
    super(SchemaType.STRING);
  }

  parse(value: unknown): string {
    if (typeof value === "string") {
      return value;
    }

    throw new Error("Invalid value");
  }
}

export function string() {
  return new StringSchema();
}
