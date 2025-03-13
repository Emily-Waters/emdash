import * as path from "path";
import { cwd } from "process";
import emdash from "..";

/**
 * Asynchronously generates file paths that match a given glob pattern.
 *
 * This function traverses the file system starting from the specified
 * current working directory (`cwd`) and yields relative file paths
 * that match the provided glob pattern.
 *
 * @param pattern - The glob pattern to match file paths against. The pattern
 * should use forward slashes (`/`) as path separators.
 * @param options - Optional configuration for the glob generator.
 * @param options.cwd - The current working directory to start the traversal from.
 * Defaults to the result of `cwd()`.
 * @param options.skipHidden - Whether to skip hidden files and directories
 * (those starting with a dot). Defaults to `true`.
 * @param options.concurrency - The maximum number of concurrent operations
 * during traversal. Defaults to `4`.
 *
 * @yields The file path of each file that matches the glob pattern.
 */
export async function* globGenerator(
  pattern: string,
  options = { cwd: cwd(), skipHidden: true, concurrency: 4 }
) {
  const entries: string[] = [];

  const normalizedPattern = path.normalize(pattern).replace(/\\/g, "/");

  await emdash.fs.traverse(
    options.cwd,
    async (entry) => {
      const fullPath = path.join(entry.parentPath, entry.name).replace(/\\/g, "/");
      const relPath = path.relative(options.cwd, fullPath).replace(/\\/g, "/");

      const matches = matchGlobPattern(relPath, normalizedPattern);

      if (matches) {
        entries.push(fullPath);
      }
    },
    options
  );

  for (const entry of entries) {
    yield entry;
  }
}

/**
 * Asynchronously finds files and directories matching a glob pattern.
 *
 * @param pattern - The glob pattern to match against. Supports standard glob syntax.
 * @param options - Optional configuration for the glob operation.
 *   @property cwd - The current working directory to start the search from. Defaults to the result of `cwd()`.
 *   @property skipHidden - Whether to skip hidden files and directories. Defaults to `true`.
 *   @property concurrency - The maximum number of concurrent operations. Defaults to `4`.
 * @returns A promise that resolves to an array of file and directory paths matching the pattern.
 *
 * The function normalizes the provided glob pattern and traverses the file system
 * starting from the specified `cwd`. It uses the `emdash.fs.traverse` utility to
 * iterate through the file system and applies the glob pattern to determine matches.
 */
export async function glob(
  pattern: string,
  options = { cwd: cwd(), skipHidden: true, concurrency: 4 }
) {
  const entries: string[] = [];

  const normalizedPattern = path.normalize(pattern).replace(/\\/g, "/");

  await emdash.fs.traverse(
    options.cwd,
    async (entry) => {
      const fullPath = path.join(entry.parentPath, entry.name).replace(/\\/g, "/");
      const relPath = path.relative(options.cwd, fullPath).replace(/\\/g, "/");

      const matches = matchGlobPattern(relPath, normalizedPattern);

      if (matches) {
        entries.push(fullPath);
      }
    },
    options
  );

  return entries;
}

/**
 * Finds the first file or directory that matches the given glob pattern.
 *
 * @param pattern - The glob pattern to match against. The pattern should use forward slashes (`/`) as path separators.
 * @param options - Optional configuration for the glob search.
 * @param options.cwd - The current working directory to start the search from. Defaults to the result of `cwd()`.
 * @param options.skipHidden - Whether to skip hidden files and directories during traversal. Defaults to `true`.
 * @returns A promise that resolves to the full path of the first matching file or directory, or an empty string if no match is found.
 */
export async function globFirst(pattern: string, options = { cwd: cwd(), skipHidden: true }) {
  let globMatch = "";

  const normalizedPattern = path.normalize(pattern).replace(/\\/g, "/");

  await emdash.fs.traverse(
    options.cwd,
    async (entry) => {
      const fullPath = path.join(entry.parentPath, entry.name).replace(/\\/g, "/");
      const relPath = path.relative(options.cwd, fullPath).replace(/\\/g, "/");
      const matches = matchGlobPattern(relPath, normalizedPattern);

      if (matches) {
        globMatch = fullPath;
        return "break";
      }
    },
    { ...options, concurrency: 1 }
  );

  return globMatch;
}

function matchGlobPattern(filePath: string, pattern: string): boolean {
  const patternSegments = pattern.split("/");
  const pathSegments = filePath.split("/");

  let patternIdx = 0;
  let pathIdx = 0;

  while (patternIdx < patternSegments.length && pathIdx < pathSegments.length) {
    const patternPart = patternSegments[patternIdx];
    const pathPart = pathSegments[pathIdx];

    if (patternPart === "**") {
      for (let i = pathIdx; i <= pathSegments.length; i++) {
        const nextPathPart = pathSegments.slice(i).join("/");
        const nextPatternPart = patternSegments.slice(patternIdx + 1).join("/");
        const isMatch = matchGlobPattern(nextPathPart, nextPatternPart);
        if (isMatch) return true;
      }

      return false;
    } else if (!matchSimplePattern(pathPart, patternPart)) {
      return false;
    }

    patternIdx++;
    pathIdx++;
  }

  return patternIdx >= patternSegments.length && pathIdx >= pathSegments.length;
}

function matchSimplePattern(str: string, pattern: string): boolean {
  pattern = pattern
    .replace(/\?/, ".")
    .replace(/\[!([^\]]*)\]/g, "(?!$1)*")
    .replace(/\*/g, ".*");

  return new RegExp(`^${pattern}$`).test(str);
}
