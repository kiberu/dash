import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const INPUT_MD_FILENAME = "MIVULE ABBEY DASH’S KWANJULA BUDGET.md";
const inputPath = path.join(repoRoot, INPUT_MD_FILENAME);
const outPath = path.join(repoRoot, "data", "budget.json");

function stripMarkdownBold(s) {
  return s.replaceAll("**", "").trim();
}

function parseMoneyCell(s) {
  const raw = s.trim();
  if (!raw) return null;
  const normalized = raw.replaceAll(",", "");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replaceAll(/['’]/g, "")
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/(^-|-$)/g, "");
}

function parseTableRow(line) {
  if (!line.trim().startsWith("|")) return null;
  const trimmed = line.trim();
  const inner = trimmed.replace(/^\|/, "").replace(/\|$/, "");
  const cells = inner.split("|").map((c) => c.trim());
  if (cells.length < 4) return null;
  return {
    item: cells[0] ?? "",
    quantity: cells[1] ?? "",
    unitPrice: cells[2] ?? "",
    total: cells[3] ?? "",
  };
}

const md = await fs.readFile(inputPath, "utf8");
const lines = md.split(/\r?\n/);

/** @type {{ key: string; label: string; items: any[] }[]} */
const sections = [];

let currentSection = null;
let itemIndexInSection = 0;

for (const line of lines) {
  const row = parseTableRow(line);
  if (!row) continue;

  // Skip header/separator rows
  if (row.item.toUpperCase() === "ITEM") continue;
  if (row.item.startsWith(":----")) continue;

  const itemCell = row.item.trim();
  if (!itemCell) continue;

  // Section header rows like "**C. ENGOYE (CLOTHINGS)**"
  if (itemCell.startsWith("**") && itemCell.endsWith("**")) {
    const sectionText = stripMarkdownBold(itemCell);
    const m = sectionText.match(/^([A-Z])\.\s*(.+)$/);
    if (m) {
      const key = m[1];
      const label = m[2];
      currentSection = { key, label, items: [] };
      sections.push(currentSection);
      itemIndexInSection = 0;

      // Some sections (like A) include an actual budget line on the section row.
      const headerTotal = parseMoneyCell(row.total);
      if (headerTotal != null) {
        const quantity = row.quantity.trim() ? row.quantity.trim() : undefined;
        const unitPrice = parseMoneyCell(row.unitPrice);

        itemIndexInSection += 1;
        const id = `${currentSection.key}-${String(itemIndexInSection).padStart(
          2,
          "0",
        )}-${slugify(label)}`;

        currentSection.items.push({
          id,
          sectionKey: currentSection.key,
          sectionLabel: currentSection.label,
          name: label,
          quantity,
          unitPrice,
          total: headerTotal,
        });
      }

      continue;
    }
  }

  if (!currentSection) {
    // Ignore any rows before the first section header.
    continue;
  }

  const total = parseMoneyCell(row.total);
  if (total == null) continue; // skip blank spacer rows

  const name = stripMarkdownBold(itemCell);
  const quantity = row.quantity.trim() ? row.quantity.trim() : undefined;
  const unitPrice = parseMoneyCell(row.unitPrice);

  itemIndexInSection += 1;
  const id = `${currentSection.key}-${String(itemIndexInSection).padStart(
    2,
    "0",
  )}-${slugify(name)}`;

  currentSection.items.push({
    id,
    sectionKey: currentSection.key,
    sectionLabel: currentSection.label,
    name,
    quantity,
    unitPrice,
    total,
  });
}

const output = {
  generatedAt: new Date().toISOString(),
  sections,
};

await fs.mkdir(path.dirname(outPath), { recursive: true });
await fs.writeFile(outPath, JSON.stringify(output, null, 2) + "\n", "utf8");

const sectionCount = sections.length;
const itemCount = sections.reduce((acc, s) => acc + s.items.length, 0);
const totalSum = sections.reduce(
  (acc, s) => acc + s.items.reduce((a, i) => a + i.total, 0),
  0,
);

console.log(
  `Generated budget.json with ${sectionCount} sections, ${itemCount} items. Sum: ${totalSum.toLocaleString(
    "en-US",
  )} UGX`,
);

