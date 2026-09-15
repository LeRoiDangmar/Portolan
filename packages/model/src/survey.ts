// survey — the envelope, and the wire unit.
//
// THE TIMESTAMP TRAVELS IN THE PAYLOAD. The spine's Consistency Conventions put it there
// and FR-5 makes staleness always derive from it, never from the configured interval.
// AD-11 sends a COMPLETE SNAPSHOT per survey and no deltas, so the survey is the unit the
// wire form is declared over — there is no smaller one.
//
// SIX COLLECTIONS AND ONE EDGE LIST. Objects are grouped by kind so that each collection
// has one key format (AD-5) and one AD-7 ordering; edges are one list because an edge's
// kind is its own discriminant and a reachability walk reads all five together.
//
// NOTHING IS INDEXED HERE. No `Map`, no `Set`, no back-reference — AD-42 forbids them in
// the wire form, and a model that carries one and a wire form that does not is exactly the
// place the two ends drift. An index is a consumer's business, built where it is needed.

import type { Edge } from './edges.ts';
import type { Container, GraphObject, Network, Node, Service, Stack, Volume } from './graph.ts';
import { sortEdges } from './edges.ts';
import { sortByIdentityKey } from './identity.ts';
import type { ObjectKind } from './identity.ts';

/** One complete snapshot of the cluster (AD-11). */
export interface Survey {
  /**
   * When the survey was taken, ISO 8601 with an explicit offset.
   *
   * The only time value in the model. Staleness is computed from it and from nothing else
   * (FR-5); the model itself never reads a clock.
   */
  readonly takenAt: string;
  readonly nodes: readonly Node[];
  readonly networks: readonly Network[];
  readonly volumes: readonly Volume[];
  readonly stacks: readonly Stack[];
  readonly services: readonly Service[];
  readonly containers: readonly Container[];
  readonly edges: readonly Edge[];
}

/** The six object collections, in FR-6's order. */
export const SURVEY_COLLECTIONS = [
  'nodes',
  'networks',
  'volumes',
  'stacks',
  'services',
  'containers',
] as const;

/** One of the six object collection names. */
export type SurveyCollection = (typeof SURVEY_COLLECTIONS)[number];

/** Which kind each collection holds — every key in it must be qualified by that kind. */
export const COLLECTION_KIND = {
  nodes: 'node',
  networks: 'network',
  volumes: 'volume',
  stacks: 'stack',
  services: 'service',
  containers: 'container',
} as const satisfies Record<SurveyCollection, ObjectKind>;

/** A survey with nothing in it, taken at `takenAt`. What a cluster with no objects is. */
export const emptySurvey = (takenAt: string): Survey => ({
  takenAt,
  nodes: [],
  networks: [],
  volumes: [],
  stacks: [],
  services: [],
  containers: [],
  edges: [],
});

/** Every object in the survey, in collection order then AD-7 order within a collection. */
export const surveyObjects = (survey: Survey): readonly GraphObject[] => [
  ...survey.nodes,
  ...survey.networks,
  ...survey.volumes,
  ...survey.stacks,
  ...survey.services,
  ...survey.containers,
];

/**
 * The survey in AD-7 order: every collection sorted by identity key, edges sorted too.
 *
 * AD-7 puts this call at the collector, before the model is handed on. It lives here
 * because the comparator does (AD-38): a collector that sorted with its own function
 * would be the second owner of an order the silhouette seed and the retained cell both
 * depend on.
 */
export const sortSurvey = (survey: Survey): Survey => ({
  takenAt: survey.takenAt,
  nodes: sortByIdentityKey(survey.nodes),
  networks: sortByIdentityKey(survey.networks),
  volumes: sortByIdentityKey(survey.volumes),
  stacks: sortByIdentityKey(survey.stacks),
  services: sortByIdentityKey(survey.services),
  containers: sortByIdentityKey(survey.containers),
  edges: sortEdges(survey.edges),
});
