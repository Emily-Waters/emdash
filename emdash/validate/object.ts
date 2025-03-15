import { isPojo } from "../object";
import { AbstractSchema, InferSchemaType, SchemaType } from "./abstract";

type Properties = Record<string, AbstractSchema>;

export class ObjectSchema<
  Def extends Properties = Properties
> extends AbstractSchema<SchemaType.OBJECT> {
  constructor(public properties: Def) {
    super(SchemaType.OBJECT);
  }

  parse<
    T extends {
      [K in keyof Def]: InferSchemaType<Def[K]>;
    }
  >(value: unknown): T {
    if (isPojo(value)) {
      const result: T = {} as T;

      for (const key in this.properties) {
        const property = this.properties[key];
        const propertyValue = value[key];

        result[key] = property.parse(propertyValue);
      }

      return result;
    }
    throw new Error("Invalid value");
  }
}

export function object<Def extends Properties>(properties: Def): ObjectSchema<Def> {
  return new ObjectSchema(properties);
}
