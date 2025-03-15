import emdash from "..";
import { SchemaType } from "../validate";
import { AbstractSchema } from "./abstract";

export class NumberSchema extends AbstractSchema<SchemaType.NUMBER> {
  constructor() {
    super(SchemaType.NUMBER);
  }

  toSchema() {
    return {
      type: this.type,
      description: this.description,
    };
  }

  toValidator() {
    return emdash.validate.number().describe(this.description);
  }
}

export function number() {
  return new NumberSchema();
}
