const preferredSections = [
  "Architecture and direction",
  "Design and validation",
  "Evidence and governance",
  "Models and comparative evaluation",
  "Reliability and release engineering",
];

/** @param {ReadonlyArray<{bookSection: string}>} notes */
export function getResearchNoteSections(notes) {
  // Preserve editorial order, but never silently drop a newly named section.
  return [...new Set([...preferredSections, ...notes.map((note) => note.bookSection)])];
}
