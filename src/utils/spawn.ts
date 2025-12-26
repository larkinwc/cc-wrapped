// Node.js spawn utilities to replace Bun.spawn

import { spawn, type SpawnOptions } from "node:child_process";
import { createReadStream, type ReadStream } from "node:fs";

export interface SpawnResult {
  exitCode: number | null;
  stdout: string;
  stderr: string;
}

export interface SpawnOpts {
  stdin?: "inherit" | "pipe" | ReadStream | null;
  stdout?: "inherit" | "pipe" | "ignore" | null;
  stderr?: "inherit" | "pipe" | "ignore" | null;
  cwd?: string;
}

export function spawnAsync(
  cmd: string,
  args: string[],
  opts: SpawnOpts = {}
): Promise<SpawnResult> {
  return new Promise((resolve, reject) => {
    const spawnOpts: SpawnOptions = {
      cwd: opts.cwd,
      stdio: [
        opts.stdin === "inherit" ? "inherit" : opts.stdin instanceof Object ? "pipe" : "pipe",
        opts.stdout ?? "pipe",
        opts.stderr ?? "pipe",
      ],
    };

    const proc = spawn(cmd, args, spawnOpts);

    let stdout = "";
    let stderr = "";

    if (proc.stdout) {
      proc.stdout.on("data", (data) => {
        stdout += data.toString();
      });
    }

    if (proc.stderr) {
      proc.stderr.on("data", (data) => {
        stderr += data.toString();
      });
    }

    // Handle stdin from ReadStream
    if (opts.stdin instanceof Object && "pipe" in opts.stdin && proc.stdin) {
      (opts.stdin as ReadStream).pipe(proc.stdin);
    }

    proc.on("error", reject);
    proc.on("close", (code) => {
      resolve({ exitCode: code, stdout, stderr });
    });
  });
}

export function createFileStream(path: string): ReadStream {
  return createReadStream(path);
}
