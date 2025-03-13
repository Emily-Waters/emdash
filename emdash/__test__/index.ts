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

const examplePattern = "**/emdash/array/*.ts";

(async () => {
  console.log("Globbing...");

  const res = await emdash.fs.globFirst(examplePattern);
  console.log({ res });

  const perf = await emdash.performance.benchmark({
    // traverse: async () => {
    //   await emdash.fs.traverse(cwd(), () => {});
    // },
    // globGenerator: async () => {
    //   for await (const entry of emdash.fs.globGenerator(examplePattern)) {
    //   }
    // },
    // glob: async () => emdash.fs.glob(examplePattern),
    globFirst: async () => emdash.fs.globFirst(examplePattern),
  });

  console.table(...perf);
})();
