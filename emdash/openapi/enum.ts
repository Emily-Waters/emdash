import emdash from "..";
import { SchemaType } from "../validate";
import { AbstractSchema, OpenApiSchema } from "./abstract";

export class EnumSchema<T extends string[]> extends AbstractSchema<SchemaType.STRING> {
  constructor(public values: T) {
    super(SchemaType.STRING);
  }

  schema: OpenApiSchema<SchemaType.STRING, T> = {
    type: this.type,
    enum: this.values,
    description: this.description,
  };

  parse(value: unknown) {
    return emdash.validate.enums(this.values).parse(value);
  }
}

export function enums<T extends string[]>(values: T) {
  return new EnumSchema(values);
}
