---
title: "Four blind spots found after a small release was already ‘done’"
date: "2026-08-07"
updated: "2026-08-29"
status: "Engineering note"
category: "Reliability & Release"
summary: "A branch trigger, committed-byte mismatch, cross-repository version drift, and missing downstream CI appeared outside the task's acceptance criteria."
evidenceScope: "Release-engineering retrospective"
featured: false
bookSection: "Reliability and release engineering"
bookOrder: 3
---

## A small change crossed several invisible boundaries

A modest interface release passed local tests and independent review. Continuing to
watch the release after the normal completion checkpoint exposed four unrelated
blind spots.

First, a push to the main branch triggered a container-publication workflow even
though the tag push was mentally treated as the release event. The workflow's actual
trigger surface did not match the operator's model.

Second, the tag-triggered CI matrix failed on a manifest hash. Local verification
had hashed working-tree bytes while CI hashed committed bytes; line-ending
normalization made those inputs different.

Third, an existing release script had options for updating downstream repositories,
but the narrowly scoped release did not use them. Public surfaces therefore kept
advertising older versions.

Fourth, some downstream repositories had no CI signal that could demonstrate the
corrected site still built.

## Trigger blindness and scope blindness

The incidents fell into two shapes. Trigger blindness comes from assuming what an
action will fire instead of reading the automation. Scope blindness comes from
finishing a correctly bounded task without checking whether its consumers now agree
with it.

The resulting checklist is intentionally plain:

- inspect push and tag triggers before publishing;
- verify committed artifacts, not only working-tree files;
- check live CI after the push;
- review downstream synchronization options; and
- verify dependent public surfaces separately.

A task can satisfy every acceptance criterion and still leave the surrounding system
in a contradictory state. “Is this change complete?” and “Does the world now agree
with it?” are different review questions.

