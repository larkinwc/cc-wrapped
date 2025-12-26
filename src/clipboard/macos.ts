import type { ClipboardProvider, ClipboardResult } from "./types";
import { DEFAULT_TIMEOUT_MS } from "./types";
import { spawnAsync } from "../utils/spawn";

export const macOSProvider: ClipboardProvider = {
  name: "macOS (osascript)",

  async isAvailable(): Promise<boolean> {
    return process.platform === "darwin";
  },

  async copyImage(imagePath: string): Promise<ClipboardResult> {
    // AppleScript to copy PNG to clipboard
    // Uses «class PNGf» for PNG format
    const script = `set the clipboard to (read POSIX file "${imagePath}" as «class PNGf»)`;

    try {
      const result = await Promise.race([
        spawnAsync("osascript", ["-e", script], {
          stdout: "pipe",
          stderr: "pipe",
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), DEFAULT_TIMEOUT_MS)
        ),
      ]);

      if (result.exitCode === 0) {
        return { success: true };
      }

      return {
        success: false,
        error: result.stderr.trim() || `osascript exited with code ${result.exitCode}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};
