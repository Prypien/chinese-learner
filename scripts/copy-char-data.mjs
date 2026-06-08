import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dataDir = path.join(root, "node_modules", "hanzi-writer-data");
const outDir = path.join(root, "public", "char-data");

const contentFiles = [
  "content/book1/lesson-01.json",
  "content/book1/lesson-02.json",
  "content/book1/lesson-03.json",
  "content/book1/lesson-04.json",
  "content/jens-text.json",
];

function collectCharacters() {
  const chars = new Set();
  for (const file of contentFiles) {
    const json = JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
    for (const item of json.vocabulary ?? []) {
      for (const c of item.traditional ?? "") {
        if (/[\u4e00-\u9fff]/.test(c)) chars.add(c);
      }
    }
  }
  return [...chars];
}

const chars = collectCharacters();
fs.mkdirSync(outDir, { recursive: true });

let copied = 0;
const missing = [];

for (const char of chars) {
  const src = path.join(dataDir, `${char}.json`);
  const dest = path.join(outDir, `${char}.json`);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    copied++;
  } else {
    missing.push(char);
  }
}

console.log(`char-data: copied ${copied}/${chars.length} characters`);
if (missing.length) {
  console.log(`char-data: missing stroke data for: ${missing.join("")}`);
}
