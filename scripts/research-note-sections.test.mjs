import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";
import matter from "gray-matter";
import { getResearchNoteSections } from "../src/app/lib/research-note-sections.mjs";

test("keeps canonical order and includes unknown sections exactly once", () => {
  const sections = getResearchNoteSections([
    { bookSection: "New section" }, { bookSection: "New section" },
  ]);
  assert.equal(sections[0], "Architecture and direction");
  assert.equal(sections[4], "Reliability and release engineering");
  assert.equal(sections[5], "New section");
  assert.equal(sections.filter((section) => section === "New section").length, 1);
});

test("every public note belongs to one rendered archive section", () => {
  const root = new URL("../content/research-notes/", import.meta.url);
  const notes = fs.readdirSync(root).filter((file) => file.endsWith(".md")).map((file) => {
    const { data } = matter(fs.readFileSync(new URL(file, root), "utf8"));
    assert.equal(typeof data.bookSection, "string");
    assert(data.bookSection.trim());
    return data;
  });
  const sections = getResearchNoteSections(notes);
  const grouped = sections.flatMap((section) => notes.filter((note) => note.bookSection === section));
  assert.equal(grouped.length, notes.length);
  assert.equal(new Set(grouped).size, notes.length);
});
