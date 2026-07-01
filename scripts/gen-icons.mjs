import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const markPath = path.join(repoRoot, "public", "driftibo-seal-mark.svg");

const markSvg = await readFile(markPath, "utf8");
const innerMatch = markSvg.match(/<svg\b[^>]*>([\s\S]*?)<\/svg>\s*$/);

if (!innerMatch) {
  throw new Error(`Unable to read SVG contents from ${markPath}`);
}

const markInnerSvg = innerMatch[1].trim();
const outputs = [
  ["public/apple-touch-icon.png", 180],
  ["public/icon-192.png", 192],
  ["public/icon-512.png", 512],
];

for (const [relativeOutputPath, size] of outputs) {
  const markSize = size * 0.76;
  const offset = (size - markSize) / 2;
  const wrapperSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#1F4A52"/>
  <svg x="${offset}" y="${offset}" width="${markSize}" height="${markSize}" viewBox="0 0 100 100">
    ${markInnerSvg}
  </svg>
</svg>`;

  const outputPath = path.join(repoRoot, relativeOutputPath);
  await sharp(Buffer.from(wrapperSvg)).png().toFile(outputPath);
  console.log(`Wrote ${relativeOutputPath}`);
}
