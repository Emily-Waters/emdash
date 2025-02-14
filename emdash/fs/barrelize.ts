import fs from "fs/promises";
import path from "path";
import { traverse } from "./traverse";

export async function barrelize(dir: string) {
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

    const content = `export * from "./${entry.name.split(".")[0]}";\n`;
    await fs.appendFile(indexPath, content);
  });
}
