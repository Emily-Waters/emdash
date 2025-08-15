import emdash from "..";
import { SchemaType } from "../validate";
import { AbstractSchema, OpenApiSchema } from "./abstract";

class BooleanSchema extends AbstractSchema<SchemaType.BOOLEAN> {
  constructor() {
    super(SchemaType.BOOLEAN);
  }

  schema: OpenApiSchema<SchemaType.BOOLEAN> = {
    type: this.type,
    description: this.description,
  };

  parse(value: unknown) {
    return emdash.validate.boolean().parse(value);
  }
}

export function boolean() {
  return new BooleanSchema();
}
