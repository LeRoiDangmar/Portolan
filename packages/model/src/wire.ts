// wire — AD-42: the model has a declared wire form, owned by this package, and both
// directions of the conversion live here and nowhere else.
//
// WHY THE MODEL IS WIRE-REPRESENTABLE BY CONSTRUCTION. AD-42 asks that every graph type
// have a wire representation. The strongest form of that is a model whose types are
// ALREADY JSON values — plain objects and arrays, no `Map`, no `Set`, no class instance,
// no back-reference — so the two forms differ in VALIDATION rather than in SHAPE.
// `toWire` is then near-identity and `fromWire` earns its keep: the SSE payload is
// untrusted text, so it parses, checks and rejects, naming the path that failed. Written
// the other way round — a rich in-memory model with `Map` indices — the round-trip test
// passes and the conversion becomes the place the two ends drift, which is exactly what
// AD-42 forbids.
//
// THE WIRE TYPES ARE DECLARED SEPARATELY ANYWAY, and `WireFormMatchesModel` below makes
// the type checker prove the two agree on every build. A wire form that merely aliases the
// model asserts nothing; one that is written out and then checked reports the drift on the
// day it is introduced, at the line that introduced it.
//
// `toWire` REBUILDS RATHER THAN RETURNS. Field by field, so that anything a caller has
// hung on a model object — a lazily attached index, a prototype, a getter — cannot ride
// across the seam under a type that says it is JSON.
//
// THE SILHOUETTE IS NOT ON THE WIRE. It is a pure function of the identity key (AD-6), so
// sending it would be sending a value the receiver can recompute exactly — and a second
// copy of a derived value is what AD-38 calls a defect however small the duplicate looks.

import type {
  AttachmentEdge,
  Edge,
  GroupsEdge,
  HostsEdge,
  MountAccess,
  RunsEdge,
} from './edges.ts';
import { EDGE_KINDS, EDGE_RULES, MOUNT_ACCESS } from './edges.ts';
import type {
  Container,
  Health,
  Network,
  Node,
  NodeAvailability,
  NodeRole,
  NodeState,
  Service,
  ServiceMode,
  Stack,
  TaskState,
  Volume,
} from './graph.ts';
import {
  NODE_AVAILABILITIES,
  NODE_ROLES,
  NODE_STATES,
  SERVICE_MODES,
  TASK_STATES,
} from './graph.ts';
import type { IdentityKey, ObjectKind } from './identity.ts';
import {
  networkKey,
  nodeKey,
  parseIdentityKey,
  serviceKey,
  stackKey,
  volumeKey,
} from './identity.ts';
import type { Survey, SurveyCollection } from './survey.ts';

// --- The declared wire form -------------------------------------------------

/** The wire form of {@link Node}. */
export interface WireNode {
  readonly kind: 'node';
  readonly key: IdentityKey;
  readonly id: string;
  readonly name: string;
  readonly role: NodeRole;
  readonly address: string;
  readonly availability: NodeAvailability;
  readonly state: NodeState;
}

/** The wire form of {@link Network}. */
export interface WireNetwork {
  readonly kind: 'network';
  readonly key: IdentityKey;
  readonly name: string;
  readonly subnets: readonly string[];
  readonly createdAt: string;
}

/** The wire form of {@link Volume}. */
export interface WireVolume {
  readonly kind: 'volume';
  readonly key: IdentityKey;
  readonly name: string;
}

/** The wire form of {@link Stack}. */
export interface WireStack {
  readonly kind: 'stack';
  readonly key: IdentityKey;
  readonly name: string;
}

/** The wire form of {@link Service}. */
export interface WireService {
  readonly kind: 'service';
  readonly key: IdentityKey;
  readonly id: string;
  readonly name: string;
  readonly mode: ServiceMode;
  readonly health: Health;
}

/** The wire form of {@link Container}. */
export interface WireContainer {
  readonly kind: 'container';
  readonly key: IdentityKey;
  readonly id: string;
  readonly name: string;
  readonly image: string;
  readonly desiredState: TaskState;
  readonly state: TaskState;
}

/** The wire form of {@link HostsEdge}. */
export interface WireHostsEdge {
  readonly kind: 'hosts';
  readonly from: IdentityKey;
  readonly to: IdentityKey;
}

/** The wire form of {@link GroupsEdge}. */
export interface WireGroupsEdge {
  readonly kind: 'groups';
  readonly from: IdentityKey;
  readonly to: IdentityKey;
}

/** The wire form of {@link RunsEdge}. */
export interface WireRunsEdge {
  readonly kind: 'runs';
  readonly from: IdentityKey;
  readonly to: IdentityKey;
}

/** The wire form of {@link AttachmentEdge}. `address` is absent, never null (FR-12's rule). */
export interface WireAttachmentEdge {
  readonly kind: 'attachment';
  readonly from: IdentityKey;
  readonly to: IdentityKey;
  readonly address?: string;
}

/** The wire form of {@link MountEdge}. */
export interface WireMountEdge {
  readonly kind: 'mount';
  readonly from: IdentityKey;
  readonly to: IdentityKey;
  readonly path: string;
  readonly access: MountAccess;
}

/** The wire form of {@link Edge}. */
export type WireEdge =
  WireHostsEdge | WireGroupsEdge | WireRunsEdge | WireAttachmentEdge | WireMountEdge;

/** The wire unit: one complete snapshot, exactly as the SSE payload carries it (AD-11). */
export interface WireSurvey {
  readonly takenAt: string;
  readonly nodes: readonly WireNode[];
  readonly networks: readonly WireNetwork[];
  readonly volumes: readonly WireVolume[];
  readonly stacks: readonly WireStack[];
  readonly services: readonly WireService[];
  readonly containers: readonly WireContainer[];
  readonly edges: readonly WireEdge[];
}

type Assert<T extends true> = T;
type Mutual<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

/**
 * AD-42's drift guard, and it is the type checker rather than a test that holds it.
 *
 * Adding a field to `Survey` without adding it to `WireSurvey` — or widening one of them
 * and not the other — stops compiling here, on the build that introduced it. A round-trip
 * test cannot catch that: it only ever sees the fields the fixture was written with.
 */
export type WireFormMatchesModel = Assert<Mutual<WireSurvey, Survey>>;

// --- model → wire -----------------------------------------------------------

const wireAttachment = (edge: AttachmentEdge): WireAttachmentEdge =>
  edge.address === undefined
    ? { kind: 'attachment', from: edge.from, to: edge.to }
    : { kind: 'attachment', from: edge.from, to: edge.to, address: edge.address };

const wireEdge = (edge: Edge): WireEdge => {
  switch (edge.kind) {
    case 'hosts':
    case 'groups':
    case 'runs':
      return { kind: edge.kind, from: edge.from, to: edge.to };
    case 'attachment':
      return wireAttachment(edge);
    case 'mount':
      return {
        kind: 'mount',
        from: edge.from,
        to: edge.to,
        path: edge.path,
        access: edge.access,
      };
  }
};

/**
 * A survey as it travels (AD-42).
 *
 * Near-identity by design — see the header. What it actually does is rebuild every object
 * from its declared fields, so the value that leaves is JSON and demonstrably nothing else.
 */
export const toWire = (survey: Survey): WireSurvey => ({
  takenAt: survey.takenAt,
  nodes: survey.nodes.map((node) => ({
    kind: 'node',
    key: node.key,
    id: node.id,
    name: node.name,
    role: node.role,
    address: node.address,
    availability: node.availability,
    state: node.state,
  })),
  networks: survey.networks.map((network) => ({
    kind: 'network',
    key: network.key,
    name: network.name,
    subnets: [...network.subnets],
    createdAt: network.createdAt,
  })),
  volumes: survey.volumes.map((volume) => ({
    kind: 'volume',
    key: volume.key,
    name: volume.name,
  })),
  stacks: survey.stacks.map((stack) => ({
    kind: 'stack',
    key: stack.key,
    name: stack.name,
  })),
  services: survey.services.map((service) => ({
    kind: 'service',
    key: service.key,
    id: service.id,
    name: service.name,
    mode: service.mode,
    health: { running: service.health.running, desired: service.health.desired },
  })),
  containers: survey.containers.map((container) => ({
    kind: 'container',
    key: container.key,
    id: container.id,
    name: container.name,
    image: container.image,
    desiredState: container.desiredState,
    state: container.state,
  })),
  edges: survey.edges.map(wireEdge),
});

// --- wire → model, validating -----------------------------------------------

/** Every rejection message begins with this, so a caller can tell one from any other error. */
export const WIRE_ERROR_PREFIX = 'wire: ';

const shown = (value: unknown): string => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'an array';
  return typeof value;
};

const fail: (path: string, problem: string) => never = (path, problem) => {
  throw new Error(`${WIRE_ERROR_PREFIX}${path}: ${problem}`);
};

const readRecord = (value: unknown, path: string): Record<string, unknown> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return fail(path, `expected an object, got ${shown(value)}`);
  }
  return value as Record<string, unknown>;
};

const readList = (value: unknown, path: string): readonly unknown[] => {
  if (!Array.isArray(value)) return fail(path, `expected an array, got ${shown(value)}`);
  return value as readonly unknown[];
};

const readText = (record: Record<string, unknown>, field: string, path: string): string => {
  const value = record[field];
  if (value === undefined) return fail(`${path}.${field}`, 'missing');
  if (typeof value !== 'string')
    return fail(`${path}.${field}`, `expected a string, got ${shown(value)}`);
  if (value.length === 0) return fail(`${path}.${field}`, 'empty');
  return value;
};

const readOptionalText = (
  record: Record<string, unknown>,
  field: string,
  path: string,
): string | undefined => (record[field] === undefined ? undefined : readText(record, field, path));

const readCount = (record: Record<string, unknown>, field: string, path: string): number => {
  const value = record[field];
  if (value === undefined) return fail(`${path}.${field}`, 'missing');
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    return fail(`${path}.${field}`, `expected a non-negative integer, got ${shown(value)}`);
  }
  return value;
};

const readOneOf = <T extends string>(
  allowed: readonly T[],
  record: Record<string, unknown>,
  field: string,
  path: string,
): T => {
  const value = readText(record, field, path);
  if (!(allowed as readonly string[]).includes(value)) {
    return fail(
      `${path}.${field}`,
      `expected one of ${allowed.join(', ')}, got ${JSON.stringify(value)}`,
    );
  }
  return value as T;
};

const readTextList = (record: Record<string, unknown>, field: string, path: string): string[] => {
  const value = record[field];
  if (value === undefined) return fail(`${path}.${field}`, 'missing');
  return readList(value, `${path}.${field}`).map((entry, index) => {
    if (typeof entry !== 'string' || entry.length === 0) {
      return fail(`${path}.${field}[${index}]`, `expected a non-empty string, got ${shown(entry)}`);
    }
    return entry;
  });
};

/** ISO 8601 with an explicit offset — a bare local time is ambiguous, and staleness is not. */
const ISO_8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

const readTimestamp = (record: Record<string, unknown>, field: string, path: string): string => {
  const value = readText(record, field, path);
  if (!ISO_8601.test(value)) {
    return fail(
      `${path}.${field}`,
      `expected an ISO 8601 timestamp with an offset, got ${JSON.stringify(value)}`,
    );
  }
  return value;
};

const readKey = (
  record: Record<string, unknown>,
  field: string,
  path: string,
  kind: ObjectKind,
): IdentityKey => {
  const value = readText(record, field, path);
  let parsed;
  try {
    parsed = parseIdentityKey(value);
  } catch (error) {
    return fail(
      `${path}.${field}`,
      error instanceof Error ? error.message : 'malformed identity key',
    );
  }
  if (parsed.kind !== kind) {
    return fail(`${path}.${field}`, `expected a ${kind} key, got a ${parsed.kind} key`);
  }
  return value as IdentityKey;
};

const readEndpoint = (
  record: Record<string, unknown>,
  field: string,
  path: string,
  allowed: readonly ObjectKind[],
): IdentityKey => {
  const value = readText(record, field, path);
  let parsed;
  try {
    parsed = parseIdentityKey(value);
  } catch (error) {
    return fail(
      `${path}.${field}`,
      error instanceof Error ? error.message : 'malformed identity key',
    );
  }
  if (!allowed.includes(parsed.kind)) {
    return fail(
      `${path}.${field}`,
      `expected one of ${allowed.join(', ')}, got a ${parsed.kind} key`,
    );
  }
  return value as IdentityKey;
};

/** The key must be the one the object's own fields build, or the two ends disagree (AD-5). */
const agrees = (key: IdentityKey, expected: IdentityKey, path: string): IdentityKey =>
  key === expected
    ? key
    : fail(
        `${path}.key`,
        `does not match the object's identity, expected ${JSON.stringify(expected)}`,
      );

const readNode = (value: unknown, path: string): Node => {
  const record = readRecord(value, path);
  readOneOf(['node'], record, 'kind', path);
  const id = readText(record, 'id', path);
  return {
    kind: 'node',
    key: agrees(readKey(record, 'key', path, 'node'), nodeKey(id), path),
    id,
    name: readText(record, 'name', path),
    role: readOneOf(NODE_ROLES, record, 'role', path),
    address: readText(record, 'address', path),
    availability: readOneOf(NODE_AVAILABILITIES, record, 'availability', path),
    state: readOneOf(NODE_STATES, record, 'state', path),
  };
};

const readNetwork = (value: unknown, path: string): Network => {
  const record = readRecord(value, path);
  readOneOf(['network'], record, 'kind', path);
  const name = readText(record, 'name', path);
  return {
    kind: 'network',
    key: agrees(readKey(record, 'key', path, 'network'), networkKey(name), path),
    name,
    subnets: readTextList(record, 'subnets', path),
    createdAt: readTimestamp(record, 'createdAt', path),
  };
};

const readVolume = (value: unknown, path: string): Volume => {
  const record = readRecord(value, path);
  readOneOf(['volume'], record, 'kind', path);
  const name = readText(record, 'name', path);
  return {
    kind: 'volume',
    key: agrees(readKey(record, 'key', path, 'volume'), volumeKey(name), path),
    name,
  };
};

const readStack = (value: unknown, path: string): Stack => {
  const record = readRecord(value, path);
  readOneOf(['stack'], record, 'kind', path);
  const name = readText(record, 'name', path);
  return {
    kind: 'stack',
    key: agrees(readKey(record, 'key', path, 'stack'), stackKey(name), path),
    name,
  };
};

const readService = (value: unknown, path: string): Service => {
  const record = readRecord(value, path);
  readOneOf(['service'], record, 'kind', path);
  const id = readText(record, 'id', path);
  const health = readRecord(record['health'], `${path}.health`);
  return {
    kind: 'service',
    key: agrees(readKey(record, 'key', path, 'service'), serviceKey(id), path),
    id,
    name: readText(record, 'name', path),
    mode: readOneOf(SERVICE_MODES, record, 'mode', path),
    health: {
      running: readCount(health, 'running', `${path}.health`),
      desired: readCount(health, 'desired', `${path}.health`),
    },
  };
};

const readContainer = (value: unknown, path: string): Container => {
  const record = readRecord(value, path);
  readOneOf(['container'], record, 'kind', path);
  // A container's key is `stack/service/slot` and its own fields cannot rebuild it — the
  // stack and the service are edges, not attributes. The kind check is the whole check.
  return {
    kind: 'container',
    key: readKey(record, 'key', path, 'container'),
    id: readText(record, 'id', path),
    name: readText(record, 'name', path),
    image: readText(record, 'image', path),
    desiredState: readOneOf(TASK_STATES, record, 'desiredState', path),
    state: readOneOf(TASK_STATES, record, 'state', path),
  };
};

const readEdge = (value: unknown, path: string): Edge => {
  const record = readRecord(value, path);
  const kind = readOneOf(EDGE_KINDS, record, 'kind', path);
  const rule = EDGE_RULES[kind];
  const from = readEndpoint(record, 'from', path, rule.from);
  const to = readEndpoint(record, 'to', path, rule.to);
  switch (kind) {
    case 'hosts':
    case 'groups':
    case 'runs': {
      const edge: HostsEdge | GroupsEdge | RunsEdge = { kind, from, to };
      return edge;
    }
    case 'attachment': {
      const address = readOptionalText(record, 'address', path);
      return address === undefined ? { kind, from, to } : { kind, from, to, address };
    }
    case 'mount':
      return {
        kind,
        from,
        to,
        path: readText(record, 'path', path),
        access: readOneOf(MOUNT_ACCESS, record, 'access', path),
      };
  }
};

const readCollection = <T extends { readonly key: IdentityKey }>(
  payload: Record<string, unknown>,
  collection: SurveyCollection,
  read: (value: unknown, path: string) => T,
): readonly T[] => {
  const value = payload[collection];
  if (value === undefined) fail(collection, 'missing');
  const entries = readList(value, collection);
  const seen = new Set<string>();
  return entries.map((entry, index) => {
    const path = `${collection}[${index}]`;
    const object = read(entry, path);
    if (seen.has(object.key)) fail(`${path}.key`, `duplicate key ${JSON.stringify(object.key)}`);
    seen.add(object.key);
    return object;
  });
};

/**
 * A survey as it arrives (AD-42).
 *
 * The SSE text is untrusted by construction, so this parses, checks and rejects — it
 * THROWS, naming the path that failed, and never returns a partial survey. A malformed
 * payload is a transport failure, not a cluster with fewer objects in it, and a product
 * whose one promise is honesty may not silently draw the difference.
 */
export const fromWire = (payload: unknown): Survey => {
  const record = readRecord(payload, 'survey');
  if (record['edges'] === undefined) fail('edges', 'missing');
  return {
    takenAt: readTimestamp(record, 'takenAt', 'survey'),
    nodes: readCollection(record, 'nodes', readNode),
    networks: readCollection(record, 'networks', readNetwork),
    volumes: readCollection(record, 'volumes', readVolume),
    stacks: readCollection(record, 'stacks', readStack),
    services: readCollection(record, 'services', readService),
    containers: readCollection(record, 'containers', readContainer),
    edges: readList(record['edges'], 'edges').map((entry, index) =>
      readEdge(entry, `edges[${index}]`),
    ),
  };
};
