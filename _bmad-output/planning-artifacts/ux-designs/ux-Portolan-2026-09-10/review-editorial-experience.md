# Editorial review applied — `EXPERIENCE.md`

Two lenses, structure then prose, both holding the content sacrosanct. This records what was applied, what was preserved and what was skipped. **No decision in the spine was changed** — only its organisation and its sentences.

Word count: **13,393 → 13,145** (−248, −1.9%). Roughly 500 words cut, roughly 250 added back as the restructure's scaffolding and the new *Open Questions* row.

---

## Structure findings — applied

| # | Finding | What changed |
|---|---|---|
| 1 | Restructure Component Patterns | The single 31-row table is now three tables under `### Graph marks` (15 rows), `### Chrome controls` (14) and `### Chart apparatus` (2). The seven cells over ~180 words — *Bubble*, *Network zone*, *Stack outline*, *Node region*, *Left menu*, *Export (SVG / PNG)*, *Chart legend* — keep a one-line row and are written out as `####` subsections beneath their own table, under the same name. All 31 row names are byte-identical to before. |
| 2 | Cut revision-history residue | Every passage on the list is gone: §Foundation's 115-word refutation; §Network zone's "the earlier claim … was false"; §Accessibility Floor's three ("an earlier draft let that one repair imply…", "the assumption marker this bullet used to carry is gone…", "the earlier ±3.4px positional drift … is gone from the specification"); §IA's "the earlier phrasing here read them as one"; §Open Questions' two closing blocks; plus "both spines contradicted themselves", "which previously had none anywhere in either spine" and "both spines repeated the word". |
| 3 | Merge the zero-translation breathing rule | *State Patterns → Alive at rest* is canonical and untouched. §Bubble keeps the two tokens and a pointer; §Accessibility Floor's *Motion, stated honestly* keeps only the consequence (nothing translates, so nothing must be tracked to be clicked) and points to *Alive at rest*. |
| 4 | Condense the *Export* preview; de-duplicate the mode line | §Foundation is two sentences plus a pointer. "The mode removes the addresses, not the map" now appears **once**, in §Export. Flow 2 step 7 is trimmed to the flow beat. |
| 5 | Add map reachability to Open Questions | New row, **Who can reach the map, and from where** — carried from the brief, first-ranked, half-answered by the *Safe to share* default and half owned by architecture. |
| 6 | Move the LOD ladder | The table and its screen-space `[ASSUMPTION]` now close §Information Architecture, ahead of every use of the rung vocabulary. §Interaction Primitives keeps the zoom/filter rule and its **[DEPARTS FROM BRIEF]**, with a one-line pointer. |
| 7 | Merge the collector-seam note | One note in §Foundation names both sites. §Voice and Tone and §Socket unreachable each keep a one-line pointer. |
| 8 | Merge *Stale map* into *Stale data / refresh failure* | The state cell absorbs the two marks and the never-hidden rule; the component row is one line pointing to it. |
| 9 | Merge the browser-zoom arithmetic | §Responsive & Platform keeps the 110 / 150 / 200% derivation. §Accessibility Floor keeps the consequence ("no route to 200% text"). §Below minimum viewport keeps the behaviour and drops the percentages. |
| 10 | Merge the node-backdrop rationale | The argument lives in the *Node backdrop* row. §IA's merge paragraph is now "off by default — see *Node backdrop* for why". |
| 11 | Condense the near-concentric row | Question plus a pointer to the measurement under *Stack outline*. The figures themselves stay in *Stack outline*, unaltered. |
| 12 | Merge the metaballs / 3D rejections | §Banned drops the metaballs bullet and keeps only behavioural prohibitions. §Inspiration & Anti-patterns owns both rejections. §Bubble keeps the terse component rules (*bubbles never fuse*, *never spatially 3D*) with a pointer. |
| 13 | Condense the Component Patterns preamble | The literal "28" and the reconciliation bookkeeping are gone; why *Image* and *Palette* have no `DESIGN.md` counterpart, and why *Pastille* takes two rows, are kept. |
| 14 | One sub-schema for the long entries | **Rule** first, then *Rejected*, then *Cost* — modelled on *Node region*. *Stack outline*'s binding "Not selectable" ruling is now rule 1 rather than its eighth sentence. |

## Prose findings — applied

All 24 numbered findings, and every smaller one.

- **1** §Export's colon split into "…and nothing else. Those addresses appear in three places, and all three are masked: …" — the highest-risk misreading in the file.
- **2** "no rule engine anywhere in this file". **3** *Stack outline* **below**. **4** §IA chrome sentence re-punctuated with semicolons; "Everything else is graph canvas" is its own sentence. **5** Rail capacity fronts the key. **6** "the **copy** in `backend`". **7** Octave vocabulary restated. **8** §Detail panel's aside moved. **9** "what the filter has excluded". **10** "no `0` **shortcut**". **11** "into **the network's** zone field". **12** "Two kinds — attachment and mount —". **13** "**each step** multiplies". **14** Four comma splices → semicolons. **15** "Behavioural" at all three sites, table header included. **16** All-caps defaults lowered. **17** "Two criteria bind together:". **18** Absolute phrase bracketed. **19** "(Flow 1, step 10)". **20** "the names of two different volumes". **21** "`BACKEND` had a clear position and its label moved into it". **22** All five earlier-draft row openers replaced. **23** "left **unspoken**". **24** "**Four design questions remain** …" — count first, plural verb.
- Smaller: unserialised lists held throughout (three serial commas removed); "permanently alive graph"; bare "relayout" → "re-layout"; "about 2.4px"; the stopped-only-colour option rewritten as two named alternatives; "In practice this bites…" given its antecedent; "(`weaveworks/scope` #1636)"; the doubled "and" in §Journey coverage; the `(1) (2) (3) (4)` runs are real numbered lists in the four subsections that now have room for them; bold saturation cut in the densest cells (*Stack outline* 15 → 8 spans, *Export* 15 → 7, *Node region* 9 → 6, *Bubble* 8 → 5, *Network zone* 7 → 4).

## Preserved, deliberately

- The required section set, unrenamed and in order: Foundation, Information Architecture, Voice and Tone, Component Patterns, State Patterns, Interaction Primitives, Accessibility Floor, Responsive & Platform, Inspiration & Anti-patterns, Key Flows, Open Questions.
- All 31 Component Patterns row names, verbatim — the 28 `DESIGN.md` `components:` entries one-to-one, plus *Image*, *Palette* and the second *Pastille* row.
- Every Docker object noun, object name, token path, measured figure and French quotation, `beaucoup à regarder, peu à lire` included.
- All 12 `[ASSUMPTION]` and all 6 `[DEPARTS FROM BRIEF]` markers. `status: draft`, `updated: 2026-09-11`.
- §Journey coverage; the front-matter intro and marker convention; §Foundation's 7-row constraint table; §Bubble's warning that the linked shape-study mockup predates the zero-translation ruling and animates a positional drift.
- The three Key Flows: protagonists, register and all five **Climax —** beats intact; no step flattened into an instruction.

## Skipped

- **`DESIGN.md` → "Dos and don'ts" rename.** Conditional, and the condition does not hold: that section is titled **"Do's and Don'ts"**, and `EXPERIENCE.md` contains no reference to it. Nothing to update. (If the rename is made later, this file still needs no change.)
- **Shrinking Component Patterns below its 42% share.** The restructure was mandated as a shape change, not a length cut, and every row name and rule had to survive. It is now navigable — three tables and seven named subsections instead of one wall — but it is still the largest section, and correctly so.
- **`{components.stack-outline}`** lost its only reference when the "Closed by ruling" block was cut, so the file now cites 59 tokens rather than 60. All 59 resolve; the token is still defined in `DESIGN.md` and is still reachable through `{shape.stack-outline}` / `{stroke.stack-outline}`, which the *Stack outline* entry names. No action taken.

## Verification

| Check | Result |
|---|---|
| Every `{path.to.token}` resolves against `DESIGN.md` frontmatter | **59 referenced, 0 unresolved** |
| 28 component row names unchanged and still 1:1 with `DESIGN.md` | **28/28 matched, 0 missing, 0 renamed**; 31 rows total with *Image*, *Palette* and *Pastille* — rail capacity |
| Three Key Flows keep protagonists and climax beats | **Rémi ×1, Tom ×2; 5 Climax beats** (orphan, intruder, twins, screenshot, imbalance) |
| Required section set intact | **11/11 present, unrenamed** |

Markdown tables were checked for column consistency across all nine table blocks: no malformed rows.
