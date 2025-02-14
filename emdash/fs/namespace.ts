import fs from "fs/promises";
import path from "path";
import { cwd } from "process";
import { barrelize } from "./barrelize";

export async function namespace(dir: string) {
  await barrelize(dir);
  dir = path.join(cwd(), dir);

  let indexContent = await fs.readFile(path.join(dir, "index.ts"), "utf8");

  const matches = indexContent.matchAll(/export \* from ".\/([\w]+)";/g);
  let content = [];
  let namespaceContent = [];

  for (const match of matches) {
    content.push(`import * as _${match[1]} from "./${match[1]}";`);
    namespaceContent.push(`  export const ${match[1]} = _${match[1]};`);
  }

  content.push(
    `export namespace ${path.basename(dir)} {`,
    namespaceContent.join("\n"),
    "}",
    "",
    `export default ${path.basename(dir)};`
  );

  await fs.writeFile(path.join(dir, "index.ts"), content.join("\n"));
}
