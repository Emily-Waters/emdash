import emdash from "..";
import { SchemaType } from "../validate";
import { AbstractSchema, OpenApiSchema } from "./abstract";

export class ArraySchema<
  ItemsType extends SchemaType = SchemaType
> extends AbstractSchema<SchemaType.ARRAY> {
  constructor(public items: AbstractSchema<ItemsType>) {
    super(SchemaType.ARRAY);
  }

  schema: OpenApiSchema<SchemaType.ARRAY> = {
    type: this.type,
    items: this.items,
    description: this.description,
  };

  parse(value: unknown) {
    return emdash.validate.array(this.items).parse(value);
  }
}

export function array<ItemsType extends SchemaType>(
  items: AbstractSchema<ItemsType>
): ArraySchema<ItemsType> {
  return new ArraySchema(items);
}
