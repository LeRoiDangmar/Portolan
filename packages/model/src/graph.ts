// graph — FR-6's six object kinds, in one file so a reviewer diffs them against FR-6,
// FR-25 and the spine's ER diagram without scrolling.
//
// EVERY ATTRIBUTE IS TRACEABLE. Each one below is annotated with the requirement that
// demands it, or with the node-and-task-status decision this story's Boundaries record.
// Nothing else is here. An attribute Docker offers and no document asks for is not a
// model attribute — it is an invitation to invent a status (CAP-7 is the product's only
// classification).
//
// HEALTH IS COUNTED FACTS, AND ITS ABSENCE IS A FOURTH VALUE (FR-12, FR-72). `running`
// and `desired`, never a verdict. An object with no health dimension carries NO HEALTH
// VALUE AT ALL — the dimension is absent from the type, not present and null. Only
// `Service` has one.
//
// DOCKER'S NODE AND TASK STATUS TRAVEL AS RAW FACTS. Node availability, node state, and a
// task's desired versus actual state are FACTS FOR FR-25'S FACTUAL PANEL ONLY: no health
// mark, no colour, no classification. They are here because omitting them would leave a
// drained or unreachable node reading exactly like a healthy one on a map whose whole
// promise is honesty — and FR-12 keeps its three counted values untouched.
//
// NO POSITION, NO CAMERA, NO READING LEVEL, NO PRESENTATION STATE, NO MASKING, NO COLOUR.
// AD-2 and AD-41 own those in `layout`, `view-state`, `scene` and the rasterisers. A model
// that knows any of them is the defect AD-38 exists to prevent.
//
// VOCABULARY IS DOCKER'S (FR-80, CAP-22). `availability`, `drain`, `shutdown`, `slot`,
// `rw` — never renamed, never prettified, never translated.

import type { IdentityKey } from './identity.ts';

// --- Docker's own vocabularies, verbatim ------------------------------------

/** A node is a manager or a worker (`DESIGN.md`, node-view header). */
export const NODE_ROLES = ['manager', 'worker'] as const;
export type NodeRole = (typeof NODE_ROLES)[number];

/** Docker's node availability. A raw fact for FR-25, never a health value. */
export const NODE_AVAILABILITIES = ['active', 'pause', 'drain'] as const;
export type NodeAvailability = (typeof NODE_AVAILABILITIES)[number];

/** Docker's node state. A raw fact for FR-25, never a health value. */
export const NODE_STATES = ['ready', 'down'] as const;
export type NodeState = (typeof NODE_STATES)[number];

/**
 * Docker's task state, in the order SwarmKit advances through it.
 *
 * Carried twice on a container — desired and actual — because the pair is the fact, and
 * either one alone is a verdict waiting to be invented.
 */
export const TASK_STATES = [
  'new',
  'allocated',
  'pending',
  'assigned',
  'accepted',
  'preparing',
  'ready',
  'starting',
  'running',
  'complete',
  'shutdown',
  'failed',
  'rejected',
  'remove',
  'orphaned',
] as const;
export type TaskState = (typeof TASK_STATES)[number];

/** Replicated services have slots; global services have one task per node (AD-5). */
export const SERVICE_MODES = ['replicated', 'global'] as const;
export type ServiceMode = (typeof SERVICE_MODES)[number];

// --- Health (FR-12, FR-72) --------------------------------------------------

/**
 * Two counted facts and nothing else.
 *
 * The three health values are read from these — `running === desired`,
 * `0 < running < desired`, `running === 0` — and the reading belongs to whoever draws the
 * mark. No threshold, no severity, no verdict is stored here, because storing one would
 * make the model the second place a classification lives.
 *
 * The panel says *"3/5 replicas running."* from exactly these two numbers (FR-81).
 */
export interface Health {
  readonly running: number;
  readonly desired: number;
}

// --- The six kinds ----------------------------------------------------------

/** A machine in the swarm (FR-6). */
export interface Node {
  readonly kind: 'node';
  /** `node:<id>` (AD-5). */
  readonly key: IdentityKey;
  /** Docker ID — the key's own body, and the identifier FR-25 prints. */
  readonly id: string;
  /** The hostname, as an admin would type it (FR-80). */
  readonly name: string;
  /** `DESIGN.md`: role under the node-view header, beside the address. */
  readonly role: NodeRole;
  /** The node's IP. `DESIGN.md`, node-view header; maskable by `scene` (FR-49, FR-51). */
  readonly address: string;
  /** Raw fact for FR-25. A drained node must not read as a healthy one. */
  readonly availability: NodeAvailability;
  /** Raw fact for FR-25. An unreachable node must not read as a healthy one. */
  readonly state: NodeState;
  // No health dimension: no document assigns one to a node (FR-12).
}

/** An overlay or bridge network (FR-6). Rendered as a zone, never as a graph node (FR-8). */
export interface Network {
  readonly kind: 'network';
  /** `network:<name>` (AD-5). */
  readonly key: IdentityKey;
  /** The name, as an admin would type it (FR-80). The zone label is set from it. */
  readonly name: string;
  /** The CIDRs beneath the zone label (`DESIGN.md`); maskable by `scene` (FR-49, FR-51). */
  readonly subnets: readonly string[];
  /**
   * Docker's creation timestamp, ISO 8601.
   *
   * FR-65 assigns a hue in CREATION ORDER and holds it for the life of the network; AD-38
   * makes `model` the owner of that assignment. The owner is not implemented yet — it
   * lands with the consumers that need it — and this is the field it will be derived
   * from, which is what leaving room for it means.
   */
  readonly createdAt: string;
  // No health dimension (FR-12).
}

/** A named volume (FR-6). Where it is mounted, and how, is on the mount edge. */
export interface Volume {
  readonly kind: 'volume';
  /** `volume:<name>` (AD-5). */
  readonly key: IdentityKey;
  /** The name, as an admin would type it (FR-80). `pgdata` beside `pg-data` is the beat. */
  readonly name: string;
  // The mount path and its rw/ro flag are NOT here: one volume mounted by two containers
  // has two paths, so they belong to the edge (see edges.ts).
  // Which node hosts it is the ER diagram's NODE ||--o{ VOLUME edge, likewise.
  // No health dimension (FR-12).
}

/** A Compose namespace grouping services (FR-6, FR-9). Neither a bubble nor a field. */
export interface Stack {
  readonly kind: 'stack';
  /** `stack:<name>` (AD-5's table does not name this kind; see `identity.ts`). */
  readonly key: IdentityKey;
  /** The name, as typed, set on the outline stroke (FR-9, FR-80). */
  readonly name: string;
  // Membership is the ER diagram's STACK ||--o{ SERVICE edge, not an array here:
  // one place holds the relation, and it is edges.ts.
  // No health dimension (FR-12).
}

/** A Swarm service (FR-6). */
export interface Service {
  readonly kind: 'service';
  /** `service:<id>` — Docker ID, stable across `stack deploy` (AD-5). */
  readonly key: IdentityKey;
  /** Docker ID — the key's own body, and the identifier FR-25 prints. */
  readonly id: string;
  /** The name, as an admin would type it (FR-80). */
  readonly name: string;
  /** Which of AD-5's two task key formats this service's tasks take. */
  readonly mode: ServiceMode;
  /** FR-12: counted facts. For a global service, `desired` is one task per eligible node. */
  readonly health: Health;
  // The image is an attribute of a CONTAINER, never of an entity (FR-7). A service's
  // image spec is not in any document's panel, so it is not here.
}

/** One task of a service — the thing an operator calls a container (FR-6). */
export interface Container {
  readonly kind: 'container';
  /** `container:<stack>/<service>/<slot|node>` (AD-5). */
  readonly key: IdentityKey;
  /**
   * The Docker container ID.
   *
   * It is NOT the identity (AD-5, AD-6) and it changes at every redeployment. It is here
   * because AD-6 names exactly one place it still belongs: the detail panel, where it
   * misleads nobody (FR-25).
   */
  readonly id: string;
  /** The task name, as an admin would see it (FR-80). */
  readonly name: string;
  /** `nginx:1.25-alpine`. FR-7: an image is an attribute of a container, never an entity. */
  readonly image: string;
  /** Raw fact for FR-25. Read against `state`, never alone. */
  readonly desiredState: TaskState;
  /** Raw fact for FR-25. Read against `desiredState`, never alone. */
  readonly state: TaskState;
  // No health dimension: FR-12's counted values are a SERVICE's, and a task that is not
  // running carries that as the fact pair above — not as a mark, a colour or a verdict.
  // The slot, and the node of a global task, are the key's own segments: parse them with
  // `parseIdentityKey`, never store a second copy (AD-38).
  // The IP is per network attachment, so it is on the attachment edge (see edges.ts).
}

/** Any one of FR-6's six kinds, discriminated by `kind`. */
export type GraphObject = Node | Network | Volume | Stack | Service | Container;
