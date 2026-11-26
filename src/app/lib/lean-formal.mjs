import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

export const ORDERED_LEAN_MODULES = [
  ...["Tropical", "Automaton", "GeneticCode", "ExactDP", "KineticAndParity"].map(
    (name) => ({ rel: `Spec/${name}.lean`, group: "Locked Spec (Spec/)" }),
  ),
  { rel: "Spec.lean", group: "Locked Spec (Spec/)" },
  ...["Tropical", "Automaton", "GeneticCode", "ExactDP", "KineticAndParity"].map(
    (name) => ({ rel: `Proofs/${name}.lean`, group: "Kernel Proofs (Proofs/)" }),
  ),
  { rel: "FactorForgeFormal.lean", group: "Package Root, Witnesses & Audit" },
  { rel: "Witnesses.lean", group: "Package Root, Witnesses & Audit" },
  { rel: "Audit.lean", group: "Package Root, Witnesses & Audit" },
  { rel: "audit_axioms.txt", group: "Kernel Output" },
];

export function loadLeanFormalModules(directory) {
  const manifest = JSON.parse(fs.readFileSync(path.join(directory, "source_manifest.json"), "utf8"));
  const expected = ORDERED_LEAN_MODULES.map(({ rel }) => rel).sort();
  if (JSON.stringify(Object.keys(manifest.files).sort()) !== JSON.stringify(expected)) {
    throw new Error("Lean source manifest inventory is incomplete or unexpected");
  }
  const actual = fs.readdirSync(directory, { recursive: true })
    .filter((name) => name.endsWith(".lean") || name === "audit_axioms.txt")
    .map((name) => name.split(path.sep).join("/")).sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error("Lean source directory inventory differs from manifest");
  }
  return ORDERED_LEAN_MODULES.map(({ rel, group }) => {
    const bytes = fs.readFileSync(path.join(directory, rel));
    const digest = createHash("sha256").update(bytes).digest("hex");
    if (digest !== manifest.files[rel].sha256) {
      throw new Error(`Lean source hash mismatch: ${rel}`);
    }
    const code = bytes.toString("utf8");
    return {
      id: rel.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase(), group, path: rel,
      lines: code.trimEnd().split(/\r?\n/).length, code,
    };
  });
}
