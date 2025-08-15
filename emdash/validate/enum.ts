import { AbstractSchema, SchemaType, throwInvalidValueError } from "./abstract";

export class EnumSchema<
  T extends [string, ...string[]] = [string, ...string[]]
> extends AbstractSchema<SchemaType.STRING> {
  constructor(public values: T) {
    super(SchemaType.STRING);
  }

  parse(value: unknown): T[number] {
    if (typeof value === "string") {
      if (this.values.includes(value)) {
        return value;
      }
    }

    throwInvalidValueError(value, this);
  }
}

export function enums<T extends [string, ...string[]]>(values: [...T]) {
  return new EnumSchema(values);
}
