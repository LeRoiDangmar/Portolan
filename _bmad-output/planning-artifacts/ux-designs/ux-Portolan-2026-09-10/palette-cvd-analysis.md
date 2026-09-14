---
title: "Zone palette under colour-vision deficiency — measurement and options"
status: for-decision
created: 2026-09-14
owner: design
covers: NFR-13, NFR-11
targets: ./DESIGN.md
---

# Zone palette under CVD — what is actually broken, and what it costs to fix

Discharges the two design-owned items `SPEC.md` carries as blockers on the tokens story: the
light-palette tint collision (`NFR-13`) and the incomplete exemption set (`NFR-11`, which `AD-28`
requires complete before its gate is first enabled).

**Nothing here is applied.** The values below are candidates, not decisions — the arithmetic is
settled, the register is not, and the register is design's call. Method: Viénot–Brettel–Mollon (1999)
simulation on linear sRGB, CIEDE2000 on the simulated pairs, contrast as WCAG relative luminance.
The script is reproducible; every figure below came out of it.

## 1. What is broken

`NFR-13` requires the six zone hues to be **mutually separable under simulated deuteranopia, in both
palettes**. Measured on the shipped tokens:

| Palette | Worst pair | Simulated | Min ΔE00 |
|---|---|---|---|
| **Light** | `zone-tint-1` / `zone-tint-3` | both → `#E2E2EC` | **0.00 — byte-identical** |
| Light | 1 / 6 and 3 / 6 | `#E2E2EC` / `#E0E0EF` | 2.17 |
| **Dark** | `zone-tint-2` / `zone-tint-4` | `#181810` / `#1C1C15` | **1.30** |
| Dark | 3 / 5 | `#16161E` / `#1A1A21` | 1.42 |
| Dark | 1 / 6 | `#1A1A28` / `#1A1A2B` | 1.57 |

**Two findings, and the second is not in any document.**

The light collision is real and is exactly as `NFR-13` describes it. But **the dark palette — the
default — has three pairs below ΔE 1.6**, which no upstream document reports. `NFR-14` accepts the
network family at "ΔE 2.6"; the true figure is 1.30, and it is on the palette the product ships with.
The defect is broader than the one named.

## 2. Why it happens

Deuteranopia collapses colour onto two channels. The tints are *also* held iso-luminant by
construction — 1.13–1.19 against their ground — because that is what makes edge contrast invariant
to which zone an edge crosses, and therefore what makes the ≥3:1 edge floor checkable at all.

Those two facts together leave **one usable dimension**. In the shipped light palette the simulated
values differ only in the blue channel, across a span of 32 steps out of 255. Six values on one
32-step axis cannot be far apart.

**The iso-luminant rule is not the thing to relax.** Drop it and the edge floor stops being a
property the product can guarantee, which costs more than the palette is worth. The free variable is
**chroma**.

## 3. What separation costs

Best achievable minimum pairwise ΔE00 under deuteranopia, by chroma ceiling, holding the
1.13–1.19 contrast band:

| C* ceiling | Light | Dark | Note |
|---|---|---|---|
| 6 | 2.81 | 2.20 | below the shipped register |
| 8 | 4.43 | 2.55 | |
| 10 | 4.59 | 3.75 | |
| **12** | **5.09** | **3.72** | **the shipped palette's own ceiling (max C* = 11.0 light, 11.6 dark)** |
| 15 | 5.57 | 4.05 | |
| 20 | 6.44 | 4.82 | leaving the muted register |
| 28 | 7.87 | 6.71 | sea chart becomes poster |

**The headline: the constraint was never impossible, the hues were simply never optimised.** At the
palette's *existing* saturation the reachable minimum is ≈5.1 light and ≈3.7 dark, against 0.00 and
1.30 today. The repair costs no saturation at all.

Raising chroma buys little and costs the register fast: the whole span from C* 12 to C* 28 — muted
chart to poster — buys about 3 ΔE.

## 4. Candidate values

Optimised at C* ≤ 12 against **both** deuteranopia and protanopia (`DESIGN.md` claims protanopia
separates at least as well; holding both keeps that claim true), with ≥6 ΔE trichromat headroom.

**Dark** — min ΔE00: deuteranopia **3.77**, protanopia 3.66, trichromat 6.62

| Token | Candidate | C* | Hue |
|---|---|---|---|
| `zone-tint-1` | `#261A14` | 8.1 | 53 |
| `zone-tint-2` | `#1A1816` | 1.8 | 74 |
| `zone-tint-3` | `#1E1C08` | 11.9 | 103 |
| `zone-tint-4` | `#062020` | 10.3 | 197 |
| `zone-tint-5` | `#101E26` | 8.0 | 246 |
| `zone-tint-6` | `#161C2C` | 11.9 | 282 |

**Light** — min ΔE00: deuteranopia **3.27**, protanopia 3.35, trichromat 6.42

| Token | Candidate | C* | Hue |
|---|---|---|---|
| `zone-tint-1-light` | `#E4DCD8` | 3.6 | 55 |
| `zone-tint-2-light` | `#ECE2CC` | 12.0 | 91 |
| `zone-tint-3-light` | `#E0E4D6` | 7.4 | 121 |
| `zone-tint-4-light` | `#DAE2E2` | 2.8 | 199 |
| `zone-tint-5-light` | `#CCE8EE` | 10.0 | 217 |
| `zone-tint-6-light` | `#DCE2F8` | 11.6 | 281 |

**Read these as a demonstration that the numbers are reachable, not as a proposed palette.** Two
objections are already visible and both are design's to answer: the hue rotation is uneven, and two
entries (`zone-tint-2` at C* 1.8, `zone-tint-4-light` at C* 2.8) are effectively neutral greys, which
is a strange thing to call a hue in a six-hue rotation. A hand-tuned set at the same chroma ceiling
should reach the same ΔE band while keeping the rotation legible as a rotation. The isolines
(`zone-isoline-1…6`) must be re-derived from whatever tints are chosen; they are not re-computed here.

## 5. `NFR-13` needs a threshold, and it does not have one

*"Mutually separable"* names no number, so the gate cannot be written. Proposed, for ratification:

> **ΔE00 ≥ 3.0** between any two simulated tints, under both deuteranopia and protanopia, in both
> palettes.

Three is defensible for *large fields* — zone tints are the largest coloured areas on the chart, and
large-area discrimination beats small-patch — and it is where the existing register lands. It is also
honest about what it is: **a floor, not comfort.** Even at C* 28 the ceiling is ~6.7, so the six zone
hues will never be comfortably separable to a dichromat at any register this product would ship.

That is not a new concession. `NFR-14` already states that network identity is carried by the octave
pattern and by written names rather than by colour, and `FR-65` calls the network channel *partly
repaired*. This measurement supports that position rather than undermining it — it just puts a number
on how partial the repair is, and removes an outright collision from underneath it.

## 6. The `NFR-11` exemption set, completed

`NFR-11` names **three** exemptions, all of them *state-based*: the staleness veil, the reachability
dim, the empty-filter pale context. `AD-28` makes the contrast gate blocking, so any combination that
sits below its floor by design and is *not* in the set turns the gate red on correct behaviour.

Auditing `DESIGN.md`'s own measured tables, **three structural exemptions are missing**:

| Missing exemption | Measured | Why it is deliberate |
|---|---|---|
| **Bubble contour over a zone tint** | 2.7–2.9 / 2.7–3.0 against the 3:1 edge floor | The edge floor binds the two *edge* kinds, the marks that carry relationships. A body's own outline is not an edge. `DESIGN.md` argues this and flags it `[ASSUMPTION]` — *"it follows the file's own distinction, but nobody stated it."* This is the statement. |
| **Zone tint over canvas** | 1.18 / 1.13 against 3:1 | Deliberately near-invisible: *a coastline, not a border*. A zone is a field noticed peripherally. Exempting it is the whole point of the iso-luminant rule. |
| **Unavailable control text** | `ink-3` on `hairline` border, below the 4.5:1 chassis floor | A disabled control, exempt by the convention every disabled control is exempt by. Shown rather than hidden so the toolbar never reflows, which is why it exists at all. |

**One clarification rather than an addition.** `NFR-11` already exempts the staleness veil and says
the health mark does not reach its 4:1 floor under it. `DESIGN.md` puts the figure at **2.1:1 at full
veil**. Worth writing into the set as a value so the gate asserts a number rather than a category.

**Not exemptions, recorded so nobody adds them:** the stack outline at 3.8–4.1 *meets* 3:1 and is
merely below both edge kinds on purpose — that is an ordering, not a floor breach; and the composite
table's ✗ rows are pre-clamp failures that `{opacity.zone-field-cap}` repairs, not states to excuse.

## 7. What needs a decision

1. **The ΔE00 ≥ 3.0 threshold for `NFR-13`** — ratify, or set another number.
2. **The tint values** — hand-tune at C* ≤ 12, or accept a computed set, or raise the chroma ceiling
   and accept the register shift.
3. **The three structural exemptions** — ratify into `NFR-11` so `AD-28`'s gate can be written.

Items 1 and 3 unblock the tokens story. Item 2 can follow, as long as whatever lands satisfies 1.
