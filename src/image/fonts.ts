// Font loader for Satori

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Font } from "satori";
import { getFontsDir } from "../utils/paths";

export async function loadFonts(): Promise<Font[]> {
  const fontsDir = getFontsDir();

  const [regularFont, mediumFont, boldFont] = await Promise.all([
    readFile(join(fontsDir, "IBMPlexMono-Regular.ttf")),
    readFile(join(fontsDir, "IBMPlexMono-Medium.ttf")),
    readFile(join(fontsDir, "IBMPlexMono-Bold.ttf")),
  ]);

  return [
    {
      name: "IBM Plex Mono",
      data: regularFont,
      weight: 400,
      style: "normal",
    },
    {
      name: "IBM Plex Mono",
      data: mediumFont,
      weight: 500,
      style: "normal",
    },
    {
      name: "IBM Plex Mono",
      data: boldFont,
      weight: 700,
      style: "normal",
    },
  ];
}
