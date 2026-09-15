/**
 * NFR-11 / NFR-13 (AD-28): the colour arithmetic the contrast gate is computed from.
 *
 * A port of the reference implementation the design measurements came out of —
 * `_bmad-output/planning-artifacts/ux-designs/ux-Portolan-2026-09-10/palette-cvd-check.py`
 * and its companion `palette-cvd-tune.py`. Ported, not installed: the colour maths has
 * no named dependency anywhere in the stack, and a gate must not widen the AGPLv3
 * filter's surface to compute a ratio.
 *
 * `palette-cvd-tune.py`'s hill-climbing search is deliberately NOT ported. A gate
 * measures; it does not search for a palette that would pass.
 *
 * Every function here is pure and exported, so `test/colour.test.ts` can drive the
 * same code the gate runs against `palette-cvd-analysis.md`'s published figures. If
 * the port disagrees with the document, the gate is measuring something else.
 *
 * One deliberate difference from the Python, and it is the only one:
 * `relativeLuminance` uses WCAG's rounded coefficients (0.2126 / 0.7152 / 0.0722)
 * rather than the full-precision sRGB-to-Y row the reference used (0.2126729 /
 * 0.7151522 / 0.0721750). NFR-11 cites WCAG, so the gate computes WCAG's number.
 * `luminanceY` keeps the full-precision row for the XYZ/Lab path, where it belongs.
 */

/** `#RRGGBB` (or `#rgb`) to three 0–255 channel values. */
export const hexToRgb = (hex) => {
  const text = String(hex).trim().replace(/^#/, '');
  const full =
    text.length === 3
      ? text
          .split('')
          .map((c) => c + c)
          .join('')
      : text;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) throw new Error(`Not a hex colour: ${hex}`);
  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
  ];
};

/** Three 0–255 channel values to `#RRGGBB`, rounded and clamped, upper case. */
export const rgbToHex = (rgb) =>
  `#${rgb
    .map((value) =>
      Math.max(0, Math.min(255, Math.round(value)))
        .toString(16)
        .padStart(2, '0')
        .toUpperCase(),
    )
    .join('')}`;

/** sRGB transfer function, 0–255 encoded to linear-light 0–1. */
export const srgbToLinear = (channel) => {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

/** The inverse transfer function, linear-light 0–1 back to a 0–255 encoded channel. */
export const linearToSrgb = (linear) => {
  const c = Math.max(0, Math.min(1, linear));
  const v = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
  return v * 255;
};

/**
 * WCAG relative luminance, with WCAG's own rounded coefficients. This is the number
 * `contrastRatio` is built from and the number every floor in `floors.ts` is stated
 * against.
 */
export const relativeLuminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map(srgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** WCAG contrast ratio. Order-independent: the lighter colour is always the numerator. */
export const contrastRatio = (a, b) => {
  const first = relativeLuminance(a);
  const second = relativeLuminance(b);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Viénot, Brettel & Mollon (1999) single-plane dichromacy simulation, on linear sRGB.
 * The three matrices — sRGB to LMS, the projection onto the dichromatic plane, and
 * LMS back to sRGB — are the reference implementation's, digit for digit.
 */
export const DEFICIENCIES = ['deuteranopia', 'protanopia'];

export const simulate = (hex, deficiency = 'deuteranopia') => {
  if (!DEFICIENCIES.includes(deficiency)) {
    throw new Error(
      `Unknown deficiency: ${deficiency}. Expected one of ${DEFICIENCIES.join(', ')}`,
    );
  }
  const [r, g, b] = hexToRgb(hex).map(srgbToLinear);

  const L = 17.8824 * r + 43.5161 * g + 4.11935 * b;
  const M = 3.45565 * r + 27.1554 * g + 3.86714 * b;
  const S = 0.0299566 * r + 0.184309 * g + 1.46709 * b;

  const [L2, M2, S2] =
    deficiency === 'deuteranopia'
      ? [L, 0.494207 * L + 1.24827 * S, S]
      : [2.02344 * M - 2.52581 * S, M, S];

  return rgbToHex([
    linearToSrgb(0.0809444479 * L2 - 0.130504409 * M2 + 0.116721066 * S2),
    linearToSrgb(-0.0102485335 * L2 + 0.0540193266 * M2 - 0.113614708 * S2),
    linearToSrgb(-0.000365296938 * L2 - 0.00412161469 * M2 + 0.693511405 * S2),
  ]);
};

/**
 * CIE XYZ at D65, from the full-precision sRGB matrix. Kept separate from
 * `relativeLuminance`: the Lab path wants the exact row, WCAG wants its own.
 */
export const xyz = (hex) => {
  const [r, g, b] = hexToRgb(hex).map(srgbToLinear);
  return [
    0.4124564 * r + 0.3575761 * g + 0.1804375 * b,
    0.2126729 * r + 0.7151522 * g + 0.072175 * b,
    0.0193339 * r + 0.119192 * g + 0.9503041 * b,
  ];
};

/** CIELAB at the D65 white point, as `[L*, a*, b*]`. */
export const lab = (hex) => {
  const [X, Y, Z] = xyz(hex);
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (841 / 108) * t + 4 / 29);
  const fx = f(X / 0.95047);
  const fy = f(Y / 1.0);
  const fz = f(Z / 1.08883);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
};

/** C*ab — chroma in CIELAB. The free variable `palette-cvd-analysis.md` §2 names. */
export const chroma = (hex) => {
  const [, a, b] = lab(hex);
  return Math.hypot(a, b);
};

/** h_ab — CIELAB hue angle in degrees, 0–360. */
export const hue = (hex) => {
  const [, a, b] = lab(hex);
  return ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
};

const radians = (degrees) => (degrees * Math.PI) / 180;

/** CIE76 colour difference — the plain Euclidean distance in Lab. */
export const deltaE76 = (a, b) => {
  const first = lab(a);
  const second = lab(b);
  return Math.hypot(first[0] - second[0], first[1] - second[1], first[2] - second[2]);
};

/**
 * CIEDE2000 colour difference, complete with the chroma and hue weighting functions
 * and the rotation term. This is the metric `palette-cvd-analysis.md` states every
 * separation figure in, and therefore the metric NFR-13's threshold is expressed in.
 */
export const deltaE2000 = (first, second) => {
  const [L1, a1, b1] = lab(first);
  const [L2, a2, b2] = lab(second);

  const C1 = Math.hypot(a1, b1);
  const C2 = Math.hypot(a2, b2);
  const Cbar = (C1 + C2) / 2;
  const G = Cbar > 0 ? 0.5 * (1 - Math.sqrt(Cbar ** 7 / (Cbar ** 7 + 25 ** 7))) : 0.5;

  const a1p = (1 + G) * a1;
  const a2p = (1 + G) * a2;
  const C1p = Math.hypot(a1p, b1);
  const C2p = Math.hypot(a2p, b2);
  const h1p = ((Math.atan2(b1, a1p) * 180) / Math.PI + 360) % 360;
  const h2p = ((Math.atan2(b2, a2p) * 180) / Math.PI + 360) % 360;

  const dLp = L2 - L1;
  const dCp = C2p - C1p;

  let dhp;
  if (C1p * C2p === 0) dhp = 0;
  else if (Math.abs(h2p - h1p) <= 180) dhp = h2p - h1p;
  else if (h2p - h1p > 180) dhp = h2p - h1p - 360;
  else dhp = h2p - h1p + 360;
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(radians(dhp) / 2);

  const Lbp = (L1 + L2) / 2;
  const Cbp = (C1p + C2p) / 2;

  let hbp;
  if (C1p * C2p === 0) hbp = h1p + h2p;
  else if (Math.abs(h1p - h2p) <= 180) hbp = (h1p + h2p) / 2;
  else if (h1p + h2p < 360) hbp = (h1p + h2p + 360) / 2;
  else hbp = (h1p + h2p - 360) / 2;

  const T =
    1 -
    0.17 * Math.cos(radians(hbp - 30)) +
    0.24 * Math.cos(radians(2 * hbp)) +
    0.32 * Math.cos(radians(3 * hbp + 6)) -
    0.2 * Math.cos(radians(4 * hbp - 63));

  const dTheta = 30 * Math.exp(-(((hbp - 275) / 25) ** 2));
  const Rc = Cbp > 0 ? 2 * Math.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7)) : 0;
  const Sl = 1 + (0.015 * (Lbp - 50) ** 2) / Math.sqrt(20 + (Lbp - 50) ** 2);
  const Sc = 1 + 0.045 * Cbp;
  const Sh = 1 + 0.015 * Cbp * T;
  const Rt = -Math.sin(radians(2 * dTheta)) * Rc;

  return Math.sqrt(
    (dLp / Sl) ** 2 + (dCp / Sc) ** 2 + (dHp / Sh) ** 2 + Rt * (dCp / Sc) * (dHp / Sh),
  );
};

/**
 * Source-over compositing of `over` at `alpha` on top of `under`, in ENCODED sRGB —
 * which is what a browser does for an ordinary translucent overlay, and therefore
 * what the staleness veil actually is on screen.
 *
 * Encoded rather than linear is not a shortcut: it is the form that reproduces
 * `DESIGN.md`'s own veiled figure. The stopped health mark on the bubble body
 * measures 4.22:1 bare and 2.13:1 under the full veil, against the 2.1:1 `DESIGN.md`
 * records; composited in linear light the same pair reads 2.90:1, which is not a
 * number any upstream document states.
 *
 * The veil is the one place the gate needs compositing at all. Everywhere else
 * `{opacity.zone-field-cap}` clamps the worst composite back to a single tint, which
 * is what makes the edge floors checkable from colour values alone.
 */
export const composite = (over, under, alpha) => {
  const top = hexToRgb(over);
  const bottom = hexToRgb(under);
  return rgbToHex(top.map((value, index) => value * alpha + bottom[index] * (1 - alpha)));
};

/** Every unordered pair of a list, in input order. */
export const pairs = (items) => {
  const out = [];
  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) out.push([items[i], items[j]]);
  }
  return out;
};

/**
 * The minimum pairwise CIEDE2000 separation of a set of colours as a dichromate sees
 * them, with the pair that achieves it. This is NFR-13's measurement, in one call.
 */
export const minimumSeparation = (entries, deficiency) => {
  const simulated = entries.map(([name, value]) => [name, value, simulate(value, deficiency)]);
  let worst = null;
  for (const [a, b] of pairs(simulated)) {
    const delta = deltaE2000(a[2], b[2]);
    if (worst === null || delta < worst.delta) {
      worst = {
        delta,
        deficiency,
        a: { token: a[0], value: a[1], simulated: a[2] },
        b: { token: b[0], value: b[1], simulated: b[2] },
      };
    }
  }
  if (worst === null) throw new Error('Separation needs at least two colours.');
  return worst;
};
