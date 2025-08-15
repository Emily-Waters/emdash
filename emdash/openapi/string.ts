import emdash from "..";
import { SchemaType } from "../validate";
import { AbstractSchema } from "./abstract";

class StringSchema extends AbstractSchema<SchemaType.STRING> {
  constructor() {
    super(SchemaType.STRING);
  }

  schema = {
    type: this.type,
    description: this.description,
  };

  parse(value: unknown): string {
    return emdash.validate.string().parse(value);
  }
}

export function string() {
  return new StringSchema();
}
