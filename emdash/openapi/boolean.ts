import emdash from "..";
import { SchemaType } from "../validate";
import { AbstractSchema } from "./abstract";

export class BooleanSchema extends AbstractSchema<SchemaType.BOOLEAN> {
  constructor() {
    super(SchemaType.BOOLEAN);
  }

  toSchema(): { type: SchemaType.BOOLEAN; description?: string } {
    return {
      type: this.type,
      description: this.description,
    };
  }

  toValidator() {
    return emdash.validate.boolean().describe(this.description);
  }
}

export function boolean() {
  return new BooleanSchema();
}
