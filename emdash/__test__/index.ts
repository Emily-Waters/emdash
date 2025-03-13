import emdash from "..";

const str = "hello  world";

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

const examplePattern = "**/emdash/**/*.ts";

(async () => {
  console.log("Globbing files...");
  for await (const entry of emdash.fs.glob(examplePattern)) {
    console.log(entry);
  }
})();
