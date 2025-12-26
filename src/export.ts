// Export and import functionality for portable data files

import { readFile, writeFile } from "node:fs/promises";
import { hostname } from "node:os";
import { collectRawEntries, collectClaudeProjects } from "./collector";
import type { ExportedData, RawUsageEntry } from "./types";

const EXPORT_VERSION = 1;

export async function exportData(year: number, outputPath: string): Promise<{ entryCount: number; projectCount: number }> {
  const [entries, projects] = await Promise.all([
    collectRawEntries(year),
    collectClaudeProjects(year),
  ]);

  const exportedData: ExportedData = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    machineId: hostname(),
    year,
    entries,
    projects: Array.from(projects),
  };

  await writeFile(outputPath, JSON.stringify(exportedData, null, 2), "utf8");

  return {
    entryCount: entries.length,
    projectCount: projects.size,
  };
}

export async function loadExportedData(inputPath: string): Promise<ExportedData> {
  const content = await readFile(inputPath, "utf8");
  const data = JSON.parse(content) as ExportedData;

  if (data.version !== EXPORT_VERSION) {
    throw new Error(`Unsupported export version: ${data.version}. Expected version ${EXPORT_VERSION}.`);
  }

  return data;
}

export async function loadMultipleExports(inputPaths: string[]): Promise<{
  entries: RawUsageEntry[];
  projects: Set<string>;
  sources: string[];
}> {
  const allEntries: RawUsageEntry[] = [];
  const allProjects = new Set<string>();
  const sources: string[] = [];
  const processedHashes = new Set<string>();

  for (const inputPath of inputPaths) {
    const data = await loadExportedData(inputPath);
    sources.push(`${data.machineId} (${data.exportedAt})`);

    for (const entry of data.entries) {
      // Deduplicate by messageId + requestId if available
      const hash = entry.messageId && entry.requestId
        ? `${entry.messageId}:${entry.requestId}`
        : null;

      if (hash && processedHashes.has(hash)) {
        continue;
      }
      if (hash) {
        processedHashes.add(hash);
      }

      allEntries.push(entry);
    }

    for (const project of data.projects) {
      allProjects.add(project);
    }
  }

  return {
    entries: allEntries,
    projects: allProjects,
    sources,
  };
}
