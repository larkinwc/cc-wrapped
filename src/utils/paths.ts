// Path utilities for finding assets relative to the package root

import { dirname, join, resolve } from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

let _packageRoot: string | null = null;

/**
 * Find the package root by looking for package.json
 */
export function getPackageRoot(): string {
  if (_packageRoot) return _packageRoot;

  // Start from current file's directory
  const currentDir = dirname(fileURLToPath(import.meta.url));
  let dir = currentDir;

  // Walk up looking for package.json
  while (dir !== dirname(dir)) {
    if (existsSync(join(dir, "package.json"))) {
      _packageRoot = dir;
      return dir;
    }
    dir = dirname(dir);
  }

  // Fallback: assume we're in dist/ or src/utils/
  // Try common patterns
  const candidates = [
    resolve(currentDir, ".."),        // from dist/
    resolve(currentDir, "../.."),     // from src/utils/
    resolve(currentDir, "../../.."),  // from dist/utils/ (if nested)
  ];

  for (const candidate of candidates) {
    if (existsSync(join(candidate, "package.json"))) {
      _packageRoot = candidate;
      return candidate;
    }
  }

  // Last resort: use current working directory
  _packageRoot = process.cwd();
  return _packageRoot;
}

/**
 * Get the path to the assets directory
 */
export function getAssetsDir(): string {
  return join(getPackageRoot(), "assets");
}

/**
 * Get the path to the fonts directory
 */
export function getFontsDir(): string {
  return join(getAssetsDir(), "fonts");
}
