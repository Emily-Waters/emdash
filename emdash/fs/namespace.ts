import fs from "fs/promises";
import path from "path";
import { cwd } from "process";
import emdash from "..";

export async function namespace(dir: string) {
  await emdash.fs.barrelize(dir);

  dir = path.join(cwd(), dir);

  let indexContent = await fs.readFile(path.join(dir, "index.ts"), "utf8");

  const matches = indexContent.matchAll(/export \* from ".\/([\w]+)";/g);
  let imports = [];
  let namespaces = [];
  let exports = [];
  let aliases = [];

  for (const match of matches) {
    const name = match[1];
    const alias = `_${name}`;
    const filePath = `"./${name}"`;

    imports.push(`import * as ${alias} from ${filePath};`);
    exports.push(emdash.string.indent(name));
    aliases.push(emdash.string.indent(`${name}: ${alias}`));
    namespaces.push(emdash.string.indent(`export import ${name} = ${alias};`));
  }

  namespaces = [`export namespace ${path.basename(dir)} {`, ...namespaces, "}"];
  exports = ["export const {", exports.join(",\n"), "} = {", aliases.join(",\n"), "};"];
  const defaultExport = `export default ${path.basename(dir)};`;

  await fs.writeFile(
    path.join(dir, "index.ts"),
    [imports.join("\n"), namespaces.join("\n"), exports.join("\n"), defaultExport].join("\n\n")
  );
}
