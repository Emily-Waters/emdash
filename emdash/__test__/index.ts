// const str = "hello  world";

import emdash from "..";

// const capitalized = emdash.string.capitalize(str);
// const camel = emdash.string.toCamel(str);
// const snake = emdash.string.toSnake(str);
// const kebab = emdash.string.toKebab(str);
// const pascal = emdash.string.toPascal(str);
// const screamingSnake = emdash.string.toScreamingSnake(str);

// const all = { capitalized, camel, snake, kebab, pascal, screamingSnake };
// console.log(all);

// const capCam = emdash.object.pick(all, "capitalized", "camel");
// console.log(capCam);

// const wihoutCapCam = emdash.object.omit(all, "capitalized", "camel");
// console.log(wihoutCapCam);

const x = { foo: 1, bar: "string", baz: [1, 2, 3] };

const schema = emdash.openapi
  .object({
    num: emdash.openapi.number().describe("foo"),
    foo: emdash.openapi.number().optional().describe("foo"),
    bar: emdash.openapi.string().nullish().describe("bar"),
    baz: emdash.openapi.array(emdash.openapi.number()).describe("baz"),
  })
  .describe("object");

const asSchema = schema.toSchema();
console.log(asSchema);

asSchema.properties.baz.items;

const asValidator = schema.toValidator();
console.log(asValidator);

const parsed = asValidator.parse(x);
console.log(parsed);

// const res = schema.send();

// console.log(res);
