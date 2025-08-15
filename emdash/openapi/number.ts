import emdash from "..";
import { SchemaType } from "../validate";
import { AbstractSchema, OpenApiSchema } from "./abstract";

export class NumberSchema extends AbstractSchema<SchemaType.NUMBER> {
  constructor() {
    super(SchemaType.NUMBER);
  }

  schema: OpenApiSchema<SchemaType.NUMBER> = {
    type: this.type,
    description: this.description,
  };

  parse(value: unknown): number {
    return emdash.validate.number().parse(value);
  }
}

export function number() {
  return new NumberSchema();
}
