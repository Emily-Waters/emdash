import { Dirent } from "fs";
import fs from "fs/promises";
import path from "path";
import emdash from "..";

/**
 * Recursively traverses a directory and applies a callback function to each entry.
 *
 * @param dir - The directory path to traverse.
 * @param cb - A callback function invoked for each directory entry. The callback can return:
 *   - `"continue"` to skip further processing of the current entry.
 *   - `"break"` to stop the traversal entirely.
 *   - `void` or a Promise resolving to any of the above.
 * @param options - Optional configuration for the traversal:
 *   - `concurrency` (default: 4): The maximum number of directories to process concurrently.
 *   - `skipHidden` (default: true): Whether to skip hidden files and directories (those starting with a dot).
 *
 * @returns A Promise that resolves when the traversal is complete.
 *
 * @remarks
 * - If `options.concurrency` is greater than 1, the traversal of subdirectories is parallelized
 *   up to the specified concurrency level.
 * - Hidden files and directories are filtered out by default unless `options.skipHidden` is set to `false`.
 * - The callback function can be asynchronous and return a Promise.
 *
 * @example
 * ```typescript
 * import { traverse } from "./fs/traverse";
 *
 * async function example() {
 *   await traverse("/path/to/dir", async (entry) => {
 *     console.log(entry.name);
 *     if (entry.isDirectory()) {
 *       return "continue";
 *     }
 *   }, { concurrency: 2, skipHidden: false });
 * }
 * ```
 */
export async function traverse(
  dir: string,
  cb: (
    entry: Dirent,
    idx?: number
  ) => "continue" | "break" | void | Promise<"continue" | "break" | void>,
  options = { concurrency: 4, skipHidden: true }
): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const filteredEntries = options.skipHidden
    ? entries.filter((entry) => !entry.name.startsWith("."))
    : entries;

  let i = 0;

  const directories: string[] = [];

  for (const entry of filteredEntries) {
    const directive = await cb(entry, i);

    i++;

    if (directive === "continue") {
      continue;
    } else if (directive === "break") {
      break;
    }

    if (entry.isDirectory()) {
      directories.push(path.join(dir, entry.name));
    }
  }

  if (directories.length > 0) {
    if (options.concurrency <= 1) {
      for (const subDir of directories) {
        await traverse(subDir, cb, options);
      }
    } else {
      const chunks = emdash.array.chunk(directories, options.concurrency);

      for (const chunk of chunks) {
        await Promise.all(chunk.map((subDir) => traverse(subDir, cb, options)));
      }
    }
  }
}
