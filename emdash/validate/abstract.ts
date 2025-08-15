import emdash from "..";

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

export type Infer<T extends AbstractSchema> = ReturnType<T["parse"]>;

export abstract class AbstractSchema<
  T extends emdash.validate.SchemaType = emdash.validate.SchemaType
> {
  description?: string | undefined;

  isOptional?: boolean | undefined;
  isNullish?: boolean | undefined;
  isNullable?: boolean | undefined;

  constructor(public type: T) {}

  abstract parse(value: unknown): SchemaValueMap[T];

  describe(description: string) {
    this.description = description;
    return this;
  }

  optional() {
    return new OptionalSchema(this);
  }

  null() {
    return new NullSchema(this);
  }

  nullish() {
    return new NullishSchema(this);
  }

  protected throwInvalidValueError(value: unknown): never {
    throw new Error(
      `Invalid value, expected ${this.type} but received ${typeof value}: ${JSON.stringify(
        value,
        null,
        2
      )}`
    );
  }
}

class OptionalSchema<T extends AbstractSchema> extends AbstractSchema {
  isOptional = false;

  constructor(public schema: T) {
    super(schema.type);
  }

  parse(value: unknown): Infer<T> | undefined {
    if (value === undefined) {
      return undefined;
    }

    return this.schema.parse(value);
  }
}

class NullSchema<T extends AbstractSchema> extends AbstractSchema {
  isNullable = true;

  constructor(public schema: T) {
    super(schema.type);
  }

  parse(value: unknown): Infer<T> | null {
    if (value === null) {
      return null;
    }

    return this.schema.parse(value);
  }
}

class NullishSchema<T extends AbstractSchema> extends AbstractSchema {
  isOptional = true;
  isNullable = true;
  isNullish = true;

  constructor(public schema: T) {
    super(schema.type);
  }

  parse(value: unknown): Infer<T> | undefined | null {
    if (value === undefined || value === null) {
      return value;
    }

    return this.schema.parse(value);
  }
}
