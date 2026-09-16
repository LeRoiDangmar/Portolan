import { describe, expect, it } from 'vitest';

import type { Edge } from './edges.ts';
import { EDGE_KINDS, EDGE_RULES, compareEdges, sortEdges } from './edges.ts';
import {
  networkKey,
  nodeKey,
  parseIdentityKey,
  replicatedTaskKey,
  serviceKey,
  stackKey,
  volumeKey,
} from './identity.ts';

/**
 * The ER diagram, and AD-7's order extended to edges.
 *
 * The expected shapes below are transcribed from the spine's *Core entities* diagram
 * rather than read back from `EDGE_RULES`, on story 2's rule: an expectation generated
 * from the table under test agrees with it whatever the table says.
 */

describe('the edge kinds are the ER diagram’s relationships', () => {
  it('names five kinds and no more', () => {
    expect([...EDGE_KINDS]).toEqual(['hosts', 'groups', 'runs', 'attachment', 'mount']);
  });

  it.each([
    ['hosts', ['node'], ['container', 'volume'], 'one-to-many'],
    ['groups', ['stack'], ['service'], 'one-to-many'],
    ['runs', ['service'], ['container'], 'one-to-many'],
    ['attachment', ['container', 'service'], ['network'], 'many-to-many'],
    ['mount', ['container'], ['volume'], 'many-to-many'],
  ] as const)('joins %s from %j to %j, %s', (kind, from, to, cardinality) => {
    expect([...EDGE_RULES[kind].from]).toEqual([...from]);
    expect([...EDGE_RULES[kind].to]).toEqual([...to]);
    expect(EDGE_RULES[kind].cardinality).toBe(cardinality);
  });

  it('names only object kinds the identity parser knows', () => {
    const specimen = {
      node: nodeKey('n7'),
      network: networkKey('frontend'),
      volume: volumeKey('pgdata'),
      stack: stackKey('blog'),
      service: serviceKey('svcweb'),
      container: replicatedTaskKey('blog', 'web', 3),
    } as const;
    for (const kind of EDGE_KINDS) {
      for (const end of [...EDGE_RULES[kind].from, ...EDGE_RULES[kind].to]) {
        expect(parseIdentityKey(specimen[end]).kind).toBe(end);
      }
    }
  });
});

const WEB3 = replicatedTaskKey('blog', 'web', 3);
const WEB4 = replicatedTaskKey('blog', 'web', 4);

/**
 * Deliberately adjacent edges: two mounts differing only in path, two differing only in
 * the flag, two attachments differing only in whether an address is present, and two
 * `hosts` edges differing only in the endpoint.
 */
const SAMPLE: readonly Edge[] = [
  { kind: 'hosts', from: nodeKey('n7'), to: WEB3 },
  { kind: 'hosts', from: nodeKey('n7'), to: WEB4 },
  { kind: 'hosts', from: nodeKey('n8'), to: volumeKey('pgdata') },
  { kind: 'groups', from: stackKey('blog'), to: serviceKey('svcweb') },
  { kind: 'runs', from: serviceKey('svcweb'), to: WEB3 },
  { kind: 'attachment', from: WEB3, to: networkKey('frontend') },
  { kind: 'attachment', from: WEB3, to: networkKey('frontend'), address: '10.0.1.7' },
  { kind: 'attachment', from: WEB3, to: networkKey('frontend'), address: '10.0.1.8' },
  { kind: 'mount', from: WEB3, to: volumeKey('pgdata'), path: '/backup', access: 'ro' },
  { kind: 'mount', from: WEB3, to: volumeKey('pgdata'), path: '/backup', access: 'rw' },
  { kind: 'mount', from: WEB3, to: volumeKey('pgdata'), path: '/var/lib/data', access: 'rw' },
];

/** A fixed permutation, so "any input order" is a reproducible input order. */
const rotate = <T>(items: readonly T[], by: number): readonly T[] => [
  ...items.slice(by),
  ...items.slice(0, by),
];

describe('the edge comparator is one total order (AD-7)', () => {
  it('separates two edges that differ only in the mount path', () => {
    const [a, b] = [SAMPLE[9], SAMPLE[10]];
    expect(a && b).toBeTruthy();
    expect(compareEdges(a as Edge, b as Edge)).not.toBe(0);
  });

  it('separates two edges that differ only in the rw/ro flag', () => {
    const [a, b] = [SAMPLE[8], SAMPLE[9]];
    expect(a && b).toBeTruthy();
    expect(compareEdges(a as Edge, b as Edge)).not.toBe(0);
  });

  it('separates an attachment with an address from one without', () => {
    const absent = SAMPLE[5];
    const present = SAMPLE[6];
    expect(absent && present).toBeTruthy();
    expect(compareEdges(absent as Edge, present as Edge)).toBe(-1);
    expect(compareEdges(present as Edge, absent as Edge)).toBe(1);
  });

  it('does not treat an absent address as an empty one', () => {
    const absent: Edge = { kind: 'attachment', from: WEB3, to: networkKey('frontend') };
    const empty: Edge = {
      kind: 'attachment',
      from: WEB3,
      to: networkKey('frontend'),
      address: '',
    };
    expect(compareEdges(absent, empty)).not.toBe(0);
  });

  it('compares an edge equal to itself, and to no other edge in the sample', () => {
    for (const a of SAMPLE) {
      for (const b of SAMPLE) {
        expect(compareEdges(a, b) === 0).toBe(a === b);
      }
    }
  });

  it('is antisymmetric', () => {
    for (const a of SAMPLE) {
      for (const b of SAMPLE) {
        expect(Math.sign(compareEdges(a, b)) + Math.sign(compareEdges(b, a))).toBe(0);
      }
    }
  });

  it('is transitive', () => {
    for (const a of SAMPLE) {
      for (const b of SAMPLE) {
        for (const c of SAMPLE) {
          if (compareEdges(a, b) <= 0 && compareEdges(b, c) <= 0) {
            expect(compareEdges(a, c)).toBeLessThanOrEqual(0);
          }
        }
      }
    }
  });

  it('orders a collection independently of the order it arrived in', () => {
    const sorted = sortEdges(SAMPLE);
    for (const by of [0, 1, 4, 7, 10]) {
      expect(sortEdges(rotate(SAMPLE, by))).toEqual(sorted);
    }
    expect(sortEdges([...SAMPLE].reverse())).toEqual(sorted);
  });

  it('leaves the collection it was given untouched', () => {
    const given = [...SAMPLE];
    sortEdges(given);
    expect(given).toEqual([...SAMPLE]);
  });

  it('groups by kind, so no two kinds interleave', () => {
    const kinds = sortEdges(SAMPLE).map((edge) => edge.kind);
    expect(kinds).toEqual([...new Set(kinds)].flatMap((kind) => kinds.filter((k) => k === kind)));
  });
});
