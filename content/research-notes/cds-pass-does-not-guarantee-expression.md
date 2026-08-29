---
title: "Why a CDS-level pass does not guarantee expression"
date: "2026-07-04"
updated: "2026-08-29"
status: "Public-redacted case study"
category: "Design & Validation"
summary: "Codon choice, protein architecture, experimental context, and measured yield belong to connected—but different—evidence layers."
evidenceScope: "Claim-boundary case study; no private outcome disclosed"
featured: true
bookSection: "Design and validation"
bookOrder: 3
---

## A clean result can answer the wrong question

A private case prompted a familiar but important question: if a coding sequence
passes computational checks, why might the downstream experiment still be
unsuccessful?

The answer begins by separating layers. A CDS review can test amino-acid identity,
codon choice, nucleotide composition, configured motifs, and assembly-related
constraints. Those checks can identify useful design risks. They do not directly
measure protein folding, secretion, solubility, cellular burden, construct context,
assay behavior, or final yield.

## Three different statements

These statements should not be collapsed:

1. **The CDS satisfies its computational contract.**  
   This is a reproducible software result.
2. **The protein has no obvious architecture-level risk indicators.**  
   This may be an annotation or advisory assessment.
3. **The construct performs well in a defined experiment.**  
   This requires an experimental observation with controls and provenance.

A pass at the first layer does not establish the third. The reverse also matters:
an imperfect computational score does not prove that expression will fail.

## The product boundary

The practical response was not to make the CDS score claim more. It was to preserve
the CDS layer and add clearly labeled protein-risk annotations where useful. Such
annotations remain warnings, not substitutes for experiments.

This is why public Eijex language distinguishes design review from biological
validation. The software can produce reviewable candidates and traceable checks.
Experimental systems determine what happens in the laboratory. Linking the two is
valuable, but linkage does not erase the boundary between them.

