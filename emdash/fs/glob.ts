import * as path from "path";
import { cwd } from "process";
import emdash from "..";

export async function* glob(pattern: string) {
  const entries: string[] = [];

  const isNegation = pattern.startsWith("!");

  if (isNegation) {
    pattern = pattern.slice(1);
  }

  const normalizedPattern = path.normalize(pattern).replace(/\\/g, "/");

  await emdash.fs.traverse(cwd(), async (entry) => {
    const fullPath = path.join(entry.parentPath, entry.name).replace(/\\/g, "/");
    const relPath = path.relative(cwd(), fullPath).replace(/\\/g, "/");

    const matches = matchGlobPattern(relPath, normalizedPattern);

    if (isNegation ? !matches : matches) {
      entries.push(relPath);
    }
  });

  for (const entry of entries) {
    yield entry;
  }
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
        if (
          matchGlobPattern(
            pathSegments.slice(i).join("/"),
            patternSegments.slice(patternIdx + 1).join("/")
          )
        ) {
          return true;
        }
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
  const regexStr = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*")
    .replace(/\?/g, ".");

  return new RegExp(`^${regexStr}$`).test(str);
}
