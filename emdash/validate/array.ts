import { AbstractSchema, InferSchemaType, SchemaType } from "./abstract";

export class ArraySchema<
  Items extends AbstractSchema = AbstractSchema
> extends AbstractSchema<SchemaType.ARRAY> {
  constructor(public items: Items) {
    super(SchemaType.ARRAY);
  }

  parse(value: unknown): InferSchemaType<Items>[] {
    if (Array.isArray(value)) {
      return value.map((item) => this.items.parse(item));
    }

    throw new Error("Invalid value");
  }
}

export function array<Items extends AbstractSchema>(items: Items): ArraySchema<Items> {
  return new ArraySchema(items);
}
