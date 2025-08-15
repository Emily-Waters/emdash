import { AbstractSchema as AS, SchemaType } from "../validate";

type CommonSchema<T> = {
  type: T;
  nullable?: boolean;
  description?: string;
};

export type OpenApiSchema<T extends SchemaType, SubType = any> = CommonSchema<T> &
  (T extends SchemaType.OBJECT
    ? {
        properties: SubType;
        propertyOrdering?: string[];
        required?: string[];
      }
    : T extends SchemaType.STRING
    ? {
        enum?: [string, ...string[]];
      }
    : T extends SchemaType.ARRAY
    ? {
        items: SubType;
      }
    : {});

export abstract class AbstractSchema<T extends SchemaType = SchemaType> extends AS<T> {
  abstract schema: OpenApiSchema<T>;
}
