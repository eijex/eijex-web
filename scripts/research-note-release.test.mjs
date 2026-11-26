import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { loadLeanFormalModules } from "../src/app/lib/lean-formal.mjs";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import matter from "gray-matter";
import { privacyFindings } from "./lib/research-note-privacy.mjs";

const root = new URL("../", import.meta.url);
const note = matter(fs.readFileSync(new URL(
  "content/research-notes/lean4-formal-verification-of-factorforge-dp.md", root,
), "utf8"));
const render = (content) => renderToStaticMarkup(React.createElement(ReactMarkdown, {
  remarkPlugins: [remarkGfm, remarkMath], rehypePlugins: [rehypeKatex],
}, content));

test("renders inline and display math as KaTeX with accessible MathML", () => {
  const html = render("Bound $L\\varepsilon$.\n\n$$\n\\tau_p + \\frac{d}{W}(1-\\tau_p)\n$$");
  assert(html.includes('class="katex"'));
  assert(html.includes('class="katex-display"'));
  assert(html.includes("<math"));
  assert(!html.includes("katex-error"));
});

test("the released Lean note uses blueprint layout, display equations, and Lean code listings without KaTeX errors", () => {
  assert.equal(note.data.layout, "blueprint");
  assert.equal(typeof note.data.abstract, "string");
  assert(note.data.abstract.length > 200);
  assert(Array.isArray(note.data.toc) && note.data.toc.length === 9);
  const html = render(note.content);
  assert(html.includes('class="katex"'));
  assert(html.includes('class="katex-display"'));
  assert(html.includes('class="language-lean"'));
  assert(!html.includes("katex-error"));
});

test("all 7 Lean note translations (ko, ja, zh, fr, es, ru, de) pass privacy, zero em-dash, and KaTeX checks", () => {
  const translationsDir = new URL("content/research-notes/translations/", root);
  const expectedLangs = ["ko", "ja", "zh", "fr", "es", "ru", "de"];
  for (const lang of expectedLangs) {
    const fileUrl = new URL(`lean4-formal-verification-of-factorforge-dp.${lang}.md`, translationsDir);
    const raw = fs.readFileSync(fileUrl, "utf8");
    assert(!raw.includes("—"), `Em dash found in ${lang} translation`);
    assert.deepEqual(privacyFindings(raw), [], `Privacy tripwire hit in ${lang} translation`);
    const parsed = matter(raw);
    assert.equal(parsed.data.lang, lang);
    assert.equal(typeof parsed.data.abstract, "string");
    assert(Array.isArray(parsed.data.toc) && parsed.data.toc.length === 9);
    const html = render(parsed.content);
    assert(html.includes('class="katex"'), `Missing KaTeX in ${lang}`);
    assert(html.includes('class="katex-display"'), `Missing display KaTeX in ${lang}`);
    assert(html.includes('class="language-lean"'), `Missing Lean block in ${lang}`);
    assert(!html.includes("katex-error"), `KaTeX parse error in ${lang}`);
  }
});

test("navbar uses route-aware NavActiveLink rather than hardcoded teal highlight on /papers", () => {
  const navSource = fs.readFileSync(new URL("src/app/components/Nav.tsx", root), "utf8");
  assert(navSource.includes("NavActiveLink"));
  assert(navSource.includes('href="/about"'));
  assert(!navSource.includes('href="/papers" className="hover:text-slate-900 dark:hover:text-white transition-colors font-semibold text-teal-700'));
});

test("every declared research-note download points to an existing local release asset", () => {
  const directory = new URL("content/research-notes/", root);
  for (const name of fs.readdirSync(directory).filter((name) => name.endsWith(".md"))) {
    const { data } = matter(fs.readFileSync(new URL(name, directory), "utf8"));
    for (const [field, extension] of [["pdfUrl", ".pdf"], ["fullPdfUrl", ".pdf"], ["bundleUrl", ".zip"]]) {
      if (data[field] === undefined) continue;
      assert.match(data[field], /^\/research-notes\/[A-Za-z0-9_.-]+$/);
      assert.equal(path.extname(data[field]), extension);
      assert(fs.statSync(new URL(`public${data[field]}`, root)).isFile());
    }
  }
});

test("all public notes render without KaTeX parse errors", () => {
  const directory = new URL("content/research-notes/", root);
  for (const name of fs.readdirSync(directory).filter((name) => name.endsWith(".md"))) {
    const { content } = matter(fs.readFileSync(new URL(name, directory), "utf8"));
    assert(!render(content).includes("katex-error"), name);
  }
});


test("full proof inventory includes all 14 Lean modules and one selected audit output", () => {
  const modules = loadLeanFormalModules(fileURLToPath(new URL("content/lean4-formal/", root)));
  assert.equal(modules.filter((m) => m.path.endsWith(".lean")).length, 14);
  assert.equal(modules.length, 15);
  assert(modules.find((m) => m.path === "FactorForgeFormal.lean").code.includes("import FactorForgeFormal.Audit"));
});

for (const corruption of ["missing", "drift", "inventory"]) {
  test(`full proof loader rejects ${corruption} instead of silently dropping source`, () => {
    const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "lean-source-test-"));
    try {
      fs.cpSync(new URL("content/lean4-formal/", root), temporary, { recursive: true });
      const target = path.join(temporary, "FactorForgeFormal.lean");
      if (corruption === "missing") fs.unlinkSync(target);
      if (corruption === "drift") fs.appendFileSync(target, "\n-- drift");
      if (corruption === "inventory") {
        const manifestPath = path.join(temporary, "source_manifest.json");
        const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
        delete manifest.files["FactorForgeFormal.lean"];
        fs.writeFileSync(manifestPath, JSON.stringify(manifest));
      }
      assert.throws(() => loadLeanFormalModules(temporary));
    } finally {
      assert.equal(path.dirname(path.resolve(temporary)), path.resolve(os.tmpdir()));
      assert(path.basename(temporary).startsWith("lean-source-test-"));
      fs.rmSync(temporary, { recursive: true, force: true });
    }
  });
}

test("all locale theorem tables retain their cells and complete preservation statement", () => {
  const documents = [new URL("content/research-notes/lean4-formal-verification-of-factorforge-dp.md", root)];
  for (const lang of ["ko", "ja", "zh", "fr", "es", "ru", "de"]) {
    documents.push(new URL(`content/research-notes/translations/lean4-formal-verification-of-factorforge-dp.${lang}.md`, root));
  }
  for (const document of documents) {
    const content = matter(fs.readFileSync(document, "utf8")).content;
    const tree = unified().use(remarkParse).use(remarkGfm).use(remarkMath).parse(content);
    const tables = tree.children.filter((node) => node.type === "table");
    for (const table of tables) {
      const columns = table.children[0].children.length;
      for (const row of table.children.slice(1)) assert.equal(row.children.length, columns, document.href);
    }
    const html = render(content);
    const rows = html.match(/<tr>[\s\S]*?<\/tr>/g) ?? [];
    const theorem = rows.find((row) => row.includes("<code>proteinPreservationAndGC</code>") && row.includes("WellFormedMenu"));
    assert(theorem?.includes("seqGC"), document.href);
    assert(theorem?.includes("some"), document.href);
  }
});
