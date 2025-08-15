import { AbstractSchema, Infer, SchemaType } from "./abstract";

export class ArraySchema<
  Items extends AbstractSchema = AbstractSchema
> extends AbstractSchema<SchemaType.ARRAY> {
  constructor(public items: Items) {
    super(SchemaType.ARRAY);
  }

  parse(value: unknown): Infer<Items>[] {
    if (Array.isArray(value)) {
      const returnValues: Infer<Items>[] = [];

      for (let i = 0; i < value.length; i++) {
        try {
          const val = this.items.parse(value[i]);
          returnValues.push(val);
        } catch (error) {
          throw new Error(
            `Invalid value at index ${i}: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }
      return returnValues;
    }

    this.throwInvalidValueError(value);
  }
}

export function array<Items extends AbstractSchema>(items: Items): ArraySchema<Items> {
  return new ArraySchema(items);
}
