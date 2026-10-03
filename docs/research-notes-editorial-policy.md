# Research Notes editorial policy

Research Notes are public editorial records derived from internal engineering and
research logs. They preserve decisions, dead ends, incomplete experiments, and
corrected interpretations without treating those records as peer-reviewed or
biological evidence.

## Source boundary

The website reads only `content/research-notes/*.md`. It never imports or serves
the internal workspace. Public articles are separately reviewed copies.

`npm run build` runs privacy fixtures and the public-claim contract before generating
the site. Complete notes, including frontmatter and links, are checked. Errors show
rule IDs, not matching sensitive text. This is a tripwire, not exhaustive disclosure
certification or a substitute for human review.

For confidential partner/target terms, a maintainer may supply the pipe-separated
`EIJEX_PRIVATE_REDACTION_TERMS` in a private local/build environment. The terms
themselves must never be committed to the public repository or printed in logs.
The generic guard still runs when no private terms are configured; named-entity
coverage then depends on the maintainer's disclosure review.

Do not merely swap names when context identifies a private party or reconstructs a
result. Omit target-specific counts, settings, correspondence, private outcomes and
unpublished publication plans. Use generic roles only when the engineering lesson
survives independently of that context. No automatic workspace sync is permitted.

Public notes must exclude:

- collaborator or partner identity;
- unpublished target identifiers;
- raw or reconstructable sequence material;
- private evidence records or experimental outcomes;
- local paths, cloud project identifiers, instance names, credentials, and hashes;
- non-public editorial planning state; and
- model or biological-performance claims not supported by the active public path.

## Status vocabulary

- `Current`: active architectural or program position.
- `Engineering note`: reproduced software or workflow investigation.
- `Computational observation`: bounded in-silico or infrastructure observation.
- `Incomplete experiment`: an attempted evaluation without a result-bearing output.
- `Superseded`: an earlier interpretation retained with a correction.
- `Public-redacted case study`: a generalized lesson whose private source remains undisclosed.

## Book reuse

Each note includes `bookSection` and `bookOrder` metadata. These values organize the
web archive and provide a stable editorial sequence for a future collected volume.
Web publication does not make a note final book text; later editing may add context,
citations, transitions, and retrospective commentary while preserving the dated note.
