import { isNullish } from "../object";

export type SchemaValueMap<T = any> = {
  [SchemaType.BOOLEAN]: boolean;
  [SchemaType.STRING]: string;
  [SchemaType.NUMBER]: number;
  [SchemaType.INTEGER]: number;
  [SchemaType.ARRAY]: T[];
  [SchemaType.OBJECT]: T;
};

export enum SchemaType {
  STRING = "string",
  NUMBER = "number",
  INTEGER = "integer",
  BOOLEAN = "boolean",
  ARRAY = "array",
  OBJECT = "object",
}

export type InferSchemaType<T extends AbstractSchema> = ReturnType<T["parse"]>;

export abstract class AbstractSchema<T extends SchemaType = SchemaType> {
  description?: string | undefined = undefined;

  constructor(public type: T) {}

  abstract parse(value: unknown): SchemaValueMap[T];

  describe(description?: string) {
    this.description = description;
    return this;
  }

  optional(): OptionalSchema<this> {
    return new OptionalSchema(this);
  }

  nullish(): NullishSchema<this> {
    return new NullishSchema(this);
  }
}

export class OptionalSchema<T extends AbstractSchema> extends AbstractSchema {
  constructor(public schema: T) {
    super(schema.type);
  }

  parse(value: unknown): InferSchemaType<T> | undefined {
    if (value === undefined) {
      return undefined;
    }

    return this.schema.parse(value);
  }
}

export class NullishSchema<T extends AbstractSchema> extends AbstractSchema {
  nullable = true;

  constructor(public schema: T) {
    super(schema.type);
  }

  parse(value: unknown): InferSchemaType<T> | undefined | null {
    if (isNullish(value)) {
      return value;
    }

    return this.schema.parse(value);
  }
}
