import { describe, expect, it } from 'vitest';

import type { Edge } from './edges.ts';
import type { Container, Network, Node, Service, Stack, Volume } from './graph.ts';
import {
  networkKey,
  nodeKey,
  replicatedTaskKey,
  serviceKey,
  stackKey,
  volumeKey,
} from './identity.ts';
import type { Survey } from './survey.ts';
import {
  COLLECTION_KIND,
  SURVEY_COLLECTIONS,
  emptySurvey,
  sortSurvey,
  surveyObjects,
} from './survey.ts';

/**
 * The envelope, and AD-7's order applied to all seven lists it carries.
 *
 * Every collection is built here in a DELIBERATELY WRONG order, so a collection the sort
 * forgets comes back in the order it went in and is caught. The expected orders below are
 * written out as literals rather than derived by sorting, on story 2's rule.
 */

const node = (id: string): Node => ({
  kind: 'node',
  key: nodeKey(id),
  id,
  name: `swarm-${id}`,
  role: 'worker',
  address: '10.0.0.1',
  availability: 'active',
  state: 'ready',
});

const network = (name: string): Network => ({
  kind: 'network',
  key: networkKey(name),
  name,
  subnets: [],
  createdAt: '2026-08-01T12:00:00.000Z',
});

const volume = (name: string): Volume => ({ kind: 'volume', key: volumeKey(name), name });

const stack = (name: string): Stack => ({ kind: 'stack', key: stackKey(name), name });

const service = (id: string): Service => ({
  kind: 'service',
  key: serviceKey(id),
  id,
  name: id,
  mode: 'replicated',
  health: { running: 1, desired: 1 },
});

const container = (slot: number): Container => ({
  kind: 'container',
  key: replicatedTaskKey('blog', 'web', slot),
  id: `c${slot}`,
  name: `blog_web.${slot}`,
  image: 'nginx:1.25-alpine',
  desiredState: 'running',
  state: 'running',
});

const EDGES: readonly Edge[] = [
  { kind: 'runs', from: serviceKey('svcweb'), to: replicatedTaskKey('blog', 'web', 1) },
  { kind: 'groups', from: stackKey('blog'), to: serviceKey('svcweb') },
  { kind: 'hosts', from: nodeKey('n9'), to: replicatedTaskKey('blog', 'web', 1) },
];

/** Every collection out of order, each in its own way. */
const SCRAMBLED: Survey = {
  takenAt: '2026-09-15T09:41:07.000Z',
  nodes: [node('n9'), node('n1')],
  networks: [network('frontend'), network('backend')],
  volumes: [volume('pgdata'), volume('backup')],
  stacks: [stack('infra'), stack('blog')],
  services: [service('svcweb'), service('svcagent')],
  containers: [container(9), container(1)],
  edges: EDGES,
};

describe('the survey is the envelope the wire form is declared over', () => {
  it('names six object collections, in FR-6’s order', () => {
    expect([...SURVEY_COLLECTIONS]).toEqual([
      'nodes',
      'networks',
      'volumes',
      'stacks',
      'services',
      'containers',
    ]);
  });

  it('says which kind each collection holds', () => {
    expect(COLLECTION_KIND).toEqual({
      nodes: 'node',
      networks: 'network',
      volumes: 'volume',
      stacks: 'stack',
      services: 'service',
      containers: 'container',
    });
  });

  it('has an empty form that still carries the timestamp', () => {
    const empty = emptySurvey('2026-09-15T09:41:07.000Z');
    expect(empty.takenAt).toBe('2026-09-15T09:41:07.000Z');
    for (const collection of SURVEY_COLLECTIONS) expect(empty[collection]).toEqual([]);
    expect(empty.edges).toEqual([]);
  });
});

describe('sortSurvey imposes AD-7 on every list it carries', () => {
  const sorted = sortSurvey(SCRAMBLED);

  it.each([
    ['nodes', ['node:n1', 'node:n9']],
    ['networks', ['network:backend', 'network:frontend']],
    ['volumes', ['volume:backup', 'volume:pgdata']],
    ['stacks', ['stack:blog', 'stack:infra']],
    ['services', ['service:svcagent', 'service:svcweb']],
    ['containers', ['container:blog/web/1', 'container:blog/web/9']],
  ] as const)('sorts %s', (collection, expected) => {
    expect(sorted[collection].map((object) => object.key)).toEqual([...expected]);
  });

  it('sorts the edges too', () => {
    expect(sorted.edges.map((edge) => edge.kind)).toEqual(['groups', 'hosts', 'runs']);
  });

  it('leaves no collection in the order it arrived in', () => {
    for (const collection of SURVEY_COLLECTIONS) {
      expect(sorted[collection].map((object) => object.key)).not.toEqual(
        SCRAMBLED[collection].map((object) => object.key),
      );
    }
    expect(sorted.edges).not.toEqual(SCRAMBLED.edges);
  });

  it('carries the timestamp across unchanged', () => {
    expect(sorted.takenAt).toBe(SCRAMBLED.takenAt);
  });

  it('is idempotent, and does not mutate what it was given', () => {
    expect(sortSurvey(sorted)).toEqual(sorted);
    expect(SCRAMBLED.nodes.map((object) => object.key)).toEqual(['node:n9', 'node:n1']);
    expect(SCRAMBLED.containers.map((object) => object.key)).toEqual([
      'container:blog/web/9',
      'container:blog/web/1',
    ]);
  });
});

describe('surveyObjects walks all six collections', () => {
  it('returns every object and nothing else', () => {
    const keys = surveyObjects(SCRAMBLED).map((object) => object.key);
    expect(keys).toHaveLength(12);
    expect(new Set(keys).size).toBe(12);
  });

  it.each(SURVEY_COLLECTIONS)('includes every object in %s', (collection) => {
    const walked = new Set(surveyObjects(SCRAMBLED).map((object) => object.key));
    for (const object of SCRAMBLED[collection]) expect(walked.has(object.key)).toBe(true);
  });

  it('includes at least one object of every one of FR-6’s six kinds', () => {
    const kinds = new Set(surveyObjects(SCRAMBLED).map((object) => object.kind));
    expect([...kinds].sort()).toEqual(
      [...SURVEY_COLLECTIONS].map((collection) => COLLECTION_KIND[collection]).sort(),
    );
  });

  it('walks in collection order, then AD-7 order inside a collection', () => {
    expect(surveyObjects(sortSurvey(SCRAMBLED)).map((object) => object.key)).toEqual([
      'node:n1',
      'node:n9',
      'network:backend',
      'network:frontend',
      'volume:backup',
      'volume:pgdata',
      'stack:blog',
      'stack:infra',
      'service:svcagent',
      'service:svcweb',
      'container:blog/web/1',
      'container:blog/web/9',
    ]);
  });
});
