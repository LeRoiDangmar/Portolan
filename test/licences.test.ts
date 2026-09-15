import { describe, expect, it } from 'vitest';

// @ts-expect-error — a plain .mjs tooling script with no declarations.
import { satisfied } from '../scripts/check-licences.mjs';

/**
 * Every licence currently installed is a bare identifier, so the expression parser
 * never runs in CI. Without this table the whole of it — and the rejection path the
 * NFR-17 gate exists for — is untested code.
 */
describe('AGPLv3 compatibility of an SPDX expression', () => {
  it.each([
    ['MIT', true, 'a bare allowed identifier'],
    ['SSPL-1.0', false, 'a bare disallowed identifier'],
    ['MIT OR SSPL-1.0', true, 'OR needs one side allowed'],
    ['SSPL-1.0 OR LicenseRef-proprietary', false, 'OR with neither side allowed'],
    ['MIT AND SSPL-1.0', false, 'AND needs both sides allowed'],
    ['MIT AND ISC', true, 'AND with both sides allowed'],
    ['(MIT OR Apache-2.0) AND ISC', true, 'a parenthesised nested expression'],
    ['(MIT OR SSPL-1.0) AND (SSPL-1.0)', false, 'parens that do not balance across the whole'],
    ['GPL-3.0-or-later', true, 'an -or-later identifier is not an OR expression'],
    ['LGPL-2.1-or-later OR SSPL-1.0', true, 'an -or-later identifier beside a real OR'],
    ['GPL-2.0+', true, 'the + suffix reads as -or-later'],
    ['Apache-2.0 WITH LLVM-exception', true, 'WITH defers to the licence'],
    ['SSPL-1.0 WITH LLVM-exception', false, 'WITH does not rescue a disallowed licence'],
    ['', false, 'the empty string — a missing licence field is rejected, not assumed'],
    ['   ', false, 'whitespace only'],
  ])('%s -> %s (%s)', (expression, expected) => {
    expect(satisfied(expression)).toBe(expected);
  });

  it('is case-insensitive on identifiers and operators', () => {
    expect(satisfied('mit or sspl-1.0')).toBe(true);
    expect(satisfied('mit and sspl-1.0')).toBe(false);
  });
});
