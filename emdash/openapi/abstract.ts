import emdash from "..";
import { SchemaType } from "../validate";

export type SchemaValueMap<T = any> = {
  [SchemaType.BOOLEAN]: boolean;
  [SchemaType.STRING]: string;
  [SchemaType.NUMBER]: number;
  [SchemaType.INTEGER]: number;
  [SchemaType.ARRAY]: T[];
  [SchemaType.OBJECT]: T;
};

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

export type InferSchemaType<T extends AbstractSchema> = ReturnType<T["toSchema"]>;
export type InferValdatorType<T extends AbstractSchema> = ReturnType<T["toValidator"]>;
export abstract class AbstractSchema<
  T extends emdash.validate.SchemaType = emdash.validate.SchemaType
> {
  description?: string | undefined;

  constructor(public type: T) {}

  abstract toSchema(): OpenApiSchema<T>;
  abstract toValidator(): emdash.validate.AbstractSchema<T>;

  describe(description: string) {
    this.description = description;
    return this;
  }

  optional() {
    return new OptionalSchema<T, this>(this);
  }

  nullish() {
    return new NullishSchema<T, this>(this);
  }
}

export class OptionalSchema<
  TSchemaType extends SchemaType,
  T extends AbstractSchema<TSchemaType>
> extends AbstractSchema {
  constructor(public schema: T) {
    super(schema.type);
  }

  toSchema() {
    return this.schema.toSchema();
  }

  toValidator() {
    return this.schema.toValidator().optional();
  }
}

export class NullishSchema<
  TSchemaType extends SchemaType,
  T extends AbstractSchema<TSchemaType>
> extends AbstractSchema {
  constructor(public schema: T) {
    super(schema.type);
  }

  toSchema() {
    return { ...this.schema.toSchema(), nullable: true };
  }

  toValidator() {
    return this.schema.toValidator().nullish();
  }
}
