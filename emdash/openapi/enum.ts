import emdash from "..";
import { SchemaType } from "../validate";
import { AbstractSchema, OpenApiSchema } from "./abstract";

export class EnumSchema extends AbstractSchema<SchemaType.STRING> {
  constructor(public values: [string, ...string[]]) {
    super(SchemaType.STRING);
  }

  toSchema(): OpenApiSchema<SchemaType.STRING> {
    return {
      type: this.type,
      enum: this.values,
      description: this.description,
    };
  }

  toValidator() {
    return emdash.validate.enums(this.values).describe(this.description);
  }
}

export function enums(values: [string, ...string[]]) {
  return new EnumSchema(values);
}
