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

export type ResearchNoteLayout = "note" | "blueprint";

export type ResearchNoteTocItem = {
  id: string;
  number: string;
  title: string;
};

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
  layout: ResearchNoteLayout;
  version?: string;
  abstract?: string;
  toc?: ResearchNoteTocItem[];
  pdfUrl?: string;
  pdfLabel?: string;
  bundleUrl?: string;
  bundleLabel?: string;
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

function parseToc(value: unknown): ResearchNoteTocItem[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value
    .filter((entry): entry is Record<string, unknown> => Boolean(entry) && typeof entry === "object")
    .map((entry) => ({
      id: typeof entry.id === "string" ? entry.id.trim() : "",
      number: typeof entry.number === "string" ? entry.number.trim() : "",
      title: typeof entry.title === "string" ? entry.title.trim() : "",
    }))
    .filter((entry) => entry.id && entry.number && entry.title);
  return items.length > 0 ? items : undefined;
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

  const layout: ResearchNoteLayout = data.layout === "blueprint" ? "blueprint" : "note";

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
    layout,
    version:
      typeof data.version === "string" && data.version.trim() ? data.version.trim() : undefined,
    abstract:
      typeof data.abstract === "string" && data.abstract.trim() ? data.abstract.trim() : undefined,
    toc: parseToc(data.toc),
    pdfUrl: typeof data.pdfUrl === "string" && data.pdfUrl.trim() ? data.pdfUrl.trim() : undefined,
    pdfLabel:
      typeof data.pdfLabel === "string" && data.pdfLabel.trim() ? data.pdfLabel.trim() : undefined,
    bundleUrl:
      typeof data.bundleUrl === "string" && data.bundleUrl.trim()
        ? data.bundleUrl.trim()
        : undefined,
    bundleLabel:
      typeof data.bundleLabel === "string" && data.bundleLabel.trim()
        ? data.bundleLabel.trim()
        : undefined,
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
