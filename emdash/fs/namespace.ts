import fs from "fs/promises";
import path from "path";
import { cwd } from "process";
import { traverse } from "./traverse";

export async function namespace(dir: string) {
  await traverse(dir, async (entry, idx) => {
    const indexPath = path.join(entry.parentPath, "index.ts");
    if (idx === 0) {
      await fs
        .access(indexPath)
        .then(() => fs.unlink(indexPath))
        .catch(() => {});
    }

    if (entry.name === "index.ts") return "continue";
    if (entry.name.startsWith(".")) return "continue";
    if (entry.name.startsWith("__")) return "continue";

    const fileName = entry.name.split(".")[0];
    const content = `import { ${fileName} as _${fileName} } from "./${fileName}";\n`;

    await fs.appendFile(indexPath, content);
  });

  await traverse(dir, async (entry, idx) => {
    if (entry.isDirectory()) return;
    if (entry.name.startsWith(".")) return "continue";
    if (entry.name.startsWith("__")) return "continue";
    if (entry.name !== "index.ts") return "continue";

    const indexPath = path.join(entry.parentPath, "index.ts");
    const namespace = path.basename(entry.parentPath);

    let content = await fs.readFile(indexPath, "utf-8");

    content += `\nnamespace ${namespace} {\n`;

    const aliases = content.matchAll(/([\w]+) as (_[\w]+)/g);

    for (const alias of aliases) {
      const [_, name, _alias] = alias;
      content += `  export const ${name} = ${_alias};\n`;
    }

    content += "}\n\n";

    if (dir === entry.parentPath) {
      content += `export default ${namespace};`;
    } else {
      content += `export { ${namespace} };`;
    }
    await fs.writeFile(indexPath, content);
  });
}

namespace(path.join(cwd(), "emdash"));
