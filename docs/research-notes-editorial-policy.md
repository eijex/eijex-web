# Research Notes editorial policy

Research Notes are public editorial records derived from internal engineering and
research logs. They preserve decisions, dead ends, incomplete experiments, and
corrected interpretations without treating those records as peer-reviewed or
biological evidence.

## Source boundary

The website reads only `content/research-notes/*.md`. It never imports or serves
the internal workspace. Public articles are separately reviewed copies.

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
