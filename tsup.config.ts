import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node18",
  clean: true,
  dts: false,
  sourcemap: false,
  splitting: false,
  // Don't bundle dependencies - they'll be installed via npm
  external: [
    "@clack/prompts",
    "@resvg/resvg-wasm",
    "react",
    "satori",
    "xdg-basedir",
  ],
  esbuildOptions(options) {
    // Support JSX in .tsx files
    options.jsx = "automatic";
  },
});
