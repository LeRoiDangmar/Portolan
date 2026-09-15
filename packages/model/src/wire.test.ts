import { describe, expect, it } from 'vitest';

import type { Edge } from './edges.ts';
import {
  globalTaskKey,
  networkKey,
  nodeKey,
  replicatedTaskKey,
  serviceKey,
  stackKey,
  volumeKey,
} from './identity.ts';
import type { Survey } from './survey.ts';
import { WIRE_ERROR_PREFIX, WIRE_VERSION, fromWire, toWire } from './wire.ts';

/**
 * AD-42 asks for the model → wire → model round trip by name, and for a `fromWire` that
 * rejects an untrusted payload naming what failed.
 *
 * The fixture exercises EVERY type in the package: all six object kinds, all five edge
 * kinds, an attachment with an address and one without, a mount in each direction of the
 * `rw`/`ro` flag, a replicated task, a global task and a standalone service's task, a
 * network with two subnets and one with none, and a service in each mode with each of
 * FR-12's three counted readings.
 */
const SURVEY: Survey = {
  takenAt: '2026-09-15T09:41:07.000Z',
  nodes: [
    {
      kind: 'node',
      key: nodeKey('n7'),
      id: 'n7',
      name: 'swarm-1',
      role: 'manager',
      address: '10.0.0.11',
      availability: 'active',
      state: 'ready',
    },
    {
      kind: 'node',
      key: nodeKey('n8'),
      id: 'n8',
      name: 'swarm-2',
      role: 'worker',
      address: '10.0.0.12',
      // The drained-node row of the I/O matrix: both facts carried, no health value.
      availability: 'drain',
      state: 'down',
    },
  ],
  networks: [
    {
      kind: 'network',
      key: networkKey('frontend'),
      name: 'frontend',
      subnets: ['10.0.1.0/24', 'fd00:1::/64'],
      createdAt: '2026-08-01T12:00:00.000Z',
    },
    {
      kind: 'network',
      key: networkKey('web'),
      name: 'web',
      subnets: [],
      createdAt: '2026-08-02T12:00:00+02:00',
    },
  ],
  volumes: [
    { kind: 'volume', key: volumeKey('web'), name: 'web' },
    { kind: 'volume', key: volumeKey('pgdata'), name: 'pgdata' },
    { kind: 'volume', key: volumeKey('pg-data'), name: 'pg-data' },
  ],
  stacks: [
    { kind: 'stack', key: stackKey('blog'), name: 'blog' },
    { kind: 'stack', key: stackKey('infra'), name: 'infra' },
  ],
  services: [
    {
      kind: 'service',
      key: serviceKey('svcweb'),
      id: 'svcweb',
      name: 'web',
      mode: 'replicated',
      health: { running: 3, desired: 5 },
    },
    {
      kind: 'service',
      key: serviceKey('svcagent'),
      id: 'svcagent',
      name: 'agent',
      mode: 'global',
      health: { running: 2, desired: 2 },
    },
    {
      kind: 'service',
      key: serviceKey('svcadhoc'),
      id: 'svcadhoc',
      name: 'adhoc',
      mode: 'replicated',
      health: { running: 0, desired: 1 },
    },
  ],
  containers: [
    {
      kind: 'container',
      key: replicatedTaskKey('blog', 'web', 3),
      id: 'c3f1',
      name: 'blog_web.3',
      image: 'nginx:1.25-alpine',
      desiredState: 'running',
      state: 'running',
    },
    {
      kind: 'container',
      key: globalTaskKey('infra', 'agent', 'n7'),
      id: 'c9aa',
      name: 'infra_agent.n7',
      image: 'prom/node-exporter:v1.8.2',
      desiredState: 'running',
      state: 'shutdown',
    },
    {
      kind: 'container',
      key: replicatedTaskKey('', 'adhoc', 1),
      id: 'cb02',
      name: 'adhoc.1',
      image: 'alpine:3.20',
      desiredState: 'ready',
      state: 'preparing',
    },
  ],
  edges: [
    { kind: 'hosts', from: nodeKey('n7'), to: replicatedTaskKey('blog', 'web', 3) },
    { kind: 'hosts', from: nodeKey('n8'), to: volumeKey('pgdata') },
    { kind: 'groups', from: stackKey('blog'), to: serviceKey('svcweb') },
    { kind: 'groups', from: stackKey('infra'), to: serviceKey('svcagent') },
    { kind: 'runs', from: serviceKey('svcweb'), to: replicatedTaskKey('blog', 'web', 3) },
    {
      kind: 'attachment',
      from: replicatedTaskKey('blog', 'web', 3),
      to: networkKey('frontend'),
      address: '10.0.1.7',
    },
    // A service-level attachment carries no address: absence is the value, not a null.
    { kind: 'attachment', from: serviceKey('svcweb'), to: networkKey('frontend') },
    {
      kind: 'mount',
      from: replicatedTaskKey('blog', 'web', 3),
      to: volumeKey('pgdata'),
      path: '/var/lib/postgresql/data',
      access: 'rw',
    },
    {
      kind: 'mount',
      from: replicatedTaskKey('blog', 'web', 3),
      to: volumeKey('pg-data'),
      path: '/backup',
      access: 'ro',
    },
  ],
};

/** A payload as it arrives: JSON text, parsed, with no model type anywhere near it. */
const asPayload = (survey: Survey): unknown => JSON.parse(JSON.stringify(toWire(survey)));

describe('the wire round trip (AD-42)', () => {
  it('reconstructs the survey exactly', () => {
    expect(fromWire(toWire(SURVEY))).toEqual(SURVEY);
  });

  it('survives JSON, which is the form it actually travels in', () => {
    expect(fromWire(asPayload(SURVEY))).toEqual(SURVEY);
  });

  it('is stable under a second trip', () => {
    const once = fromWire(asPayload(SURVEY));
    expect(fromWire(asPayload(once))).toEqual(once);
  });

  it('loses nothing to JSON: the wire form is already a JSON value', () => {
    // No Map, no Set, no class instance, no cyclic reference — if one were reachable,
    // the serialised form would differ from the value `toWire` returned.
    expect(JSON.parse(JSON.stringify(toWire(SURVEY)))).toEqual(toWire(SURVEY));
  });

  it('keeps an absent address absent rather than turning it into a null', () => {
    const wire = toWire(SURVEY);
    const withAddress = wire.edges.find(
      (edge) => edge.kind === 'attachment' && edge.address !== undefined,
    );
    const without = wire.edges.find(
      (edge) => edge.kind === 'attachment' && edge.address === undefined,
    );
    expect(withAddress).toBeDefined();
    expect(without).toBeDefined();
    expect(without !== undefined && 'address' in without).toBe(false);
    expect(JSON.stringify(without)).not.toContain('address');
  });

  it('carries no health value on a kind that has none', () => {
    const wire = toWire(SURVEY);
    for (const object of [...wire.nodes, ...wire.networks, ...wire.volumes, ...wire.stacks]) {
      expect('health' in object).toBe(false);
    }
    for (const service of wire.services) {
      expect(Object.keys(service.health).sort()).toEqual(['desired', 'running']);
    }
  });

  it('rebuilds rather than returns, so no model object crosses the seam by reference', () => {
    const wire = toWire(SURVEY);
    expect(wire.nodes[0]).not.toBe(SURVEY.nodes[0]);
    expect(wire.edges[0]).not.toBe(SURVEY.edges[0]);
    expect(wire.networks[0]?.subnets).not.toBe(SURVEY.networks[0]?.subnets);
  });
});

/** A deep clone of the payload, so a mutation in one row cannot leak into the next. */
const payload = (): Record<string, unknown> =>
  JSON.parse(JSON.stringify(toWire(SURVEY))) as Record<string, unknown>;

const rows: readonly [string, (body: Record<string, unknown>) => void, RegExp][] = [
  ['a missing top-level collection', (body) => delete body['volumes'], /^wire: volumes: missing$/],
  ['a missing edge list', (body) => delete body['edges'], /^wire: edges: missing$/],
  ['a missing timestamp', (body) => delete body['takenAt'], /^wire: survey\.takenAt: missing$/],
  [
    'a timestamp with no offset',
    (body) => {
      body['takenAt'] = '2026-09-15T09:41:07';
    },
    /^wire: survey\.takenAt: expected an ISO 8601 timestamp/,
  ],
  [
    'a missing field on an object',
    (body) => {
      delete (body['nodes'] as Record<string, unknown>[])[1]?.['address'];
    },
    /^wire: nodes\[1\]\.address: missing$/,
  ],
  [
    'a field of the wrong type',
    (body) => {
      const network = (body['networks'] as Record<string, unknown>[])[0];
      if (network) network['subnets'] = '10.0.1.0/24';
    },
    /^wire: networks\[0\]\.subnets: expected an array, got string$/,
  ],
  [
    'a count that is not a count',
    (body) => {
      const service = (body['services'] as Record<string, unknown>[])[0];
      if (service) (service['health'] as Record<string, unknown>)['running'] = -1;
    },
    /^wire: services\[0\]\.health\.running: expected a non-negative integer/,
  ],
  [
    'a status Docker never issued',
    (body) => {
      const node = (body['nodes'] as Record<string, unknown>[])[0];
      if (node) node['availability'] = 'degraded';
    },
    /^wire: nodes\[0\]\.availability: expected one of active, pause, drain/,
  ],
  [
    'a collection holding the wrong kind of key',
    (body) => {
      const volume = (body['volumes'] as Record<string, unknown>[])[0];
      if (volume) volume['key'] = 'network:web';
    },
    /^wire: volumes\[0\]\.key: expected a volume key, got a network key$/,
  ],
  [
    'a key that disagrees with the object it is on',
    (body) => {
      const volume = (body['volumes'] as Record<string, unknown>[])[0];
      if (volume) volume['name'] = 'renamed';
    },
    /^wire: volumes\[0\]\.key: does not match the object's identity, expected "volume:renamed"$/,
  ],
  [
    'a duplicate key',
    (body) => {
      const volumes = body['volumes'] as Record<string, unknown>[];
      volumes.push({ ...volumes[0] });
    },
    /^wire: volumes\[3\]\.key: duplicate key "volume:web"$/,
  ],
  [
    'an object that is not an object',
    (body) => {
      (body['stacks'] as unknown[])[0] = 'blog';
    },
    /^wire: stacks\[0\]: expected an object, got string$/,
  ],
  [
    'an unknown edge kind',
    (body) => {
      const edge = (body['edges'] as Record<string, unknown>[])[0];
      if (edge) edge['kind'] = 'touches';
    },
    /^wire: edges\[0\]\.kind: expected one of hosts, groups, runs, attachment, mount/,
  ],
  [
    'an edge whose endpoint breaks the cardinality table',
    (body) => {
      const edge = (body['edges'] as Record<string, unknown>[])[2];
      if (edge) edge['from'] = 'service:svcweb';
    },
    /^wire: edges\[2\]\.from: expected one of stack, got a service key$/,
  ],
  [
    'a mount with no path',
    (body) => {
      const edges = body['edges'] as Record<string, unknown>[];
      delete edges[7]?.['path'];
    },
    /^wire: edges\[7\]\.path: missing$/,
  ],
  [
    'a malformed identity key',
    (body) => {
      const container = (body['containers'] as Record<string, unknown>[])[0];
      if (container) container['key'] = 'container:blog/web';
    },
    /^wire: containers\[0\]\.key: identity key "container:blog\/web"/,
  ],
  [
    'a timestamp of the right shape that is not an instant',
    (body) => {
      body['takenAt'] = '2026-13-45T99:99:99Z';
    },
    /^wire: survey\.takenAt: is not a readable instant, got "2026-13-45T99:99:99Z"$/,
  ],
  [
    'a network created at an instant no clock can read',
    (body) => {
      const network = (body['networks'] as Record<string, unknown>[])[0];
      if (network) network['createdAt'] = '2026-08-32T00:00:00Z';
    },
    /^wire: networks\[0\]\.createdAt: is not a readable instant/,
  ],
  [
    'the same edge sent twice',
    (body) => {
      const edges = body['edges'] as Record<string, unknown>[];
      edges.push({ ...edges[7] });
    },
    /^wire: edges\[9\]: duplicate mount edge$/,
  ],
  [
    'a second one-to-many edge onto one endpoint',
    (body) => {
      const edges = body['edges'] as Record<string, unknown>[];
      edges.push({ kind: 'hosts', from: 'node:n7', to: 'volume:pgdata' });
    },
    /^wire: edges\[9\]\.to: "volume:pgdata" already has a hosts edge, and hosts is one-to-many$/,
  ],
  [
    'an edge whose endpoint is in no collection',
    (body) => {
      const edge = (body['edges'] as Record<string, unknown>[])[1];
      if (edge) edge['to'] = 'volume:absent';
    },
    /^wire: edges\[1\]\.to: no object in this survey has key "volume:absent"$/,
  ],
  [
    'every edge dangling against emptied collections',
    (body) => {
      for (const collection of ['nodes', 'networks', 'volumes', 'stacks', 'services', 'containers'])
        body[collection] = [];
    },
    /^wire: edges\[0\]\.from: no object in this survey has key "node:n7"$/,
  ],
  [
    'a missing schema version',
    (body) => delete body['version'],
    /^wire: survey\.version: missing$/,
  ],
  [
    'a schema version this build does not know',
    (body) => {
      body['version'] = WIRE_VERSION + 1;
    },
    /^wire: survey\.version: expected 1, received 2$/,
  ],
];

describe('fromWire rejects an untrusted payload, naming the path', () => {
  it.each(rows)('rejects %s', (_what, corrupt, message) => {
    const body = payload();
    corrupt(body);
    expect(() => fromWire(body)).toThrow(message);
  });

  it('rejects a payload that is not an object at all', () => {
    expect(() => fromWire('not a survey')).toThrow(
      /^wire: survey: expected an object, got string$/,
    );
  });

  it('throws rather than returning a partial survey', () => {
    const body = payload();
    delete body['volumes'];
    let returned: unknown = 'nothing was returned';
    expect(() => {
      returned = fromWire(body);
    }).toThrow();
    expect(returned).toBe('nothing was returned');
  });

  it('prefixes every rejection, so a caller can tell one from any other failure', () => {
    for (const [what, corrupt] of rows) {
      const body = payload();
      corrupt(body);
      // Captured rather than asserted inside the `catch`: with the expectations in the
      // catch block, a row that stopped throwing would run no assertion and pass.
      let thrown: unknown = 'nothing was thrown';
      try {
        fromWire(body);
      } catch (error) {
        thrown = error;
      }
      expect(thrown, what).toBeInstanceOf(Error);
      expect((thrown as Error).message.startsWith(WIRE_ERROR_PREFIX), what).toBe(true);
    }
  });

  it('accepts the fixture it was given, so the rows above fail for their own reason', () => {
    expect(() => fromWire(payload())).not.toThrow();
  });
});

describe('the payload declares its schema version', () => {
  it('stamps every payload `toWire` produces', () => {
    expect(toWire(SURVEY).version).toBe(WIRE_VERSION);
    expect(payload()['version']).toBe(WIRE_VERSION);
  });

  it('keeps the version off the model, which knows nothing of the protocol', () => {
    // The round trip above already proves `fromWire` returns a `Survey` equal to the
    // original; this is the other half — the field never arrives on one.
    expect('version' in fromWire(payload())).toBe(false);
    expect('version' in SURVEY).toBe(false);
  });

  it('checks the version before anything else, so an old payload fails on that alone', () => {
    // A payload from another schema is rejected WHOLE. If the version were read late, a
    // stale tab would be told its `volumes` collection is malformed — true, but the wrong
    // diagnosis, and it points the reader at the cluster instead of at the upgrade.
    const body = payload();
    body['version'] = WIRE_VERSION + 1;
    delete body['volumes'];
    expect(() => fromWire(body)).toThrow(/^wire: survey\.version: /);
  });
});

describe('the edge fixture covers every edge kind', () => {
  it.each([['hosts'], ['groups'], ['runs'], ['attachment'], ['mount']])(
    'carries at least one %s edge',
    (kind) => {
      expect(SURVEY.edges.some((edge: Edge) => edge.kind === kind)).toBe(true);
    },
  );
});
