import emdash from "..";
import { SchemaType } from "../validate";
import { AbstractSchema, OpenApiSchema } from "./abstract";

export class ObjectSchema<
  Def extends Record<string, AbstractSchema> = Record<string, AbstractSchema>
> extends AbstractSchema<SchemaType.OBJECT> {
  constructor(public properties: Def) {
    super(SchemaType.OBJECT);
  }

  schema: OpenApiSchema<SchemaType.OBJECT> = {
    type: this.type,
    properties: Object.fromEntries(
      Object.entries(this.properties).map(([key, value]) => [key, value.schema])
    ),
    required: Object.keys(this.properties).filter((key) => {
      const value = this.properties[key];
      return !value.isOptional && !value.isNullish && !value.isNullable;
    }),
    propertyOrdering: Object.keys(this.properties),
    nullable: this.isNullable,
    description: this.description,
  };

  parse(value: unknown) {
    return emdash.validate.object(this.properties).parse(value);
  }
}

export function object<Properties extends Record<string, AbstractSchema>>(
  properties: Properties
): ObjectSchema<Properties> {
  return new ObjectSchema(properties);
}
