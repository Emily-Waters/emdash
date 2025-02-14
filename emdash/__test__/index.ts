import fs from "fs/promises";
import { traverse } from "fs/traverse";
import path from "path";

traverse(".", async (entry) => {
  const ext = path.extname(entry.name);

  if (ext === ".ts") return "continue";
  if (entry.isDirectory()) return "continue";

  await fs.rm(entry.name);
});
