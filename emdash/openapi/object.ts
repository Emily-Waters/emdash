import emdash from "..";
import { SchemaType } from "../validate";
import { AbstractSchema, NullishSchema, OpenApiSchema, OptionalSchema } from "./abstract";

export class ObjectSchema<
  Def extends Record<string, AbstractSchema> = Record<string, AbstractSchema>
> extends AbstractSchema<SchemaType.OBJECT> {
  constructor(public properties: Def) {
    super(SchemaType.OBJECT);
  }

  toSchema(): OpenApiSchema<
    SchemaType.OBJECT,
    { [K in keyof Def]: emdash.openapi.InferSchemaType<Def[K]> }
  > {
    const entries = emdash.object.entries(this.properties);

    let required: string[] = [];

    const properties = Object.fromEntries(
      entries.map(([key, value]) => {
        const isOptional = value instanceof OptionalSchema;
        const isNullish = value instanceof NullishSchema;

        if (!isOptional && !isNullish) required.push(key);

        return [key, value.toSchema()];
      })
    ) as { [K in keyof Def]: emdash.openapi.InferSchemaType<Def[K]> };

    return {
      type: this.type,
      properties,
      description: this.description,
      required,
    };
  }

  toValidator() {
    const entries = emdash.object.entries(this.properties);

    const properties = Object.fromEntries(
      entries.map(([key, value]) => [key, value.toValidator()])
    ) as { [K in keyof Def]: emdash.openapi.InferValdatorType<Def[K]> };

    return emdash.validate.object(properties).describe(this.description);
  }
}

export function object<Def extends Record<string, AbstractSchema>>(
  properties: Def
): ObjectSchema<Def> {
  return new ObjectSchema(properties);
}
