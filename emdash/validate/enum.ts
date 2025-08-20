import { AbstractSchema, SchemaType, throwInvalidValueError } from "./abstract";

export class EnumSchema<T extends string[]> extends AbstractSchema<SchemaType.STRING> {
  constructor(public values: T) {
    super(SchemaType.STRING);
  }

  parse(value: unknown): T[number] {
    if (typeof value === "string") {
      if (this.values.includes(value as any)) {
        return value as T[number];
      }
    }

    throwInvalidValueError(value, this);
  }
}

export function enums<T extends string[]>(values: T) {
  return new EnumSchema(values);
}
