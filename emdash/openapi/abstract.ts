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

export type OpenApiSchema<T extends emdash.validate.SchemaType = emdash.validate.SchemaType> =
  T extends SchemaType.OBJECT
    ? {
        type: SchemaType.OBJECT;
        description?: string;
        properties: Record<string, OpenApiSchema>;
        propertyOrdering?: string[];
        required?: string[];
      }
    : T extends SchemaType.STRING
    ? {
        type: SchemaType.STRING;
        description?: string;
        enum?: [string, ...string[]];
      }
    : T extends SchemaType.ARRAY
    ? {
        type: SchemaType.ARRAY;
        description?: string;
        items: OpenApiSchema;
      }
    : T extends SchemaType.NUMBER
    ? {
        type: SchemaType.NUMBER;
        description?: string;
      }
    : T extends SchemaType.INTEGER
    ? {
        type: SchemaType.INTEGER;
        description?: string;
      }
    : T extends SchemaType.BOOLEAN
    ? {
        type: SchemaType.BOOLEAN;
        description?: string;
      }
    : never;

export type InferValidator<T extends AbstractSchema> = ReturnType<T["toValidator"]>;
export type InferValidatorReturn<T extends AbstractSchema> = ReturnType<InferValidator<T>["parse"]>;

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
> extends AbstractSchema<TSchemaType> {
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
> extends AbstractSchema<TSchemaType> {
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
