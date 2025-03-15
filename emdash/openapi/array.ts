import emdash from "..";
import { SchemaType } from "../validate";
import { AbstractSchema, OpenApiSchema } from "./abstract";

export class ArraySchema<
  ItemsType extends SchemaType = SchemaType
> extends AbstractSchema<SchemaType.ARRAY> {
  constructor(public items: AbstractSchema<ItemsType>) {
    super(SchemaType.ARRAY);
  }

  toSchema(): OpenApiSchema<SchemaType.ARRAY, ItemsType> {
    return {
      type: this.type,
      items: this.items.toSchema() as any,
      description: this.description,
    };
  }

  toValidator() {
    const items = this.items.toValidator();
    return emdash.validate.array(items).describe(this.description);
  }
}

export function array<ItemsType extends SchemaType>(
  items: AbstractSchema<ItemsType>
): ArraySchema<ItemsType> {
  return new ArraySchema(items);
}
