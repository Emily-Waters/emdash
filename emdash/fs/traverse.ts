import { Dirent } from "fs";
import fs from "fs/promises";
import path from "path";

export async function traverse(
  dir: string,
  cb: (
    entry: Dirent,
    idx?: number
  ) => "continue" | "break" | void | Promise<"continue" | "break" | void>
): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  let i = 0;

  for (const entry of entries) {
    const directive = await cb(entry, i);

    i++;

    if (directive === "continue") {
      continue;
    } else if (directive === "break") {
      break;
    }

    if (entry.isDirectory()) {
      await traverse(path.join(entry.parentPath, entry.name), cb);
    }
  }
}
