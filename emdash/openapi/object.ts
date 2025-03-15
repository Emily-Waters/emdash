import emdash from "..";
import { SchemaType } from "../validate";
import { AbstractSchema, NullishSchema, OpenApiSchema, OptionalSchema } from "./abstract";

type Properties = Record<string, AbstractSchema>;

export class ObjectSchema<
  Def extends Properties = Properties
> extends AbstractSchema<SchemaType.OBJECT> {
  constructor(public properties: Def) {
    super(SchemaType.OBJECT);
  }

  toSchema() {
    const entries = emdash.object.toEntries(this.properties);

    let required: string[] = [];

    const properties = Object.fromEntries(
      entries.map(([key, value]) => {
        const isOptional = value instanceof OptionalSchema;
        const isNullish = value instanceof NullishSchema;

        if (!isOptional && !isNullish) required.push(key);

        return [key, value.toSchema()];
      })
    ) as { [K in keyof Def]: OpenApiSchema<Def[K]["type"]> };

    return {
      type: this.type,
      properties,
      description: this.description,
      required,
    };
  }

  toValidator() {
    const entries = emdash.object.toEntries(this.properties);

    const properties = Object.fromEntries(
      entries.map(([key, value]) => [key, value.toValidator()])
    ) as { [K in keyof Def]: emdash.validate.AbstractSchema<Def[K]["type"]> };

    return emdash.validate.object(properties).describe(this.description);
  }
}

export function object<Def extends Properties>(properties: Def): ObjectSchema<Def> {
  return new ObjectSchema(properties);
}
