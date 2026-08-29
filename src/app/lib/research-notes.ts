import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const NOTES_DIRECTORY = path.join(process.cwd(), "content", "research-notes");

export type ResearchNoteStatus =
  | "Current"
  | "Engineering note"
  | "Computational observation"
  | "Incomplete experiment"
  | "Superseded"
  | "Public-redacted case study";

export type ResearchNote = {
  slug: string;
  title: string;
  date: string;
  updated: string;
  status: ResearchNoteStatus;
  category: string;
  summary: string;
  evidenceScope: string;
  featured: boolean;
  bookSection: string;
  bookOrder: number;
  readingMinutes: number;
  content: string;
};

const VALID_STATUSES = new Set<ResearchNoteStatus>([
  "Current",
  "Engineering note",
  "Computational observation",
  "Incomplete experiment",
  "Superseded",
  "Public-redacted case study",
]);

function requiredString(value: unknown, field: string, fileName: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Research note ${fileName} is missing ${field}`);
  }
  return value.trim();
}

function parseNote(fileName: string): ResearchNote {
  const slug = fileName.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(NOTES_DIRECTORY, fileName), "utf8");
  const { data, content } = matter(raw);

  const status = requiredString(data.status, "status", fileName) as ResearchNoteStatus;
  const bookOrder = Number(data.bookOrder);
  if (!VALID_STATUSES.has(status)) {
    throw new Error(`Research note ${fileName} has an unsupported status: ${status}`);
  }
  if (!Number.isFinite(bookOrder)) {
    throw new Error(`Research note ${fileName} has an invalid bookOrder`);
  }

  return {
    slug,
    title: requiredString(data.title, "title", fileName),
    date: requiredString(data.date, "date", fileName),
    updated: requiredString(data.updated, "updated", fileName),
    status,
    category: requiredString(data.category, "category", fileName),
    summary: requiredString(data.summary, "summary", fileName),
    evidenceScope: requiredString(data.evidenceScope, "evidenceScope", fileName),
    featured: data.featured === true,
    bookSection: requiredString(data.bookSection, "bookSection", fileName),
    bookOrder,
    readingMinutes: Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 220)),
    content: content.trim(),
  };
}

export function getAllResearchNotes(): ResearchNote[] {
  return fs
    .readdirSync(NOTES_DIRECTORY)
    .filter((fileName) => fileName.endsWith(".md"))
    .map(parseNote)
    .sort((a, b) => b.date.localeCompare(a.date) || a.bookOrder - b.bookOrder);
}

export function getFeaturedResearchNotes(limit = 4): ResearchNote[] {
  return getAllResearchNotes().filter((note) => note.featured).slice(0, limit);
}

export function getResearchNote(slug: string): ResearchNote | undefined {
  return getAllResearchNotes().find((note) => note.slug === slug);
}
