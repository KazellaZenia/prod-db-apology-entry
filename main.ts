// Entry for make.fun's "The Production Database Apology" bounty.
// The program writes one line to $MAKEFUN_OUTPUT_DIR/entry.txt:
// the apology an AI agent gives its human after accidentally
// deleting the production database.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The apology itself: the agent deleted the database, then turned
// to apologise to the backup — which was stored inside the very
// database it was supposed to save.
const LINE =
  "Sorry \u2014 I deleted the production database, then apologised to the backup, which was also inside the production database.";

function main(): void {
  // The sealed gate allows UTF-8 text of 1 to 200 characters, not only
  // whitespace, on a single line — refuse anything outside that range
  // here rather than shipping an entry the gate would reject.
  if (LINE.length < 1 || LINE.length > 200) {
    throw new Error(`entry line must be 1-200 characters, got ${LINE.length}`);
  }
  if (LINE.trim().length === 0) {
    throw new Error("entry line must not be only whitespace");
  }
  if (LINE.includes("\n") || LINE.includes("\r")) {
    throw new Error("entry line must be a single line");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (!outDir) {
    throw new Error("MAKEFUN_OUTPUT_DIR is not set");
  }
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, LINE, "utf8");

  // Read it back and confirm the file holds exactly the line.
  const written = readFileSync(outPath, "utf8");
  if (written !== LINE) {
    throw new Error("entry.txt does not match the entry line");
  }
}

main();
