import { getAllResearchNotes } from "@/app/lib/research-notes";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const baseUrl = "https://www.eijex.com";
  const items = getAllResearchNotes()
    .map(
      (note) => `
    <item>
      <title>${escapeXml(note.title)}</title>
      <link>${baseUrl}/research-notes/${note.slug}</link>
      <guid isPermaLink="true">${baseUrl}/research-notes/${note.slug}</guid>
      <pubDate>${new Date(`${note.date}T00:00:00Z`).toUTCString()}</pubDate>
      <category>${escapeXml(note.category)}</category>
      <description>${escapeXml(note.summary)}</description>
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Eijex Research Notes</title>
    <link>${baseUrl}/research-notes</link>
    <description>Engineering decisions and computational observations from Eijex.</description>
    <language>en</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
