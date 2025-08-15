import emdash from "..";
import { SchemaType } from "../validate";
import { AbstractSchema, OpenApiSchema } from "./abstract";

export class EnumSchema extends AbstractSchema<SchemaType.STRING> {
  constructor(public values: [string, ...string[]]) {
    super(SchemaType.STRING);
  }

  schema: OpenApiSchema<SchemaType.STRING> = {
    type: this.type,
    enum: this.values,
    description: this.description,
  };

  parse(value: unknown): string {
    return emdash.validate.enums(this.values).parse(value);
  }
}

export function enums(values: [string, ...string[]]) {
  return new EnumSchema(values);
}
