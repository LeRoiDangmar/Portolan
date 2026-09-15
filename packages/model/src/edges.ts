// edges — the spine's ER diagram, as types, with its cardinality carried as data.
//
// FIVE EDGE KINDS, and the ER diagram has exactly five relationships plus one that shares
// a verb. Two of them are the ones the map DRAWS (FR-8, FR-10) and the ones FR-31 filters
// on — `attachment` and `mount` — and three are structural containment the map renders as
// grouping rather than as a line: a region (`hosts`), an outline (`groups`), a body
// (`runs`).
//
// FR-8 IS WHY ATTACHMENT IS A REAL EDGE. Network membership RENDERS as an area, never as
// edges to a network node, and only the rendering is a stub: the edge itself is real in
// the model, or *Keep only this* and the reachability walk have nothing to walk.
//
// THE MOUNT'S PATH AND FLAG ARE ON THE EDGE, NOT ON THE VOLUME. One volume mounted by two
// containers has two paths and can have two flags — `pgdata · rw` beside `pg-data · ro` is
// a climax beat in `EXPERIENCE.md`, and it is only expressible this way round.
//
// LIKEWISE THE ADDRESS. A container has one IP per network it is attached to, so the IP
// belongs to the attachment and not to the container. It is what FR-49 masks, in `scene`.

import type { IdentityKey, ObjectKind } from './identity.ts';

/** The five edge kinds. */
export const EDGE_KINDS = ['hosts', 'groups', 'runs', 'attachment', 'mount'] as const;
export type EdgeKind = (typeof EDGE_KINDS)[number];

/** Whether an endpoint pair is a containment or a free relation. */
export type Cardinality = 'one-to-many' | 'many-to-many';

/** What one edge kind may join, and how many times. */
export interface EdgeRule {
  readonly from: readonly ObjectKind[];
  readonly to: readonly ObjectKind[];
  readonly cardinality: Cardinality;
  /** The ER diagram row this transcribes, in the diagram's own words. */
  readonly relationship: string;
}

/**
 * The cardinality, as data rather than as prose, so `fromWire` can check an untrusted
 * payload against it instead of a validator hard-coding the same table a second time.
 */
export const EDGE_RULES = {
  hosts: {
    from: ['node'],
    to: ['container', 'volume'],
    cardinality: 'one-to-many',
    relationship: 'NODE ||--o{ CONTAINER : hosts, and NODE ||--o{ VOLUME : hosts',
  },
  groups: {
    from: ['stack'],
    to: ['service'],
    cardinality: 'one-to-many',
    relationship: 'STACK ||--o{ SERVICE : groups',
  },
  runs: {
    from: ['service'],
    to: ['container'],
    cardinality: 'one-to-many',
    relationship: 'SERVICE ||--o{ CONTAINER : "runs as slots"',
  },
  attachment: {
    from: ['container', 'service'],
    to: ['network'],
    cardinality: 'many-to-many',
    relationship: 'CONTAINER }o--o{ NETWORK, and SERVICE }o--o{ NETWORK : "attached to"',
  },
  mount: {
    from: ['container'],
    to: ['volume'],
    cardinality: 'many-to-many',
    relationship: 'CONTAINER }o--o{ VOLUME : mounts',
  },
} as const satisfies Record<EdgeKind, EdgeRule>;

/** Docker's own words for a mount's flag (FR-80). */
export const MOUNT_ACCESS = ['rw', 'ro'] as const;
export type MountAccess = (typeof MOUNT_ACCESS)[number];

/** What every edge carries: two identity keys, and nothing about how it is drawn. */
export interface EdgeEnds {
  readonly from: IdentityKey;
  readonly to: IdentityKey;
}

/** A node hosts a container, or a node hosts a volume. FR-25's *placement*. */
export interface HostsEdge extends EdgeEnds {
  readonly kind: 'hosts';
}

/** A stack groups a service. What FR-9's outline girdles, and FR-74's orphan lacks. */
export interface GroupsEdge extends EdgeEnds {
  readonly kind: 'groups';
}

/** A service runs a container as one of its slots. */
export interface RunsEdge extends EdgeEnds {
  readonly kind: 'runs';
}

/**
 * A container or a service is attached to a network (FR-8).
 *
 * Roughly 94% of the graph's edges are these (FR-68), and FR-31 removes them together
 * with the zones when networks are filtered out.
 */
export interface AttachmentEdge extends EdgeEnds {
  readonly kind: 'attachment';
  /**
   * The endpoint's IP on that network, when it has one (FR-25); maskable by `scene`
   * (FR-49, FR-51).
   *
   * ABSENT, never null, when there is none — a service-level attachment carries no
   * address of its own. Absence is the value (FR-12's rule, applied to a fact).
   */
  readonly address?: string;
}

/**
 * A container mounts a volume, at a path, with a flag (FR-25).
 *
 * The most instrument-like mark on the map, and the one FR-31 keeps when networks go.
 */
export interface MountEdge extends EdgeEnds {
  readonly kind: 'mount';
  /** Where this container mounts it. Two containers, two paths. */
  readonly path: string;
  /** `rw` or `ro`, as Docker says it (FR-80). */
  readonly access: MountAccess;
}

/** Any edge, discriminated by `kind`. */
export type Edge = HostsEdge | GroupsEdge | RunsEdge | AttachmentEdge | MountEdge;

/**
 * AD-7's total order, extended to edges.
 *
 * Kind, then `from`, then `to`, then what remains — a container may mount one volume at
 * two paths, so the pair of endpoints alone is not a total order and would leave two
 * genuinely different edges comparing equal.
 */
export const compareEdges = (a: Edge, b: Edge): number => {
  if (a.kind !== b.kind) return a.kind < b.kind ? -1 : 1;
  if (a.from !== b.from) return a.from < b.from ? -1 : 1;
  if (a.to !== b.to) return a.to < b.to ? -1 : 1;
  if (a.kind === 'mount' && b.kind === 'mount') {
    if (a.path !== b.path) return a.path < b.path ? -1 : 1;
    if (a.access !== b.access) return a.access < b.access ? -1 : 1;
  }
  if (a.kind === 'attachment' && b.kind === 'attachment') {
    // An absent address is not an empty one. Coalescing the two to `''` would make an
    // attachment that reports no IP compare equal to one that reports an empty string,
    // which is the conflation `address?` exists to prevent. Absent sorts first.
    if (a.address === undefined) return b.address === undefined ? 0 : -1;
    if (b.address === undefined) return 1;
    if (a.address !== b.address) return a.address < b.address ? -1 : 1;
  }
  return 0;
};

/** A collection of edges in AD-7 order, as a new array. The input is never mutated. */
export const sortEdges = (edges: readonly Edge[]): readonly Edge[] => [...edges].sort(compareEdges);
