import emdash from "..";
import { SchemaType } from "../validate";
import { AbstractSchema, OpenApiSchema } from "./abstract";

export class NumberSchema extends AbstractSchema<SchemaType.NUMBER> {
  constructor() {
    super(SchemaType.NUMBER);
  }

  toSchema(): OpenApiSchema<SchemaType.NUMBER> {
    return { type: SchemaType.NUMBER, description: this.description };
  }

  toValidator() {
    return emdash.validate.number().describe(this.description);
  }
}

export function number() {
  return new NumberSchema();
}
