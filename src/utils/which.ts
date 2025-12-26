// Node.js which utility to replace Bun.which

import { access, constants } from "node:fs/promises";
import { join } from "node:path";

export async function which(cmd: string): Promise<string | null> {
  const pathEnv = process.env.PATH ?? "";
  const pathSeparator = process.platform === "win32" ? ";" : ":";
  const paths = pathEnv.split(pathSeparator);

  const extensions = process.platform === "win32"
    ? [".exe", ".cmd", ".bat", ".com", ""]
    : [""];

  for (const dir of paths) {
    for (const ext of extensions) {
      const fullPath = join(dir, cmd + ext);
      try {
        await access(fullPath, constants.X_OK);
        return fullPath;
      } catch {
        // Not found or not executable, continue
      }
    }
  }

  return null;
}
