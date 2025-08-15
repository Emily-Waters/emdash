import emdash from "..";
import { Infer, SchemaType } from "../validate";
import { AbstractSchema, OpenApiSchema } from "./abstract";

export class ArraySchema<Items extends AbstractSchema> extends AbstractSchema<SchemaType.ARRAY> {
  constructor(public items: Items) {
    super(SchemaType.ARRAY);
  }

  schema: OpenApiSchema<SchemaType.ARRAY> = {
    type: this.type,
    items: this.items.schema,
    description: this.description,
  };

  parse(value: unknown): Infer<Items>[] {
    return emdash.validate.array(this.items).parse(value);
  }
}

export function array<Items extends AbstractSchema>(items: Items): ArraySchema<Items> {
  return new ArraySchema(items);
}
