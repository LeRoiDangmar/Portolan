import { describe, expect, it } from 'vitest';

import type { IdentityKey } from './identity.ts';
import {
  OBJECT_KINDS,
  compareIdentityKeys,
  globalTaskKey,
  identityKind,
  isIdentityKey,
  networkKey,
  nodeKey,
  parseIdentityKey,
  replicatedTaskKey,
  serviceKey,
  sortByIdentityKey,
  stackKey,
  volumeKey,
} from './identity.ts';

/**
 * AD-5 and AD-7, the two halves that have to agree.
 *
 * The expected key strings below are written out as literals rather than assembled from
 * the builders, on story 2's rule: an expectation generated from the code under test
 * agrees with it by construction and catches nothing. They are transcribed from this
 * story's I/O matrix and from AD-5's own table.
 */

describe('the key is qualified by object kind (AD-5)', () => {
  it.each([
    ['replicated task', replicatedTaskKey('blog', 'web', 3), 'container:blog/web/3'],
    ['global task', globalTaskKey('infra', 'agent', 'n7'), 'container:infra/agent/n7'],
    ['standalone service task', replicatedTaskKey('', 'adhoc', 1), 'container:/adhoc/1'],
    ['volume', volumeKey('web'), 'volume:web'],
    ['network', networkKey('web'), 'network:web'],
    ['node', nodeKey('k7f2a9'), 'node:k7f2a9'],
    ['service', serviceKey('9xz1qq'), 'service:9xz1qq'],
    ['stack', stackKey('blog'), 'stack:blog'],
  ])('builds the %s key', (_what, built, expected) => {
    expect(built).toBe(expected);
  });

  it('gives a volume and a network of the same name two distinct keys', () => {
    expect(volumeKey('web')).not.toBe(networkKey('web'));
    expect(compareIdentityKeys(volumeKey('web'), networkKey('web'))).not.toBe(0);
  });

  it('gives every kind a distinct key for one shared name', () => {
    const keys = [
      nodeKey('web'),
      networkKey('web'),
      volumeKey('web'),
      stackKey('web'),
      serviceKey('web'),
    ];
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('qualifies by every one of FR-6’s six kinds and nothing else', () => {
    expect([...OBJECT_KINDS]).toEqual([
      'node',
      'network',
      'volume',
      'stack',
      'service',
      'container',
    ]);
  });
});

describe('the parser reads back what the builders wrote', () => {
  it('reads a replicated task', () => {
    expect(parseIdentityKey('container:blog/web/3')).toEqual({
      kind: 'container',
      stack: 'blog',
      service: 'web',
      instance: '3',
    });
  });

  it('reads a global task', () => {
    expect(parseIdentityKey('container:infra/agent/n7')).toEqual({
      kind: 'container',
      stack: 'infra',
      service: 'agent',
      instance: 'n7',
    });
  });

  it('reads a standalone service task, whose stack segment is empty', () => {
    expect(parseIdentityKey('container:/adhoc/1')).toEqual({
      kind: 'container',
      stack: '',
      service: 'adhoc',
      instance: '1',
    });
  });

  it.each([
    ['node:k7f2a9', { kind: 'node', id: 'k7f2a9' }],
    ['service:9xz1qq', { kind: 'service', id: '9xz1qq' }],
    ['stack:blog', { kind: 'stack', name: 'blog' }],
    ['network:frontend', { kind: 'network', name: 'frontend' }],
    ['volume:pgdata', { kind: 'volume', name: 'pgdata' }],
  ])('reads %s', (key, expected) => {
    expect(parseIdentityKey(key)).toEqual(expected);
  });

  it('reports the kind without the caller parsing', () => {
    expect(identityKind('container:blog/web/3' as IdentityKey)).toBe('container');
    expect(identityKind('volume:pgdata' as IdentityKey)).toBe('volume');
  });

  it.each([
    ['no separator', 'volume'],
    ['an unknown kind', 'image:nginx'],
    ['an empty body', 'volume:'],
    ['too few container segments', 'container:blog/web'],
    ['too many container segments', 'container:blog/web/3/extra'],
    ['a separator inside a name', 'volume:pg/data'],
    ['a colon inside a name', 'volume:pg:data'],
    ['an empty service segment', 'container:blog//3'],
    ['an empty slot segment', 'container:blog/web/'],
    ['a name Docker could not have issued', 'volume:-leading-dash'],
  ])('rejects %s', (_what, key) => {
    expect(() => parseIdentityKey(key)).toThrow(/identity key/);
    expect(isIdentityKey(key)).toBe(false);
  });

  it('accepts every key the builders produce', () => {
    const keys = [
      replicatedTaskKey('blog', 'web', 3),
      replicatedTaskKey('', 'adhoc', 1),
      globalTaskKey('infra', 'agent', 'n7'),
      nodeKey('k7f2a9'),
      serviceKey('9xz1qq'),
      stackKey('blog'),
      networkKey('frontend'),
      volumeKey('pg-data.1'),
    ];
    for (const key of keys) expect(isIdentityKey(key)).toBe(true);
  });
});

/**
 * A sample spanning all six kinds, deliberately including near-collisions: two kinds with
 * one name, two tasks of one service, and a stack whose name prefixes another.
 */
const SAMPLE: readonly IdentityKey[] = [
  'container:blog/web/1',
  'container:blog/web/2',
  'container:blog/web/10',
  'container:/adhoc/1',
  'container:infra/agent/n7',
  'network:web',
  'network:frontend',
  'volume:web',
  'volume:pgdata',
  'volume:pg-data',
  'node:k7f2a9',
  'service:9xz1qq',
  'stack:blog',
  'stack:blog-staging',
];

/** A fixed permutation, so "any input order" is a reproducible input order. */
const rotate = <T>(items: readonly T[], by: number): readonly T[] => [
  ...items.slice(by),
  ...items.slice(0, by),
];

describe('the comparator is one total order (AD-7)', () => {
  it('compares a key equal to itself, and to nothing else', () => {
    for (const a of SAMPLE) {
      for (const b of SAMPLE) {
        expect(compareIdentityKeys(a, b) === 0).toBe(a === b);
      }
    }
  });

  it('is antisymmetric', () => {
    for (const a of SAMPLE) {
      for (const b of SAMPLE) {
        // Summed rather than negated and compared: `Math.sign(0)` is `+0` one way round
        // and `-0` the other, and `Object.is` tells those two apart.
        expect(Math.sign(compareIdentityKeys(a, b)) + Math.sign(compareIdentityKeys(b, a))).toBe(0);
      }
    }
  });

  it('is transitive', () => {
    for (const a of SAMPLE) {
      for (const b of SAMPLE) {
        for (const c of SAMPLE) {
          if (compareIdentityKeys(a, b) <= 0 && compareIdentityKeys(b, c) <= 0) {
            expect(compareIdentityKeys(a, c)).toBeLessThanOrEqual(0);
          }
        }
      }
    }
  });

  it('orders a collection independently of the order it arrived in', () => {
    const objects = SAMPLE.map((key) => ({ key }));
    const sorted = sortByIdentityKey(objects).map((object) => object.key);
    for (const by of [0, 1, 5, 9, 13]) {
      expect(sortByIdentityKey(rotate(objects, by)).map((object) => object.key)).toEqual(sorted);
    }
    expect(sortByIdentityKey([...objects].reverse()).map((object) => object.key)).toEqual(sorted);
  });

  it('leaves the collection it was given untouched', () => {
    const objects = SAMPLE.map((key) => ({ key }));
    const before = objects.map((object) => object.key);
    sortByIdentityKey(objects);
    expect(objects.map((object) => object.key)).toEqual(before);
  });

  it('sorts by the key string, so the six kinds group and never interleave', () => {
    // Re-derived independently: the key is `<kind>:<body>`, the separator `:` (0x3A) is
    // below every character Docker admits in a name, so a whole kind sorts as one run.
    const kinds = sortByIdentityKey(SAMPLE.map((key) => ({ key }))).map((object) =>
      object.key.slice(0, object.key.indexOf(':')),
    );
    expect(kinds).toEqual([...new Set(kinds)].flatMap((kind) => kinds.filter((k) => k === kind)));
  });
});
