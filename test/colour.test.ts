import { describe, expect, it } from 'vitest';

// @ts-expect-error — a plain .mjs tooling script with no declarations.
import * as maths from '../scripts/colour.mjs';

const {
  chroma,
  composite,
  contrastRatio,
  deltaE2000,
  deltaE76,
  hexToRgb,
  hue,
  lab,
  linearToSrgb,
  minimumSeparation,
  relativeLuminance,
  rgbToHex,
  simulate,
  srgbToLinear,
} = maths;

/**
 * `scripts/colour.mjs` is a port of `palette-cvd-check.py`, the reference implementation
 * every figure in `palette-cvd-analysis.md` came out of. If the port disagrees with that
 * document, the AD-28 gate is measuring something else — so this table drives the port
 * against the document's PUBLISHED numbers rather than against numbers the port
 * produced.
 *
 * Every expectation below is quoted from a specific place in a specific file. None was
 * obtained by running this code and writing down the answer.
 */

/** DESIGN.md's shipped zone tints — the NFR-13 defect, superseded by the token file. */
const SUPERSEDED = {
  dark: {
    'zone-tint-1': '#0B1E28',
    'zone-tint-2': '#1B1710',
    'zone-tint-3': '#17161E',
    'zone-tint-4': '#0F2015',
    'zone-tint-5': '#231521',
    'zone-tint-6': '#141C2B',
  },
  light: {
    'zone-tint-1': '#D7E6EC',
    'zone-tint-2': '#EDE3CF',
    'zone-tint-3': '#E3E1EC',
    'zone-tint-4': '#D9E7DC',
    'zone-tint-5': '#F0DEE4',
    'zone-tint-6': '#DDE1EF',
  },
};

/** palette-cvd-analysis.md §5 — the adopted register. */
const ADOPTED = {
  dark: {
    'zone-tint-1': '#261A12',
    'zone-tint-2': '#1E1802',
    'zone-tint-3': '#141A16',
    'zone-tint-4': '#081C22',
    'zone-tint-5': '#121826',
    'zone-tint-6': '#201A1E',
  },
  light: {
    'zone-tint-1': '#F2D8DE',
    'zone-tint-2': '#EADCD4',
    'zone-tint-3': '#E0E0CA',
    'zone-tint-4': '#C8E8E2',
    'zone-tint-5': '#CEE4EC',
    'zone-tint-6': '#D8DEF4',
  },
};

const GROUND = { dark: '#06080A', light: '#EDF1F3' };

describe('hex and the sRGB transfer function', () => {
  it.each([
    ['#000000', [0, 0, 0]],
    ['#FFFFFF', [255, 255, 255]],
    ['#06080A', [6, 8, 10]],
    ['#abc', [170, 187, 204]],
  ])('%s parses to %s', (hex, rgb) => {
    expect(hexToRgb(hex)).toEqual(rgb);
  });

  it('refuses anything that is not a colour rather than measuring garbage', () => {
    expect(() => hexToRgb('nonsense')).toThrow(/Not a hex colour/);
    expect(() => hexToRgb('#12345')).toThrow(/Not a hex colour/);
  });

  it('round-trips every channel value through linear light', () => {
    for (let channel = 0; channel <= 255; channel += 1) {
      expect(Math.round(linearToSrgb(srgbToLinear(channel)))).toBe(channel);
    }
  });

  it('normalises to upper-case six-digit hex, clamped', () => {
    expect(rgbToHex([6, 8, 10])).toBe('#06080A');
    expect(rgbToHex([-40, 300, 127.6])).toBe('#00FF80');
  });
});

describe('WCAG relative luminance and contrast', () => {
  it('puts black at 0 and white at 1', () => {
    expect(relativeLuminance('#000000')).toBeCloseTo(0, 10);
    expect(relativeLuminance('#FFFFFF')).toBeCloseTo(1, 10);
  });

  it('gives black on white WCAG’s own 21:1', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 10);
  });

  it('is order-independent', () => {
    expect(contrastRatio('#DCE6EC', '#0B1116')).toBeCloseTo(
      contrastRatio('#0B1116', '#DCE6EC'),
      12,
    );
  });

  /**
   * DESIGN.md's own contrast tables, quoted. These are the rows the AD-28 gate is built
   * from; reproducing them to the digit DESIGN.md prints is what says the transcription
   * and the maths are both right.
   */
  it.each([
    ['identifier on bubble body, dark', '#A0AEB8', '#0B1116', 8.4],
    ['identifier on bubble body, light', '#42525E', '#FFFFFF', 8.1],
    ['bubble name on bubble body, dark', '#DCE6EC', '#0B1116', 15.0],
    ['bubble name on bubble body, light', '#10171C', '#FFFFFF', 18.1],
    ['plate text on plate, dark', '#DCE6EC', '#0B1015', 15.1],
    ['health stopped on body, dark', '#BF5747', '#0B1116', 4.2],
    ['bubble contour over canvas, dark', '#4E6470', '#04070A', 3.3],
    ['bubble contour over canvas, light', '#7E8C95', '#EDF1F3', 3.0],
    ['detail-panel values, dark', '#DCE6EC', '#0A0D10', 15.4],
    ['detail-panel keys, dark', '#78858F', '#0A0D10', 5.2],
    ['survey stamp, dark', '#94A3AD', '#080B0E', 7.6],
    ['chart-legend index numeral, light', '#7B6228', '#E7ECEF', 4.9],
    ['tab labels, light', '#10171C', '#DDE4E8', 14.1],
  ])('%s reproduces the ratio DESIGN.md prints', (_row, foreground, background, printed) => {
    // DESIGN.md quotes every ratio to one decimal, so half a last digit is the natural
    // tolerance. It is 0.06 rather than 0.05 for one row: *detail-panel keys* prints
    // 5.2 where the value is 5.149, which rounds to 5.1. A presentation rounding on a
    // row with 0.6 of headroom over its 4.5:1 floor, recorded rather than smoothed.
    expect(
      Math.abs(contrastRatio(foreground, background) - (printed as number)),
    ).toBeLessThanOrEqual(0.06);
  });
});

describe('CIELAB, ΔE76 and ΔE2000', () => {
  it('puts the D65 white point at L* 100 with no chroma', () => {
    const [lightness, a, b] = lab('#FFFFFF');
    expect(lightness).toBeCloseTo(100, 4);
    expect(a).toBeCloseTo(0, 3);
    expect(b).toBeCloseTo(0, 3);
    expect(chroma('#FFFFFF')).toBeCloseTo(0, 3);
  });

  it('reports zero difference between a colour and itself', () => {
    expect(deltaE76('#4A8296', '#4A8296')).toBe(0);
    expect(deltaE2000('#4A8296', '#4A8296')).toBe(0);
  });

  it('is symmetric', () => {
    expect(deltaE2000('#0B1E28', '#1B1710')).toBeCloseTo(deltaE2000('#1B1710', '#0B1E28'), 12);
  });
});

describe('palette-cvd-analysis.md §1 — what is broken, reproduced', () => {
  it('collapses light tints 1 and 3 to a byte-identical simulated value', () => {
    const one = simulate(SUPERSEDED.light['zone-tint-1'], 'deuteranopia');
    const three = simulate(SUPERSEDED.light['zone-tint-3'], 'deuteranopia');
    expect(one).toBe('#E2E2EC');
    expect(three).toBe('#E2E2EC');
    expect(deltaE2000(one, three)).toBeCloseTo(0.0, 6);
  });

  it.each([
    ['light', 'zone-tint-1', 'zone-tint-6', '#E2E2EC', '#E0E0EF', 2.17],
    ['light', 'zone-tint-3', 'zone-tint-6', '#E2E2EC', '#E0E0EF', 2.17],
    ['dark', 'zone-tint-2', 'zone-tint-4', '#181810', '#1C1C15', 1.3],
    ['dark', 'zone-tint-3', 'zone-tint-5', '#16161E', '#1A1A21', 1.42],
    ['dark', 'zone-tint-1', 'zone-tint-6', '#1A1A28', '#1A1A2B', 1.57],
  ])(
    '%s %s / %s simulate to %s / %s at ΔE00 %s',
    (palette, first, second, simulatedFirst, simulatedSecond, delta) => {
      const set = SUPERSEDED[palette as 'dark' | 'light'] as Record<string, string>;
      const a = simulate(set[first as string], 'deuteranopia');
      const b = simulate(set[second as string], 'deuteranopia');
      expect(a).toBe(simulatedFirst);
      expect(b).toBe(simulatedSecond);
      expect(deltaE2000(a, b)).toBeCloseTo(delta as number, 2);
    },
  );

  it('finds the worst pair §1 names, in each palette', () => {
    const worstLight = minimumSeparation(Object.entries(SUPERSEDED.light), 'deuteranopia');
    expect([worstLight.a.token, worstLight.b.token]).toEqual(['zone-tint-1', 'zone-tint-3']);
    expect(worstLight.delta).toBeCloseTo(0.0, 6);

    const worstDark = minimumSeparation(Object.entries(SUPERSEDED.dark), 'deuteranopia');
    expect([worstDark.a.token, worstDark.b.token]).toEqual(['zone-tint-2', 'zone-tint-4']);
    expect(worstDark.delta).toBeCloseTo(1.3, 2);
  });
});

describe('palette-cvd-analysis.md §5 — the adopted register, reproduced', () => {
  /** §5's dark table: value, C*, hue, contrast against the ground. */
  it.each([
    ['zone-tint-1', 8.9, 59, 1.183],
    ['zone-tint-2', 11.8, 93, 1.134],
    ['zone-tint-3', 4.3, 155, 1.136],
    ['zone-tint-4', 8.7, 229, 1.146],
    ['zone-tint-5', 10.7, 281, 1.131],
    ['zone-tint-6', 4.2, 337, 1.173],
  ])('dark %s sits at C* %s, hue %s°, contrast %s', (token, c, h, contrast) => {
    const value = (ADOPTED.dark as Record<string, string>)[token as string];
    expect(chroma(value)).toBeCloseTo(c as number, 1);
    expect(hue(value)).toBeCloseTo(h as number, 0);
    expect(contrastRatio(value, GROUND.dark)).toBeCloseTo(contrast as number, 3);
  });

  /** §5's light table. */
  it.each([
    ['zone-tint-1', 10.0, 2, 1.18],
    ['zone-tint-2', 6.6, 59, 1.178],
    ['zone-tint-3', 11.4, 109, 1.178],
    ['zone-tint-4', 11.6, 183, 1.148],
    ['zone-tint-5', 8.5, 228, 1.16],
    ['zone-tint-6', 11.6, 281, 1.179],
  ])('light %s sits at C* %s, hue %s°, contrast %s', (token, c, h, contrast) => {
    const value = (ADOPTED.light as Record<string, string>)[token as string];
    expect(chroma(value)).toBeCloseTo(c as number, 1);
    expect(hue(value)).toBeCloseTo(h as number, 0);
    expect(contrastRatio(value, GROUND.light)).toBeCloseTo(contrast as number, 3);
  });

  it.each([
    ['dark', 'deuteranopia', 3.38],
    ['dark', 'protanopia', 3.39],
    ['light', 'deuteranopia', 3.81],
    ['light', 'protanopia', 3.74],
  ])('%s separates under %s at ΔE00 %s', (palette, deficiency, expected) => {
    const worst = minimumSeparation(
      Object.entries(ADOPTED[palette as 'dark' | 'light']),
      deficiency as string,
    );
    expect(worst.delta).toBeCloseTo(expected as number, 2);
    expect(worst.delta).toBeGreaterThanOrEqual(3.0);
  });

  it.each([
    ['dark', 7.53],
    ['light', 7.84],
  ])('%s separates to a trichromat at ΔE00 %s', (palette, expected) => {
    const values = Object.values(ADOPTED[palette as 'dark' | 'light']);
    let lowest = Infinity;
    for (let i = 0; i < values.length; i += 1) {
      for (let j = i + 1; j < values.length; j += 1) {
        lowest = Math.min(lowest, deltaE2000(values[i]!, values[j]!));
      }
    }
    expect(lowest).toBeCloseTo(expected as number, 2);
  });

  it('holds every adopted tint inside the 1.13–1.19 iso-luminant band', () => {
    // This is what makes every edge floor measured against a single tint survive the
    // substitution — palette-cvd-analysis.md §5's closing claim, checked rather than
    // taken on trust.
    for (const palette of ['dark', 'light'] as const) {
      for (const value of Object.values(ADOPTED[palette])) {
        const ratio = contrastRatio(value, GROUND[palette]);
        expect(ratio).toBeGreaterThanOrEqual(1.13);
        expect(ratio).toBeLessThanOrEqual(1.19);
      }
    }
  });
});

describe('the staleness veil', () => {
  /**
   * DESIGN.md: *under the staleness veil the health circle ages with everything else,
   * reaching 2.1:1 at full veil against its own 4:1 floor*. Full veil is
   * `{colors.state-stale}` at alpha 0.42. Red is the binding case — the tightest
   * contrast in the file at 4.22:1 bare.
   */
  it('takes the stopped mark from 4.2:1 to DESIGN.md’s 2.1:1 at full veil', () => {
    const body = '#0B1116';
    const stopped = '#BF5747';
    expect(contrastRatio(stopped, body)).toBeCloseTo(4.2, 1);
    const veiled = contrastRatio(
      composite('#0A0E12', stopped, 0.42),
      composite('#0A0E12', body, 0.42),
    );
    expect(veiled).toBeCloseTo(2.1, 1);
  });

  it('is the identity at alpha 0 and the veil itself at alpha 1', () => {
    expect(composite('#0A0E12', '#BF5747', 0)).toBe('#BF5747');
    expect(composite('#0A0E12', '#BF5747', 1)).toBe('#0A0E12');
  });
});

describe('the simulation itself', () => {
  it('knows only the two deficiencies the threshold is stated over', () => {
    expect(() => simulate('#4A8296', 'tritanopia')).toThrow(/Unknown deficiency/);
  });

  it('leaves a neutral grey where it found it, under both deficiencies', () => {
    // A dichromatic projection moves colours off the confusion axis; the neutral axis
    // is on every confusion line, so grey is a fixed point. A port that got a matrix
    // wrong would tint it.
    for (const deficiency of ['deuteranopia', 'protanopia']) {
      for (const grey of ['#000000', '#808080', '#FFFFFF']) {
        const [r, g, b] = hexToRgb(simulate(grey, deficiency));
        const [r0, g0, b0] = hexToRgb(grey);
        expect(Math.abs(r - r0)).toBeLessThanOrEqual(1);
        expect(Math.abs(g - g0)).toBeLessThanOrEqual(1);
        expect(Math.abs(b - b0)).toBeLessThanOrEqual(1);
      }
    }
  });

  it('is idempotent: simulating an already-simulated colour changes nothing', () => {
    for (const deficiency of ['deuteranopia', 'protanopia']) {
      const once = simulate('#4A8296', deficiency);
      const [r, g, b] = hexToRgb(simulate(once, deficiency));
      const [r0, g0, b0] = hexToRgb(once);
      expect(Math.abs(r - r0)).toBeLessThanOrEqual(1);
      expect(Math.abs(g - g0)).toBeLessThanOrEqual(1);
      expect(Math.abs(b - b0)).toBeLessThanOrEqual(1);
    }
  });

  it('needs two colours before it will report a separation', () => {
    expect(() => minimumSeparation([['only', '#4A8296']], 'deuteranopia')).toThrow(
      /at least two colours/,
    );
  });
});
