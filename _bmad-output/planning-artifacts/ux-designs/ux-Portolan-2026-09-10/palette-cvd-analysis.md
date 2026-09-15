---
title: "Zone palette under colour-vision deficiency — measurement and options"
status: decided
created: 2026-09-14
updated: 2026-09-15
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

## 4. Decisions taken, 2026-09-15

**The threshold — ratified.**

> **ΔE00 ≥ 3.0** between any two simulated zone tints, under **both deuteranopia and protanopia**,
> in both palettes.

Holding protanopia as well as deuteranopia goes beyond `NFR-13`'s letter, and it is what keeps
`DESIGN.md`'s claim — *"protanopia separates at least as well in every case"* — true by gate rather
than by assertion. It costs nothing: protanopia is the binding case in the light palette and
deuteranopia in the dark, and both clear 3.0 at the existing register.

Three is a **floor, not comfort**, and the honest note stands: the ceiling at any register this
product would ship is about 6.7, so six zone hues will never be comfortably separable to a
dichromate. That is not a new concession — `NFR-14` already puts network identity on the octave
pattern and the written names, and `FR-65` calls the channel *partly repaired*. This measurement
supports that position and removes an outright collision from underneath it.

**The exemption — ratified, and two proposals withdrawn.**

Only one of the three structural exemptions proposed on 2026-09-14 is needed, and it is the one
ratified:

> **The bubble contour over a zone tint** (2.7–2.9 / 2.7–3.0) is **not** held to the 3:1 edge floor.
> That floor binds the two *edge kinds* — the marks that carry relationships. A body's own outline is
> not an edge. `DESIGN.md` argues this and flags it `[ASSUMPTION]`, *"nobody stated it"*. This states
> it, and it tells whoever writes the `AD-28` gate not to classify the contour as an edge.

The other two were withdrawn after being measured rather than assumed — the original proposal was
wrong on both:

| Withdrawn | Why it is not needed |
| --- | --- |
| Unavailable control text | `ink-3` measures **4.91–5.69:1** on every chassis surface, against the 4.5:1 floor. It **passes**. `DESIGN.md`'s "exempt from the text floor" is the general convention for disabled controls, not a measurement below the floor. |
| Zone tint over canvas | `AD-28` gates five ratios — identifier channel, chassis, health, both edge kinds, focus ring. A tint against its ground is none of them, so nothing checks it and nothing needs excusing. |

**One clarification, still worth writing into the token file.** `NFR-11` already exempts the staleness
veil and says the health mark misses its 4:1 floor under it. `DESIGN.md` puts the figure at **2.1:1 at
full veil**. Recording the number rather than the category lets the gate assert a value.

## 5. Recommended tint values

Re-optimised 2026-09-15 with the aesthetic constraints the first candidate set lacked: an even hue
rotation (six slots, ~60° apart, best global offset searched) and a chroma floor, so no entry is a
neutral grey pretending to be a hue. Held to C\* ≤ 12 — the shipped palette's own ceiling — so the
register does not move.

**Dark** — rotation offset 45°; min ΔE00 deuteranopia **3.38**, protanopia 3.39, normal vision 7.53

| Token | Value | C\* | Hue | Contrast vs ground |
|---|---|---|---|---|
| `zone-tint-1` | `#261A12` | 8.9 | 59° | 1.183 |
| `zone-tint-2` | `#1E1802` | 11.8 | 93° | 1.134 |
| `zone-tint-3` | `#141A16` | 4.3 | 155° | 1.136 |
| `zone-tint-4` | `#081C22` | 8.7 | 229° | 1.146 |
| `zone-tint-5` | `#121826` | 10.7 | 281° | 1.131 |
| `zone-tint-6` | `#201A1E` | 4.2 | 337° | 1.173 |

**Light** — rotation offset 51°; min ΔE00 deuteranopia **3.81**, protanopia 3.74, normal vision 7.84

| Token | Value | C\* | Hue | Contrast vs ground |
|---|---|---|---|---|
| `zone-tint-1-light` | `#F2D8DE` | 10.0 | 2° | 1.180 |
| `zone-tint-2-light` | `#EADCD4` | 6.6 | 59° | 1.178 |
| `zone-tint-3-light` | `#E0E0CA` | 11.4 | 109° | 1.178 |
| `zone-tint-4-light` | `#C8E8E2` | 11.6 | 183° | 1.148 |
| `zone-tint-5-light` | `#CEE4EC` | 8.5 | 228° | 1.160 |
| `zone-tint-6-light` | `#D8DEF4` | 11.6 | 281° | 1.179 |

Against the shipped set: the dark worst pair goes from 1.30 to 3.38, the light from 0.00 to 3.81, and
normal-vision separation improves too (6.4–6.6 → 7.5–7.8). Every tint stays inside the 1.13–1.19
iso-luminant band, so every edge floor measured against a single tint survives unchanged.

**Still to do before these are normative:** the isolines (`zone-isoline-1…6` and their `-light`
counterparts) must be re-derived from whichever tints land, and the `zone blob` and
`pastille-network` values checked against their own floors. This file does not re-compute them.

## 6. Applied, 2026-09-15

The tints were accepted and the rotation is now normative in `DESIGN.md` — **36 tokens**, not 12.
The zone tint, the isoline and the network pastille each carry the same hue (measured at 0–2° apart
on the new set, against up to 15° on the shipped one), so a network reads as one hue from its field
to its badge. Changing the tints without the other two would have broken `FR-65`, where the hue is
what holds a network's identity across reading levels.

Every floor re-verified on the applied set: isoline 3.56–3.62:1 over its own tint against 3:1;
pastille 5.13–5.62:1 on the body against 4.5:1 and 4.08–4.88:1 over its tint against the mode-B 4:1;
every tint inside the 1.13–1.19 iso-luminant band; tint separation 3.38/3.39 dark and 3.81/3.74
light under deuteranopia/protanopia.

**One thing this run discovered and wrote into `DESIGN.md`, because it existed nowhere.** The first
derivation met every single contrast floor with values like `#FF3C00` and `#D500FF` — fully saturated
neon. **The floors do not constrain saturation.** What holds the chart register is a chroma and
lightness band that was never written down, only implied by the shipped values: tints at C\* 4–12,
isolines at C\* 17–40 and L\* 41–49, pastilles at C\* 18–35 and L\* 44–56. It is now a comment on the
token block, and it belongs in the `AD-23` token file as data — otherwise the next re-derivation
passes every gate and destroys the brand, exactly as the first one here did.

**Known consequence:** every network changes colour. Only network 2 stays near its shipped hue. Any
existing screenshot or mock is now stale.

## 7. What is now unblocked

The tokens story can declare a complete exemption set and a numeric threshold, so the `AD-28` gate
can be **written** rather than deferred. It will still start red on the shipped tints until the values
above (or design's own) are applied — red for the reason `AD-28` calls the gate working, not the
reason it calls the gate broken.
