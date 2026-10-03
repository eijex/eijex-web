// Publication tripwire, not a substitute for human disclosure review.
const rules = [
  ["private-target", /\bTarget-mAb(?:-[A-Z])?\b/i],
  ["internal-path", /(?:[A-Z]:[\\/](?:Work|Users)[\\/]|file:\/\/|(?:_poc|_improvement-jobs|collaborators)[\\/])/i],
  ["credential", /(?:postgres(?:ql)?(?:\+[a-z0-9]+)?:\/\/|\b(?:api[_-]?key|password|access[_-]?token)\s*[:=]\s*["']?[a-z0-9_./+\-=]{8,})/i],
  ["sequence-identity", /\b(?:sha256:)?[a-f0-9]{64}\b/i],
  ["dna-sequence", /\b(?:[ACGT][ \t\r\n]*){45,}\b/i],
  ["protein-sequence", /\b[ACDEFGHIKLMNPQRSTVWY]{80,}\b/],
  ["fasta-record", /^>[^\n]*\r?\n[ACDEFGHIKLMNPQRSTVWY]{10,}(?:\r?\n|$)/m],
  ["unpublished-planning", /\bPaper\s*[1-9]\b|(?:manuscript|submission|journal)\s+(?:plan|status|target)|\b(?:JOSS|Oxford)\b/i],
];

export function privacyFindings(text, privateTerms = []) {
  const normalized = text.normalize("NFKC").replace(/[\u200B-\u200D\uFEFF]/g, "");
  const decoded = normalized.replace(/(?:%[a-f0-9]{2})+/gi, (value) => {
    try { return decodeURIComponent(value); } catch { return value; }
  });
  const findings = rules.filter(([, pattern]) => pattern.test(decoded)).map(([id]) => id);
  const folded = decoded.toLowerCase();
  if (privateTerms.some((term) => term.trim() && folded.includes(term.trim().toLowerCase()))) {
    findings.push("private-review-term");
  }
  return findings;
}
