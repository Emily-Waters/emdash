import { AbstractSchema as AS, Infer, SchemaType } from "../validate";

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
        enum?: SubType;
      }
    : T extends SchemaType.ARRAY
    ? {
        items: SubType;
      }
    : {});

export abstract class AbstractSchema<T extends SchemaType = SchemaType> extends AS<T> {
  schema: OpenApiSchema<T> = { type: this.type, description: this.description } as any;

  optional(): OptionalSchema<this> {
    return new OptionalSchema(this);
  }

  nullish(): NullishSchema<this> {
    return new NullishSchema(this);
  }

  nullable(): NullSchema<this> {
    return new NullSchema(this);
  }
}

class OptionalSchema<T extends AbstractSchema> extends AbstractSchema {
  isOptional = false;

  schema: OpenApiSchema<SchemaType, any> = {
    type: this.type,
    description: this.description,
  } as any;

  constructor(public baseType: T) {
    super(baseType.type);
  }

  parse(value: unknown): Infer<T> | undefined {
    if (value === undefined) {
      return undefined;
    }

    return this.baseType.parse(value);
  }
}

class NullSchema<T extends AbstractSchema> extends AbstractSchema {
  isNullable = true;

  constructor(public baseType: T) {
    super(baseType.type);
  }

  parse(value: unknown): Infer<T> | null {
    if (value === null) {
      return null;
    }

    return this.baseType.parse(value);
  }
}

class NullishSchema<T extends AbstractSchema> extends AbstractSchema {
  isOptional = true;
  isNullable = true;
  isNullish = true;

  constructor(public baseType: T) {
    super(baseType.type);
  }

  parse(value: unknown): Infer<T> | undefined | null {
    if (value === undefined || value === null) {
      return value;
    }

    return this.baseType.parse(value);
  }
}
