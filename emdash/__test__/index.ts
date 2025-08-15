// // const str = "hello  world";

import emdash from "..";

// import emdash from "..";

const str = "hello world";

const capitalized = emdash.string.capitalize(str);
const camel = emdash.string.toCamel(str);
const snake = emdash.string.toSnake(str);
const kebab = emdash.string.toKebab(str);
const pascal = emdash.string.toPascal(str);
const screamingSnake = emdash.string.toScreamingSnake(str);

const all = { capitalized, camel, snake, kebab, pascal, screamingSnake };
console.log(all);

const capCam = emdash.object.pick(all, "capitalized", "camel");
console.log(capCam);

const wihoutCapCam = emdash.object.omit(all, "capitalized", "camel");
console.log(wihoutCapCam);

// const x = { foo: 1, bar: "string", baz: [1, 2, 3] };

const schema = emdash.openapi
  .object({
    num: emdash.openapi.number().describe("foo"),
    foo: emdash.openapi.number().nullish().describe("foo"),
    bar: emdash.openapi.string().nullish().describe("bar"),
    baz: emdash.openapi.array(emdash.openapi.number()).describe("baz"),
    bag: emdash.openapi.array(emdash.openapi.number()).describe("bag"),
    qux: emdash.openapi.array(emdash.openapi.string().optional()).describe("qux"),
  })
  .describe("object");

console.log(
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  schema.parse({
    num: 1,
    foo: undefined,
    bar: null,
    baz: [1, 2, 3],
    bag: [undefined, 1, null],
    qux: ["a", "b", "c"],
  })
);

type Output = emdash.validate.Infer<typeof schema>;

// // const foo = emdash.openapi.number().optional().describe("foo");

// // const fooSchema = foo.toSchema();
// // console.log(fooSchema);

// // const fooValidator = foo.toValidator();
// // console.log(fooValidator);

// // const fooParsed = fooValidator.parse(undefined);
// // console.log(fooParsed);

// const asSchema = schema.toSchema();
// console.log(asSchema);

// const asValidator = schema.toValidator();
// // console.log(asValidator);
// const parsed = asValidator.parse(x);

// console.log(parsed);
