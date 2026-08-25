import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const sourceRoot = fileURLToPath(new URL("../src/app/", import.meta.url));

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(entry.name) ? [path] : [];
  });
}

const files = sourceFiles(sourceRoot);
const publicSource = files
  .map((file) => `\n// ${relative(root, file)}\n${readFileSync(file, "utf8")}`)
  .join("\n");

const required = [
  "https://github.com/eijex/factorforge-cds",
  "https://github.com/eijex/eijex-mcp",
  "https://github.com/eijex/eijex-agentOps",
  "https://github.com/eijex/eijex-validationHub",
  "Research checkpoint",
  "Planning scaffold",
  "Public code",
  "Permissioned evidence",
  "Control, not scientific truth.",
  "No separate hosted AgentOS application",
  "Related records are not interchangeable evidence.",
  "No hosted public evidence database",
  'href: "/agentos"',
  'href: "/validationhub"',
];

for (const marker of required) {
  assert(publicSource.includes(marker), `Missing required public marker: ${marker}`);
}

const prohibited = [
  /C:\\Work/i,
  /private-archive/i,
  /postgres(?:ql)?:\/\//i,
  /password\s*=/i,
  /production[- ]ready/i,
  /fully integrated/i,
  /guarantee(?:s|d)? (?:expression|yield|biological performance)/i,
];

for (const pattern of prohibited) {
  assert(!pattern.test(publicSource), `Prohibited public marker matched: ${pattern}`);
}

assert(statSync(new URL("../src/app/page.tsx", import.meta.url)).isFile());
assert(statSync(new URL("../src/app/agentos/page.tsx", import.meta.url)).isFile());
assert(statSync(new URL("../src/app/validationhub/page.tsx", import.meta.url)).isFile());
console.log(`Public-claim contract passed across ${files.length} source files.`);
