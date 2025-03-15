import emdash from "..";
import { SchemaType } from "../validate";
import { AbstractSchema } from "./abstract";

export class StringSchema extends AbstractSchema<SchemaType.STRING> {
  constructor() {
    super(SchemaType.STRING);
  }

  toSchema() {
    return {
      type: this.type,
      description: this.description,
    };
  }

  toValidator() {
    return emdash.validate.string().describe(this.description);
  }
}

export function string() {
  return new StringSchema();
}
