import type { MetadataRoute } from "next";
import { getAllResearchNotes } from "@/app/lib/research-notes";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.eijex.com";
  const staticRoutes = ["", "/about", "/factorforge", "/agentos", "/validationhub", "/research-notes"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date("2026-08-29"),
      changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : route === "/research-notes" ? 0.8 : 0.7,
    })),
    ...getAllResearchNotes().map((note) => ({
      url: `${baseUrl}/research-notes/${note.slug}`,
      lastModified: new Date(note.updated),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
