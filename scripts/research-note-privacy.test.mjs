import assert from "node:assert/strict";
import { test } from "node:test";
import { privacyFindings } from "./lib/research-note-privacy.mjs";

const rejected = [
  ["private-review-term", "Example Partner"],
  ["private-review-term", "example partner"],
  ["private-review-term", "EXAMPLE PARTNER"],
  ["private-review-term", "Ex%61mple Partner"],
  ["private-review-term", "Ex\u200Bample Partner"],
  ["private-review-term", "Example Target"],
  ["private-target", "Target-" + "mAb-A"],
  ["internal-path", "C:/" + "Work/private/item"],
  ["internal-path", "C:\\" + "Users\\fixture\\item"],
  ["internal-path", "_poc/" + "private"],
  ["credential", "postgresql://" + "fixture:fake@localhost/db"],
  ["credential", "api_key=" + "synthetic_fixture_only"],
  ["sequence-identity", "a".repeat(64)],
  ["dna-sequence", "ACGT".repeat(16)],
  ["dna-sequence", Array(3).fill("ACGT".repeat(5)).join("\n")],
  ["protein-sequence", "MELK".repeat(22)],
  ["fasta-record", ">synthetic\n" + "MELK".repeat(4)],
  ["unpublished-planning", "Paper " + "4"],
  ["unpublished-planning", "manuscript " + "status"],
];
for (const [index, [id, fixture]] of rejected.entries()) {
  test(`blocks ${id} fixture ${index}`, () => {
    assert(privacyFindings(fixture, ["Example Partner", "Example Target"]).includes(id));
  });
}
test("allows generic public engineering explanations", () => {
  assert.deepEqual(privacyFindings("FactorForge v3.5.4 preserves protein identity. A policy warning is not a measured biological result. Model adapters remain a research preview. https://doi.org/10.5281/zenodo.23076954"), []);
});
