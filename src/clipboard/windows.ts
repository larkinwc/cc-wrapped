import type { ClipboardProvider, ClipboardResult } from "./types";
import { DEFAULT_TIMEOUT_MS } from "./types";
import { spawnAsync } from "../utils/spawn";

const isWSL = !!process.env.WSL_DISTRO_NAME;

/**
 * Convert WSL path to Windows path
 * e.g., /tmp/image.png -> \\wsl$\Ubuntu\tmp\image.png
 */
async function toWindowsPath(wslPath: string): Promise<string> {
  const result = await spawnAsync("wslpath", ["-w", wslPath], {
    stdout: "pipe",
    stderr: "pipe",
  });

  if (result.exitCode !== 0) {
    throw new Error("Failed to convert WSL path to Windows path");
  }

  return result.stdout.trim();
}

export const windowsProvider: ClipboardProvider = {
  name: isWSL ? "Windows (via WSL)" : "Windows",

  async isAvailable(): Promise<boolean> {
    return process.platform === "win32" || isWSL;
  },

  async copyImage(imagePath: string): Promise<ClipboardResult> {
    try {
      // Convert path if running under WSL
      const winPath = isWSL ? await toWindowsPath(imagePath) : imagePath;

      // Escape backslashes for PowerShell string
      const escapedPath = winPath.replace(/\\/g, "\\\\");

      // PowerShell script to copy image to clipboard using .NET
      const script = `
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
try {
  $img = [System.Drawing.Image]::FromFile("${escapedPath}")
  [System.Windows.Forms.Clipboard]::SetImage($img)
  $img.Dispose()
  exit 0
} catch {
  Write-Error $_.Exception.Message
  exit 1
}
`.trim();

      const result = await Promise.race([
        spawnAsync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script], {
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
        error: result.stderr.trim() || `PowerShell exited with code ${result.exitCode}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};
