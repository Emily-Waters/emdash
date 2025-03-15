// import emdash from "..";
// import { AbstractSchema, SchemaType } from "../validate";

// type CommonSchema = {
//   description?: string;
//   nullable?: boolean;
// };

// const is = {
//   string: (value: unknown): value is emdash.validate.StringSchema =>
//     value instanceof emdash.validate.StringSchema,
//   number: (value: unknown): value is emdash.validate.NumberSchema =>
//     value instanceof emdash.validate.NumberSchema,
//   object: (value: unknown): value is emdash.validate.ObjectSchema =>
//     value instanceof emdash.validate.ObjectSchema,
//   array: (value: unknown): value is emdash.validate.ArraySchema =>
//     value instanceof emdash.validate.ArraySchema,
//   boolean: (value: unknown): value is emdash.validate.BooleanSchema =>
//     value instanceof emdash.validate.BooleanSchema,
//   enum: (value: unknown): value is emdash.validate.EnumSchema =>
//     value instanceof emdash.validate.EnumSchema,
//   abstract: (value: unknown): value is emdash.validate.AbstractSchema =>
//     value instanceof emdash.validate.AbstractSchema,
//   optional: (value: unknown): value is emdash.validate.OptionalSchema =>
//     value instanceof emdash.validate.OptionalSchema,
//   nullish: (value: unknown): value is emdash.validate.NullishSchema =>
//     value instanceof emdash.validate.NullishSchema,
// };

// type InferSchema<T extends AbstractSchema> = Schema<T["type"]>;
// type InferValidatorFromSchema<T extends Schema> = emdash.validate.AbstractSchema<T["type"]>;

// export function schema<T extends emdash.validate.AbstractSchema | Schema>(def: T) {
//   function toValidator<T extends Schema>(def: T): InferValidatorFromSchema<T> {
//     switch (def.type) {
//       case SchemaType.STRING:
//         if ("enum" in def && def.enum) {
//           return emdash.validate.enums(def.enum);
//         }

//         return emdash.validate.string();
//       case SchemaType.NUMBER:
//         return emdash.validate.number();
//       case SchemaType.OBJECT:
//         const hasProperties = "properties" in def && def.properties;

//         if (!hasProperties) {
//           throw new Error("Invalid schema type");
//         }

//         const properties = {} as any;

//         for (const key in def.properties) {
//           const property = def.properties[key];
//           properties[key] = toValidator(property);
//         }

//         return emdash.validate.object(properties);
//       case SchemaType.ARRAY:
//         const hasItems = "items" in def && def.items;

//         if (!hasItems) {
//           throw new Error("Invalid schema type");
//         }

//         const items = toValidator(def.items as Schema);

//         return emdash.validate.array(items);
//       case SchemaType.BOOLEAN:
//         return emdash.validate.boolean();
//     }
//   }
//   function toSchema<TSchema extends AbstractSchema>(
//     def: T,
//     nullable?: boolean
//   ): InferSchema<TSchema> {
//     if (!is.abstract(def)) {
//       throw new Error("Invalid schema type");
//     }

//     let value = {
//       type: def.type,
//       nullable,
//       description: def.description,
//     };

//     switch (true) {
//       case is.enum(def):
//         return value;

//       // return {
//       //   type: def.type,
//       //   enum: def.values,
//       //   nullable,
//       //   description: def.description,
//       // };

//       case is.optional(def):
//         return toSchema(def.schema);

//       case is.nullish(def):
//         return toSchema(def.schema, true);

//       case is.object(def):
//         const properties = {} as any;
//         let required: string[] = [];

//         for (const key in def.properties) {
//           const property = def.properties[key];
//           properties[key] = toSchema(property);

//           if (!is.optional(property)) {
//             required.push(key);
//           }
//         }

//         return {
//           type: def.type,
//           properties,
//           nullable,
//           description: def.description,
//         };

//       case is.array(def):
//         return {
//           type: def.type,
//           items: toSchema(def.items),
//           nullable,
//           description: def.description,
//         };

//       default:
//         return {
//           type: def.type,
//           nullable,
//           description: def.description,
//         };
//     }
//   }

//   return {
//     send() {
//       return toSchema(def);
//     },
//   };
// }

// // export function schemaConverter<T extends SchemaType>(schema?: any) {
// //   function toString() {
// //     return JSON.stringify(schemaConverter(schema).toSchema(), null, 2);
// //   }

// //   function toZod({ isOptional, isNullable }: { isOptional?: boolean; isNullable?: boolean } = {}) {
// //     if (!schema) {
// //       return;
// //     }

// //     if (typeof schema === "string") {
// //       try {
// //         schema = JSON.parse(schema);
// //       } catch (error) {
// //         console.error("Error parsing schema string:", error);
// //         return z.any(); // Or throw an error, depending on your error handling strategy
// //       }
// //     }

// //     if (zodType.isZodType(schema)) {
// //       return schema;
// //     }

// //     if (schema.type === "object" && schema.properties && schema.properties.workflow) {
// //       return z.object({ workflow: schemaConverter(schema.properties.workflow).toZod({ isOptional, isNullable }) });
// //     }

// //     let value: ZodSchemaTypes | undefined;
// //     let description = schema.description;

// //     switch (schema.type) {
// //       case SchemaType.OBJECT:
// //         const zodShape: ZodRawShape = {};
// //         const required: string[] = schema.required || [];

// //         for (const key in schema.properties) {
// //           const property = schema.properties[key];
// //           const isOptional = !required.includes(key);
// //           const isNullable = property.nullable;
// //           zodShape[key] = schemaConverter(property).toZod({ isOptional, isNullable });
// //         }

// //         value = z.object(zodShape);
// //         break;
// //       case SchemaType.ARRAY:
// //         value = z.array(schemaConverter(schema.items).toZod());
// //         break;
// //       case SchemaType.STRING:
// //         if (schema.enum) {
// //           value = z.enum(schema.enum);
// //         } else {
// //           value = z.string();
// //         }
// //         break;
// //       case SchemaType.NUMBER:
// //         value = z.number();
// //         break;
// //       case SchemaType.BOOLEAN:
// //         value = z.boolean();
// //         break;

// //       case SchemaType.INTEGER:
// //         value = z.number().int();
// //         break;
// //     }

// //     if (!value) {
// //       throw new Error("Invalid schema type");
// //     }

// //     if (isNullable) {
// //       value = value.nullable();
// //     }

// //     if (isOptional) {
// //       value = value.optional();
// //     }

// //     if (description) {
// //       value.describe(description);
// //     }

// //     return value;
// //   }

// //   function toSchema(currentDepth = 0, { isNullable, isOptional }: { isNullable?: boolean; isOptional?: boolean } = {}) {
// //     if (!schema) {
// //       return;
// //     }

// //     if (typeof schema === "string") {
// //       return JSON.parse(schema) as ExtendedSchema<T>;
// //     }

// //     if (!zodType.isZodType(schema)) {
// //       return schema;
// //     }

// //     if (currentDepth >= MAX_DEPTH && zodType.isObject(schema)) {
// //       schema = schema.omit({ nested: true });
// //     }

// //     let value: Partial<ExtendedSchema<SchemaType>> | undefined;

// //     switch (true) {
// //       case zodType.isLazy(schema): {
// //         const lazy = schema._def;
// //         value = schemaConverter(lazy.getter()).toSchema(currentDepth + 1, { isNullable, isOptional });
// //         break;
// //       }
// //       case zodType.isUnion(schema):
// //         const union = schema._def;
// //         const schemas = union.options
// //           .map((option) => schemaConverter(option).toSchema(currentDepth + 1, { isNullable, isOptional }))
// //           .filter(Boolean);

// //         value = {
// //           type: SchemaType.OBJECT,
// //           properties: {
// //             a: schemas[0],
// //             b: schemas[1],
// //           },
// //         };

// //         break;
// //       case zodType.isObject(schema):
// //         const properties: Record<string, any> = {};
// //         let required: string[] | undefined;

// //         for (const key in schema.shape) {
// //           const value = schema.shape[key];
// //           properties[key] = schemaConverter(value).toSchema(currentDepth);

// //           if (!zodType.isOptional(value)) {
// //             if (!required) {
// //               required = [];
// //             }
// //             required.push(key);
// //           }
// //         }

// //         value = {
// //           type: SchemaType.OBJECT,
// //           properties,
// //           required,
// //         };
// //         break;
// //       case zodType.isNullable(schema):
// //         value = schemaConverter(schema._def.innerType).toSchema(currentDepth, { isOptional, isNullable: true });
// //         break;
// //       case zodType.isArray(schema):
// //         value = {
// //           type: SchemaType.ARRAY,
// //           items: schemaConverter(schema._def.type).toSchema(currentDepth + 1),
// //         };
// //         break;
// //       case zodType.isString(schema):
// //         value = {
// //           type: SchemaType.STRING,
// //         };
// //         break;
// //       case zodType.isNumber(schema):
// //         const isInteger = schema._def.checks?.some((check) => check.kind === "int");
// //         value = {
// //           type: isInteger ? SchemaType.INTEGER : SchemaType.NUMBER,
// //         };
// //         break;
// //       case zodType.isBoolean(schema):
// //         value = {
// //           type: SchemaType.BOOLEAN,
// //         };
// //         break;
// //       case zodType.isEnum(schema):
// //         value = {
// //           type: SchemaType.STRING,
// //           enum: schema._def.values,
// //         };
// //         break;
// //       case zodType.isOptional(schema):
// //         value = schemaConverter(schema.unwrap()).toSchema(currentDepth, { isNullable, isOptional: true });
// //         break;
// //     }

// //     if (!value) {
// //       throw new Error("Invalid schema type ");
// //     }

// //     if (isNullable) {
// //       value.nullable = true;
// //     }

// //     if (schema?.description) {
// //       value.description = schema.description;
// //     }

// //     return value as ExtendedSchema<SchemaType>;
// //   }

// //   return { toZod, toSchema, toString };
// // }

// // export function lines(lines: (string | undefined)[], space = 2) {
// //   return lines.filter(Boolean).join(space ? "\n".repeat(space) : " ");
// // }

// // export function list(title: string, ...rules: string[]) {
// //   return lines([`### ${title}:`, ...rules.map((rule) => `- ${rule}`)], 1);
// // }

// // export function jsonString(content: string) {
// //   return `\`\`\`json\n${content}\n\`\`\``;
// // }

export const { x } = { x: 1 };
