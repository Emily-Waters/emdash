import fs from "fs/promises";
import path from "path";
import { cwd } from "process";
import emdash from "..";
import { indent } from "../string/indent";
import { barrelize } from "./barrelize";

export async function namespace(dir: string) {
  await barrelize(dir);

  dir = path.join(cwd(), dir);

  let indexContent = await fs.readFile(path.join(dir, "index.ts"), "utf8");

  const matches = indexContent.matchAll(/export \* from ".\/([\w]+)";/g);
  let content = [];
  let namespaceContent = [];

  let exports = [];

  for (const match of matches) {
    const name = match[1];
    const alias = `_${name}`;
    const filePath = `"./${name}"`;

    exports.push(name);
    content.push(`import * as ${alias} from ${filePath};`);
    namespaceContent.push(`  export import ${name} = ${alias};`);
  }

  content.push(
    "",
    `export namespace ${path.basename(dir)} {`,
    namespaceContent.join("\n"),
    "}",
    "",
    `export default ${path.basename(dir)};`,
    "",
    `export const {\n${exports.map((ex) => indent(ex)).join(",\n")}\n}` +
      "=" +
      `{\n${exports.map((n) => emdash.string.indent(`${n}: _${n}`)).join(",\n")}\n};`
  );

  await fs.writeFile(path.join(dir, "index.ts"), content.join("\n"));
}
