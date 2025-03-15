import emdash from "..";
import { SchemaType } from "../validate";
import { AbstractSchema } from "./abstract";

export class ArraySchema<
  TSchemaType extends SchemaType = SchemaType,
  Items extends AbstractSchema<TSchemaType> = AbstractSchema<TSchemaType>
> extends AbstractSchema<SchemaType.ARRAY> {
  constructor(public items: Items) {
    super(SchemaType.ARRAY);
  }

  toSchema() {
    return {
      type: this.type,
      items: this.items.toSchema(),
      description: this.description,
    };
  }

  toValidator() {
    const items = this.items.toValidator();
    return emdash.validate.array(items).describe(this.description);
  }
}

export function array<TSchemaType extends SchemaType, T extends AbstractSchema<TSchemaType>>(
  items: T
): ArraySchema<TSchemaType, T> {
  return new ArraySchema<TSchemaType, T>(items);
}
