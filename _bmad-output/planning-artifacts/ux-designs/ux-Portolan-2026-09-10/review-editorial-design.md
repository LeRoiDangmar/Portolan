# Editorial review applied — `DESIGN.md`

Two lenses, structure then prose, both content-neutral. This records what was applied, what was preserved, and what was judged wrong or superseded. No design decision was changed; no Docker object noun, object name, token name, measured figure or French quotation was altered.

**Word-count delta (body, after the frontmatter):** 14,929 → 15,995 words, **+1,066 (+7.1%)**. The pass moved ~770 words rather than deleting them, and the structure lens required three net additions — a table of contents, a consolidated scope note, and an appendix with its own framing. Prose condensations ran the other way but did not offset them.

---

## Structure findings — applied

1. **Self-correction strand moved to a new `## Revision Notes` appendix** after *Open Questions*. All eleven passages relocated, text preserved verbatim, grouped under *From Brand & Style / From Colors / From Typography / From Shapes / From Components* (prefixed "From" so the appendix subheadings do not collide with the body's `##` anchors). Each origin site keeps a one-clause pointer so the live claim still stands on its own. The `:ro`-does-not-restrict-the-Docker-API fact stayed in *Left menu*, together with the brief's reservation of socket mediation to architecture; only the history of the old three-clause string went to the appendix.
2. **Near-concentric contour measurement merged.** The `obs`/`monitoring` and `shop`/`frontend` figures are now stated once, in *Stack outline*. *Open Questions* row 3 keeps one line and a pointer.
3. **"Rejected: stack-as-bubble" / "Rejected: stack-as-area" moved** to the appendix; *Stack outline* keeps a single sentence routing to *Dos and don'ts* for the rules and *Revision Notes* for the arguments. **The seven-tells table was preserved in place, untouched.**
4. **Zone-label sweep condensed** from ~110 words to ~70: two of the three labels have no clear position, both stay put, layer order and 13.8:1 vs 4.6:1 carry them. (See "superseded" below.)
5. **Export `[DEPARTS FROM BRIEF]` paragraph moved** from *Typography* to the preamble. *Typography* keeps a one-clause link ("the first of the four visual requirements the preamble's export departure carries"); *Layout & Spacing*'s back-reference was retargeted from *Typography* to the preamble.
6. **Three scope boundaries gathered** into a preamble note, *What this file does not cover*: no auth or first-run surface, no layout below 1440px, no keyboard graph traversal or screen-reader support in v1 (with ordinary chrome tab focus explicitly in scope), and behaviour living in `EXPERIENCE.md`. The security-exposure argument stayed in *Layout & Spacing*, now headed *Why exposure is a live concern for a file about appearance*.
7. **Seven-item heading split.** Parent renamed `### Control vocabulary`; *Masked values*, *Refresh interval* and *Keep only this* promoted to `###`.
8. **`### Two channels, and only one of them is data` split**; pastille geometry now lives under a sibling `### Pastille geometry`. The "One shape in this file is not a body" paragraph — not pastille geometry — was moved up to close *Two channels*, beside the other path-and-body material.
9. **Three recaps condensed:** *Open Questions*' cross-document row-count bookkeeping to one line; the `{opacity.zone-field-cap}` recap in *Edge* to a pointer at `{stroke.edge.floor}` and *Colors → the composite*; the fourth "light mode is the screenshot palette" in *Elevation* to its mechanism only.
10. **Compact table of contents added** to the preamble — the eight locked sections with one line each, plus the component catalogue in file order.
11. **Six controls promoted to `###`:** *Control chip*, *Fit to chart*, *Reorganise*, *Isolate*, *Export (SVG / PNG)*, *Survey stamp*. Each new section states only what the file and its frontmatter already commit (pattern, placement, state), so the catalogue became navigable without a new decision entering it.
12. **Preserved untouched:** *Dos and don'ts* in full (heading case aside); both mock-is-stale warnings (*Shapes* "predates the zero-translation ruling", *Pastille* "the direction-2 mock predates this decision"); the *Colors* composite table; the seven-tells table.

## Prose findings — applied

All 23 numbered findings and every "smaller one" were applied, except as noted below.

Preamble gloss of Rémi / Tom / Jules / Flows and journeys · "modal region" → "most common region" (both places) · "one colour for every stack" → "the same colour" · LOD and rung 0 expanded at first use in *Brand & Style* · "two volumes, named `pgdata` and `pg-data`, on one container" · the `dy 5 / σ 7` cap rewritten · "carried by the same token" · the pill/circle sentence split in two · pastille rail gap re-attached · "two of the three labels in that render" and "an exhaustive search on a 2px grid" · "against a CIDR label 132px wide" · "and nothing else" / "renders on an empty cluster at all" · "**The study** it came out of" · "**Mocks and studies.**" · bare ratios → `1.13–1.19:1` (both body instances) · "Every ratio is given as dark / light." · "`stack` was never an endpoint" · "see *The bubble contour is not an edge*, below" · the protanopia parenthesis rewritten · "enlarge a stack family that already separates at only ΔE 3.9" · the octave-vocabulary restatement · stretch per bearing and the cap on the sum split into two statements (*Shapes*) with *Layout* matched · "numerals every 100px" · the labelled-protrusion 15.1:1 / 7:1-floor correction.

Smaller: "has a ~6px interior" · "Pastille marks **live in** screen space" · "declined under *Stack outline*, below" · `cartographie assumée` glossed · "spines" defined in the preamble's first line · "Clicking it reframes the map onto the orphans" · "that rectangle is the floor" · "1.4px stroke" · "at 25% zoom" · "the left menu carries four such settings already" · "a blank where a CIDR used to be reads as a rendering bug; a row of blocks reads as a decision" · "Forty percent … eighteen percent" → 40% / 18%.

**Heading:** `## Do's and Don'ts` → `## Dos and don'ts`, and the one in-file reference (in *Focus*) updated. `EXPERIENCE.md` was checked and does **not** name the section, so it needed no edit.

**Spelling register:** en-GB kept, and declared as a deliberate exception to the Microsoft Writing Style Guide in a new preamble paragraph. The single US spelling, `artifacts`, was removed by the "**Mocks and studies.**" rename; `artefact` in *Export* was already correct. (`EXPERIENCE.md` line 52 still reads "visual artifacts"; out of scope for this pass, and worth a separate fix.)

## Superseded or judged differently

- **Prose 11 partly superseded by structure 4.** The condensation would have deleted the clause the prose lens wanted repaired. The repaired wording was kept inside the shorter sentence, at the cost of the target length (≈70 words against "about 55"). The sweep figures the condensation does drop — `BACKEND`'s 6.6 → 23.8px clearance, and the 4.9px / 0.8px / 0.9px best positions — survive in *Open Questions* row 3.
- **Structure 1, §Brand & Style, applied with one adjustment.** The passage moved verbatim, but journey 2 is the live source of the tension the governing principle arbitrates, not an artefact of the old draft. A one-sentence residue naming journey 2 was left in place; to avoid duplicating it, the French wording itself travels with the verbatim passage into the appendix.
- **Structure 11, scope narrowed on purpose.** The six promoted controls were given headings, not new prose. Where a section would otherwise have been a bare heading, it states only what `components:` already declares — no behaviour was imported from `EXPERIENCE.md`.
- **Nothing was skipped as wrong.** No finding was judged mistaken on the merits.

## Verification

| Check | Result |
|---|---|
| Frontmatter untouched and still parses | 618 lines, `yaml.safe_load` OK, 17 top-level keys, 28 `components:` entries, `status: draft`, `updated: 2026-09-11` |
| Eight body sections in locked order | Brand & Style → Colors → Typography → Layout & Spacing → Elevation & Depth → Shapes → Components → Dos and don'ts, then *Open Questions* and *Revision Notes* |
| Every `{path.to.token}` resolves | 109 distinct tokens referenced in the body, 0 unresolved (the literal `{token}` placeholder in the first line excluded) |
| Component names unchanged | 30 `###` headings under *Components*. No existing component heading was renamed; the six added ones use `EXPERIENCE.md`'s Component Patterns names verbatim (*Control chip*, *Fit to chart*, *Reorganise*, *Isolate*, *Export (SVG / PNG)*, *Survey stamp*). The headings that are not Component Patterns rows are all pre-existing or umbrellas: *Control vocabulary* (renamed from the seven-item heading per finding 7), *Masked values*, *Focus* (row name *Focus ring*) and *Node view* (row name *Node region*, which the section references as `{components.node-region}`). The frontmatter `components:` block, which is the actual 1:1 contract, is untouched. |
