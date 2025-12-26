import type { ClipboardProvider, ClipboardResult } from "./types";
import { DEFAULT_TIMEOUT_MS } from "./types";
import { which } from "../utils/which";
import { spawnAsync, createFileStream } from "../utils/spawn";

type LinuxTool = {
  cmd: string;
  args: (imagePath: string) => string[];
  name: string;
  usesStdin: boolean;
};

// Wayland tools first, then X11 fallbacks
const LINUX_TOOLS: LinuxTool[] = [
  {
    cmd: "wl-copy",
    args: () => ["--type", "image/png"],
    name: "wl-copy (Wayland)",
    usesStdin: true,
  },
  {
    cmd: "xclip",
    args: (imagePath) => ["-selection", "clipboard", "-t", "image/png", "-i", imagePath],
    name: "xclip (X11)",
    usesStdin: false,
  },
  {
    cmd: "xsel",
    args: () => ["--clipboard", "--input", "--type", "image/png"],
    name: "xsel (X11)",
    usesStdin: true,
  },
];

// Cache which results to avoid repeated lookups
const whichCache = new Map<string, boolean>();

async function cmdExists(cmd: string): Promise<boolean> {
  if (whichCache.has(cmd)) {
    return whichCache.get(cmd)!;
  }
  const exists = (await which(cmd)) !== null;
  whichCache.set(cmd, exists);
  return exists;
}

async function tryTool(tool: LinuxTool, imagePath: string): Promise<ClipboardResult> {
  const args = tool.args(imagePath);

  try {
    const result = await Promise.race([
      spawnAsync(tool.cmd, args, {
        stdin: tool.usesStdin ? createFileStream(imagePath) : null,
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
      error: result.stderr.trim() || `${tool.cmd} exited with code ${result.exitCode}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export const linuxProvider: ClipboardProvider = {
  name: "Linux",

  async isAvailable(): Promise<boolean> {
    if (process.platform !== "linux") return false;
    // Check if we're in WSL - if so, we'll use Windows provider
    if (process.env.WSL_DISTRO_NAME) return false;

    // Check if any tool is available
    for (const tool of LINUX_TOOLS) {
      if (await cmdExists(tool.cmd)) {
        return true;
      }
    }
    return false;
  },

  async copyImage(imagePath: string): Promise<ClipboardResult> {
    const tried: string[] = [];

    for (const tool of LINUX_TOOLS) {
      const exists = await cmdExists(tool.cmd);
      if (!exists) continue;

      tried.push(tool.name);
      const result = await tryTool(tool, imagePath);

      if (result.success) {
        return result;
      }
      // If failed, try next tool
    }

    if (tried.length === 0) {
      return {
        success: false,
        error: "No clipboard tool found. Install wl-clipboard (Wayland) or xclip/xsel (X11).",
      };
    }

    return {
      success: false,
      error: `Clipboard copy failed. Tried: ${tried.join(", ")}`,
    };
  },
};
