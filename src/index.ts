#!/usr/bin/env node

import * as p from "@clack/prompts";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { spawnAsync } from "./utils/spawn";

import { checkClaudeDataExists } from "./collector";
import { calculateStats, calculateStatsFromEntries } from "./stats";
import { exportData, loadMultipleExports } from "./export";
import { generateImage } from "./image/generator";
import { displayInTerminal, getTerminalName } from "./terminal/display";
import { copyImageToClipboard } from "./clipboard";
import { isWrappedAvailable } from "./utils/dates";
import { formatCostFull, formatNumber, formatNumberFull } from "./utils/format";
import type { ClaudeCodeStats } from "./types";

const VERSION = "1.0.0";

function printHelp() {
  console.log(`
cc-wrapped v${VERSION}

Generate your Claude Code year in review stats card.

USAGE:
  cc-wrapped [OPTIONS]

OPTIONS:
  --year <YYYY>      Generate wrapped for a specific year (default: current year)
  --export <FILE>    Export raw data to a portable JSON file for combining across machines
  --input <FILES>    Generate wrapped from one or more exported data files (comma-separated)
  --help, -h         Show this help message
  --version, -v      Show version number

EXAMPLES:
  cc-wrapped                       # Generate current year wrapped
  cc-wrapped --year 2025           # Generate 2025 wrapped
  cc-wrapped --export data.json    # Export data to a file
  cc-wrapped --input a.json,b.json # Combine data from multiple machines
`);
}

async function main() {
  // Parse command line arguments
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      year: { type: "string", short: "y" },
      export: { type: "string", short: "e" },
      input: { type: "string", short: "i" },
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "v" },
    },
    strict: true,
    allowPositionals: false,
  });

  if (values.help) {
    printHelp();
    process.exit(0);
  }

  if (values.version) {
    console.log(`cc-wrapped v${VERSION}`);
    process.exit(0);
  }

  p.intro("claude code wrapped");

  const requestedYear = values.year ? parseInt(values.year, 10) : new Date().getFullYear();

  // Handle export mode
  if (values.export) {
    const spinner = p.spinner();
    spinner.start("Exporting Claude Code data...");

    try {
      const { entryCount, projectCount } = await exportData(requestedYear, values.export);
      spinner.stop("Export complete!");
      p.note(
        `Entries: ${formatNumber(entryCount)}\nProjects: ${formatNumber(projectCount)}\nFile: ${values.export}`,
        `Exported ${requestedYear} data`
      );
      p.outro("Share this file to combine with other machines!");
    } catch (error) {
      spinner.stop("Export failed");
      p.cancel(`Error: ${error}`);
      process.exit(1);
    }
    process.exit(0);
  }

  // Handle input mode (combining multiple exports)
  if (values.input) {
    const inputPaths = values.input.split(",").map((p) => p.trim()).filter((p) => p);
    if (inputPaths.length === 0) {
      p.cancel("No input files specified");
      process.exit(1);
    }

    const spinner = p.spinner();
    spinner.start(`Loading ${inputPaths.length} data file(s)...`);

    let stats: ClaudeCodeStats;
    try {
      const { entries, projects, sources } = await loadMultipleExports(inputPaths);
      spinner.message("Calculating combined stats...");
      stats = await calculateStatsFromEntries(entries, projects, requestedYear);
      spinner.stop("Combined stats ready!");
      p.note(`Sources:\n${sources.map((s) => `  - ${s}`).join("\n")}`, "Data from");
    } catch (error) {
      spinner.stop("Failed to load data");
      p.cancel(`Error: ${error}`);
      process.exit(1);
    }

    // Continue with normal wrapped generation using combined stats
    await generateWrapped(stats, requestedYear);
    return;
  }

  // Normal mode - collect from local data
  const availability = isWrappedAvailable(requestedYear);
  if (!availability.available) {
    if (Array.isArray(availability.message)) {
      availability.message.forEach((line) => p.log.warn(line));
    } else {
      p.log.warn(availability.message || "Wrapped not available yet.");
    }
    p.cancel();
    process.exit(0);
  }

  const dataExists = await checkClaudeDataExists();
  if (!dataExists) {
    p.cancel("Claude Code data not found in ~/.claude\n\nMake sure you have used Claude Code at least once.");
    process.exit(0);
  }

  const spinner = p.spinner();
  spinner.start("Scanning your Claude Code history...");

  let stats;
  try {
    stats = await calculateStats(requestedYear);
  } catch (error) {
    spinner.stop("Failed to collect stats");
    p.cancel(`Error: ${error}`);
    process.exit(1);
  }

  if (stats.totalSessions === 0) {
    spinner.stop("No data found");
    p.cancel(`No Claude Code activity found for ${requestedYear}`);
    process.exit(0);
  }

  spinner.stop("Found your stats!");

  const activityDates = Array.from(stats.dailyActivity.keys())
    .map((d) => new Date(d))
    .filter((d) => !Number.isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());
  if (activityDates.length > 1 && requestedYear === new Date().getFullYear()) {
    const spanDays = Math.ceil(
      (activityDates[activityDates.length - 1].getTime() - activityDates[0].getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (spanDays <= 35) {
      p.log.warn(
        "Claude Code logs are kept ~30 days by default. To keep more history, increase cleanupPeriodDays in your settings.json."
      );
    }
  }

  await generateWrapped(stats, requestedYear);
}

async function generateWrapped(stats: ClaudeCodeStats, year: number): Promise<void> {
  // Display summary
  const summaryLines = [
    `Sessions:      ${formatNumber(stats.totalSessions)}`,
    `Messages:      ${formatNumber(stats.totalMessages)}`,
    `Total Tokens:  ${formatNumber(stats.totalTokens)}`,
    `Projects:      ${formatNumber(stats.totalProjects)}`,
    `Streak:        ${stats.maxStreak} days`,
    stats.hasUsageCost && `Usage Cost:    ${stats.totalCost.toFixed(2)}$`,
    stats.mostActiveDay && `Most Active:   ${stats.mostActiveDay.formattedDate}`,
  ].filter(Boolean);

  p.note(summaryLines.join("\n"), `Your ${year} in Claude Code`);

  // Generate image
  const spinner = p.spinner();
  spinner.start("Generating your wrapped image...");

  let image: { fullSize: Buffer; displaySize: Buffer };
  try {
    image = await generateImage(stats);
  } catch (error) {
    spinner.stop("Failed to generate image");
    p.cancel(`Error generating image: ${error}`);
    process.exit(1);
  }

  spinner.stop("Image generated!");

  const displayed = await displayInTerminal(image.displaySize);
  if (!displayed) {
    p.log.info(`Terminal (${getTerminalName()}) doesn't support inline images`);
  }

  const filename = `cc-wrapped-${year}.png`;
  const { success, error } = await copyImageToClipboard(image.fullSize, filename);

  if (success) {
    p.log.success("Automatically copied image to clipboard!");
  } else {
    p.log.warn(`Clipboard unavailable: ${error}`);
    p.log.info("You can save the image to disk instead.");
  }

  const defaultPath = join(process.env.HOME || "~", filename);

  const shouldSave = await p.confirm({
    message: `Save image to ~/${filename}?`,
    initialValue: true,
  });

  if (p.isCancel(shouldSave)) {
    p.outro("Cancelled");
    process.exit(0);
  }

  if (shouldSave) {
    try {
      await writeFile(defaultPath, image.fullSize);
      p.log.success(`Saved to ${defaultPath}`);
    } catch (error) {
      p.log.error(`Failed to save: ${error}`);
    }
  }

  const shouldShare = await p.confirm({
    message: "Share on X (Twitter)? Don't forget to attach your image!",
    initialValue: true,
  });

  if (!p.isCancel(shouldShare) && shouldShare) {
    const tweetUrl = generateTweetUrl(stats);
    const opened = await openUrl(tweetUrl);
    if (opened) {
      p.log.success("Opened X in your browser.");
    } else {
      p.log.warn("Couldn't open browser. Copy this URL:");
      p.log.info(tweetUrl);
    }
    p.log.info("Press CMD / CTRL + V to paste the image.");
  }

  p.outro("Share your wrapped!");
  process.exit(0);
}

function generateTweetUrl(stats: ClaudeCodeStats): string {
  const lines: string[] = [];
  lines.push(`Claude Code Wrapped ${stats.year}`);
  lines.push("");
  lines.push(`Total Tokens: ${formatNumberFull(stats.totalTokens)}`);
  lines.push(`Total Messages: ${formatNumberFull(stats.totalMessages)}`);
  lines.push(`Total Sessions: ${formatNumberFull(stats.totalSessions)}`);
  lines.push("");
  lines.push(`Longest Streak: ${stats.maxStreak} days`);
  lines.push(`Top model: ${stats.topModels[0]?.name ?? "N/A"}`);
  lines.push(
    `Total Estimated Cost: ${stats.hasUsageCost ? formatCostFull(stats.totalCost) : "N/A"}`
  );
  lines.push("");
  lines.push("Get yours: npx cc-wrapped");
  lines.push("");
  lines.push("Credit: @nummanali @moddi3io");
  lines.push("");
  lines.push("(Paste Image Stats with CMD / CTRL + V)");

  const text = lines.join("\n");

  const url = new URL("https://x.com/intent/tweet");
  url.searchParams.set("text", text);
  return url.toString();
}

async function openUrl(url: string): Promise<boolean> {
  const platform = process.platform;
  let command: string;

  if (platform === "darwin") {
    command = "open";
  } else if (platform === "win32") {
    command = "start";
  } else {
    command = "xdg-open";
  }

  try {
    const result = await spawnAsync(command, [url], {
      stdout: "ignore",
      stderr: "ignore",
    });
    return result.exitCode === 0;
  } catch {
    return false;
  }
}

main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
