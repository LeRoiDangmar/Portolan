// identity — AD-5's kind-qualified key, and AD-7's one total order over it.
//
// The key is THREE things at once and it is the same string for all three: the sort
// order the collector imposes before the model (AD-7), the silhouette seed (AD-6), and
// the only value picking sends upward across the map seam (AD-36). One format per kind,
// used for all three — the spine's Consistency Conventions say so, and the moment two of
// those three disagree, a `docker stack deploy` reshuffles the map.
//
// EVERY KEY IS QUALIFIED BY OBJECT KIND. `volume:web` and `network:web` are two objects.
// An unqualified key would make them one, with one silhouette (AD-6) and one retained
// cell (AD-37), which is the defect AD-5 exists to prevent.
//
// NO ESCAPING, DELIBERATELY. Docker restricts object names to `[a-zA-Z0-9][a-zA-Z0-9_.-]*`
// and node and service IDs are alphanumeric, so neither `/` nor `:` can occur inside a
// segment. The separators are therefore unambiguous and the parser ASSERTS that rather
// than defending against it — a segment carrying one is a malformed payload, not a name
// to be escaped. A standalone service task has no stack and takes an EMPTY first segment,
// which no stack name can collide with.

/**
 * The six object kinds FR-6 names, in FR-6's own order.
 *
 * This order is documentation, not the sort order: {@link compareIdentityKeys} orders by
 * the key string, so `container:` sorts before `network:` whatever this array says.
 */
export const OBJECT_KINDS = ['node', 'network', 'volume', 'stack', 'service', 'container'] as const;

/** One of FR-6's six kinds. */
export type ObjectKind = (typeof OBJECT_KINDS)[number];

/**
 * A kind-qualified identity key: `<kind>:<body>`.
 *
 * The template literal is the type-level half of AD-5 — a bare `string` cannot be handed
 * where a key is wanted — and {@link parseIdentityKey} is the runtime half, because the
 * SSE payload is untrusted text and a template literal type checks nothing there.
 */
export type IdentityKey = `${ObjectKind}:${string}`;

/** The separator between the kind and the body. */
export const KIND_SEPARATOR = ':';

/** The same separator as a code unit, so {@link identityKind} can read it without slicing. */
const KIND_SEPARATOR_CODE = KIND_SEPARATOR.charCodeAt(0);

/** The separator between a container key's three segments. */
export const SEGMENT_SEPARATOR = '/';

/** Anything the model sorts, seeds or picks by identity. */
export interface Identified {
  readonly key: IdentityKey;
}

/** A name or ID segment: Docker's own character set, and nothing that could be a separator. */
const SEGMENT = /^[A-Za-z0-9][A-Za-z0-9_.-]*$/;

const reject: (key: string, problem: string) => never = (key, problem) => {
  throw new Error(`identity key ${JSON.stringify(key)}: ${problem}`);
};

/**
 * The one rule the builders and the parser share.
 *
 * A builder that minted what the parser rejects would let the collector send a key its
 * own `fromWire` refuses at the far end of the seam — a `IdentityKey`-typed value for
 * which `isIdentityKey` is false. The two halves of AD-5 have to agree, so they agree by
 * calling the same test with the same message.
 */
const segment = (key: string, value: string, what: string): void => {
  if (!SEGMENT.test(value)) reject(key, `malformed ${what}`);
};

// --- Builders, one per kind ------------------------------------------------

/** A node, by Docker ID — stable across `stack deploy` (AD-5). */
export const nodeKey = (id: string): IdentityKey => {
  const key: IdentityKey = `node:${id}`;
  segment(key, id, 'body');
  return key;
};

/** A service, by Docker ID — stable across `stack deploy` (AD-5). */
export const serviceKey = (id: string): IdentityKey => {
  const key: IdentityKey = `service:${id}`;
  segment(key, id, 'body');
  return key;
};

/**
 * A stack, by name.
 *
 * AD-5's table names five kinds and not this one, because a stack is a Compose namespace
 * rather than a Docker object: it has no ID to be keyed by, and its name is what an admin
 * types (FR-80). One format per kind still holds.
 */
export const stackKey = (name: string): IdentityKey => {
  const key: IdentityKey = `stack:${name}`;
  segment(key, name, 'body');
  return key;
};

/** A network, by name (AD-5). */
export const networkKey = (name: string): IdentityKey => {
  const key: IdentityKey = `network:${name}`;
  segment(key, name, 'body');
  return key;
};

/** A volume, by name (AD-5). */
export const volumeKey = (name: string): IdentityKey => {
  const key: IdentityKey = `volume:${name}`;
  segment(key, name, 'body');
  return key;
};

/**
 * A replicated service task, by `stack/service/slot` (AD-5).
 *
 * A Swarm task is immutable and a service update destroys and recreates its tasks with
 * new container IDs — the slot survives, which is why the key is built on it.
 *
 * A task of a standalone service passes an empty `stack`, giving `container:/adhoc/1`.
 */
export const replicatedTaskKey = (stack: string, service: string, slot: number): IdentityKey => {
  const key: IdentityKey = `container:${stack}${SEGMENT_SEPARATOR}${service}${SEGMENT_SEPARATOR}${slot}`;
  // The stack segment is empty for a standalone service, and only then.
  if (stack !== '') segment(key, stack, 'stack segment');
  segment(key, service, 'service segment');
  segment(key, `${slot}`, 'slot or node segment');
  return key;
};

/**
 * A global service task, by `stack/service/node` (AD-5).
 *
 * A global service has no slots: one task per node, so the node's identity is what
 * survives. The third segment is the node's Docker ID — the body of its own
 * {@link nodeKey} — so the two agree wherever the collector joins them.
 */
export const globalTaskKey = (stack: string, service: string, node: string): IdentityKey => {
  const key: IdentityKey = `container:${stack}${SEGMENT_SEPARATOR}${service}${SEGMENT_SEPARATOR}${node}`;
  if (stack !== '') segment(key, stack, 'stack segment');
  segment(key, service, 'service segment');
  segment(key, node, 'slot or node segment');
  return key;
};

// --- The parser ------------------------------------------------------------

/** A parsed `node:<id>` key. */
export interface ParsedNodeKey {
  readonly kind: 'node';
  readonly id: string;
}

/** A parsed `service:<id>` key. */
export interface ParsedServiceKey {
  readonly kind: 'service';
  readonly id: string;
}

/** A parsed `stack:<name>` key. */
export interface ParsedStackKey {
  readonly kind: 'stack';
  readonly name: string;
}

/** A parsed `network:<name>` key. */
export interface ParsedNetworkKey {
  readonly kind: 'network';
  readonly name: string;
}

/** A parsed `volume:<name>` key. */
export interface ParsedVolumeKey {
  readonly kind: 'volume';
  readonly name: string;
}

/** A parsed `container:<stack>/<service>/<instance>` key. */
export interface ParsedContainerKey {
  readonly kind: 'container';
  /** Empty for a task of a standalone service, which has no stack. */
  readonly stack: string;
  readonly service: string;
  /**
   * The slot for a replicated task, the node for a global one.
   *
   * The key alone cannot tell the two apart, and nothing needs it to: the key IS the
   * identity. `Service.mode` is where the distinction lives when it is wanted.
   */
  readonly instance: string;
}

/** The parse of any identity key, discriminated by kind. */
export type ParsedIdentityKey =
  | ParsedNodeKey
  | ParsedServiceKey
  | ParsedStackKey
  | ParsedNetworkKey
  | ParsedVolumeKey
  | ParsedContainerKey;

/** True when `value` is one of FR-6's six kinds. */
export const isObjectKind = (value: string): value is ObjectKind =>
  (OBJECT_KINDS as readonly string[]).includes(value);

/**
 * Parse an identity key, or throw naming what failed.
 *
 * Total on well-formed keys and rejecting on everything else, because `fromWire` reads
 * untrusted SSE text and a template literal type does not survive the wire.
 */
export const parseIdentityKey = (key: string): ParsedIdentityKey => {
  const separator = key.indexOf(KIND_SEPARATOR);
  if (separator < 0) return reject(key, `no ${JSON.stringify(KIND_SEPARATOR)} separator`);

  const kind = key.slice(0, separator);
  const body = key.slice(separator + 1);
  if (!isObjectKind(kind)) return reject(key, `unknown object kind ${JSON.stringify(kind)}`);

  if (kind === 'container') {
    const segments = body.split(SEGMENT_SEPARATOR);
    if (segments.length !== 3) {
      return reject(
        key,
        `expected stack/service/slot or stack/service/node, got ${body.length === 0 ? 'an empty body' : `${segments.length} segment(s)`}`,
      );
    }
    const [stack, service, instance] = segments as [string, string, string];
    // The stack segment is empty for a standalone service, and only then.
    if (stack !== '' && !SEGMENT.test(stack)) return reject(key, 'malformed stack segment');
    if (!SEGMENT.test(service)) return reject(key, 'malformed service segment');
    if (!SEGMENT.test(instance)) return reject(key, 'malformed slot or node segment');
    return { kind, stack, service, instance };
  }

  if (!SEGMENT.test(body)) return reject(key, 'malformed body');
  switch (kind) {
    case 'node':
      return { kind, id: body };
    case 'service':
      return { kind, id: body };
    case 'stack':
      return { kind, name: body };
    case 'network':
      return { kind, name: body };
    case 'volume':
      return { kind, name: body };
  }
};

/** True when `value` is a well-formed identity key of any kind. */
export const isIdentityKey = (value: unknown): value is IdentityKey => {
  if (typeof value !== 'string') return false;
  try {
    parseIdentityKey(value);
    return true;
  } catch {
    return false;
  }
};

/**
 * The kind a key is qualified by, without parsing its body.
 *
 * Six prefix comparisons and no allocation: AD-36's picking path calls this once per hit,
 * and a parse that builds a record and can throw is the wrong shape for that.
 */
export const identityKind = (key: IdentityKey): ObjectKind => {
  for (const kind of OBJECT_KINDS) {
    if (key.startsWith(kind) && key.charCodeAt(kind.length) === KIND_SEPARATOR_CODE) return kind;
  }
  return reject(key, 'unknown object kind');
};

// --- The total order (AD-7) -------------------------------------------------

/**
 * The one comparator. AD-7 is unenforceable unless the collector sorts with the same
 * function the model seeds and looks up with, so there is exactly one and it is this.
 *
 * UTF-16 code-unit order, not `localeCompare`: the Intl collation of two strings depends
 * on a locale and on an ICU version, so two engines can disagree about it — which is the
 * same class of defect AD-8 bans transcendentals for, one stage upstream. `<` and `>` on
 * strings are exactly specified by ECMAScript and every engine must agree.
 *
 * Total, antisymmetric and transitive; returns 0 only for identical keys, and identical
 * keys are the same object by AD-5.
 */
export const compareIdentityKeys = (a: IdentityKey, b: IdentityKey): number =>
  a < b ? -1 : a > b ? 1 : 0;

/** {@link compareIdentityKeys}, lifted to anything carrying a key. */
export const byIdentityKey = (a: Identified, b: Identified): number =>
  compareIdentityKeys(a.key, b.key);

/**
 * A collection in AD-7 order, as a new array. The input is never mutated: the collector
 * sorts once, on its way into the model, and no later stage may rely on arrival order.
 */
export const sortByIdentityKey = <T extends Identified>(items: readonly T[]): readonly T[] =>
  [...items].sort(byIdentityKey);
