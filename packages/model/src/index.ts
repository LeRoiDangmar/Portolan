// model — Graph types, wire form and identity keys, imported by both ends (AD-4, AD-5, AD-42).
//
// ONE DEFINITION OF THE GRAPH, ON BOTH SIDES OF THE SEAM. AD-4 makes this the only package
// that says what a service, a network or a container is; the collector fills it and the
// renderer reads it, and neither redefines a type. That is what NFR-5's three seams exist
// to protect, and the renderer may know a Docker-ism in exactly the three places NFR-6
// names — object vocabulary (FR-80), the socket-unreachable screen (FR-57), the
// engine-too-old message (FR-64) — and nowhere else.
//
// SHARED TYPES ALONE GUARANTEE NOTHING, WHICH IS WHY AD-42 IS HERE TOO. `Map`, `Set`,
// cyclic references and class instances are natural in a model and unrepresentable in an
// SSE payload, so a package that stopped at the types would let the server serialise one
// way and the client reconstruct another, and AD-4's *one definition* would hold only in
// the type checker. EVERY GRAPH TYPE HAS A WIRE REPRESENTATION, OR IT IS NOT ADMISSIBLE IN
// THE MODEL: `wire.ts` declares that form, owns both directions of the conversion, and
// `wire.test.ts` runs the model → wire → model round trip AD-42 asks for by name.
//
// THIS PACKAGE IMPORTS NOTHING AND HOLDS NOTHING ACROSS CALLS (AD-2,
// `dependency-graph.json`). No position, no camera, no reading level, no presentation
// state, no masking, no colour — those belong to `layout`, `view-state`, `scene` and the
// rasterisers, and a model that knew one of them is the defect AD-38 exists to prevent.
//
// WHAT AD-38 ALSO PUTS HERE AND IS NOT HERE YET: the link-driven silhouette deform and its
// reservation hull (FR-13, FR-70), network hue and octave from creation order (FR-65), the
// orphan set and count (FR-35, FR-74), transitive reach at N hops (FR-22, FR-23). AD-38
// fixes their owning PACKAGE, not their delivery date — they land with the consumers that
// need them, and the types above leave room for each.

export type {
  Identified,
  IdentityKey,
  ObjectKind,
  ParsedContainerKey,
  ParsedIdentityKey,
  ParsedNetworkKey,
  ParsedNodeKey,
  ParsedServiceKey,
  ParsedStackKey,
  ParsedVolumeKey,
} from './identity.ts';
export {
  KIND_SEPARATOR,
  OBJECT_KINDS,
  SEGMENT_SEPARATOR,
  byIdentityKey,
  compareIdentityKeys,
  globalTaskKey,
  identityKind,
  isIdentityKey,
  isObjectKind,
  networkKey,
  nodeKey,
  parseIdentityKey,
  replicatedTaskKey,
  serviceKey,
  sortByIdentityKey,
  stackKey,
  volumeKey,
} from './identity.ts';

export type {
  Container,
  GraphObject,
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
export {
  NODE_AVAILABILITIES,
  NODE_ROLES,
  NODE_STATES,
  SERVICE_MODES,
  TASK_STATES,
} from './graph.ts';

export type {
  AttachmentEdge,
  Cardinality,
  Edge,
  EdgeEnds,
  EdgeKind,
  EdgeRule,
  GroupsEdge,
  HostsEdge,
  MountAccess,
  MountEdge,
  RunsEdge,
} from './edges.ts';
export { EDGE_KINDS, EDGE_RULES, MOUNT_ACCESS, compareEdges, sortEdges } from './edges.ts';

export type { Survey, SurveyCollection } from './survey.ts';
export {
  COLLECTION_KIND,
  SURVEY_COLLECTIONS,
  emptySurvey,
  sortSurvey,
  surveyObjects,
} from './survey.ts';

export type {
  BubbleKind,
  ContourPoint,
  CoreRect,
  CubicSegment,
  Point,
  Silhouette,
} from './silhouette.ts';
export {
  AMPLITUDE_STEPS,
  BASE_RADIUS,
  BEARINGS,
  CORE_FRACTION,
  SILHOUETTE_AMPLITUDE,
  SILHOUETTE_POINTS,
  amplitudeAt,
  clearsCore,
  pointOnSegment,
  silhouette,
} from './silhouette.ts';

export type {
  WireAttachmentEdge,
  WireContainer,
  WireEdge,
  WireFormMatchesModel,
  WireGroupsEdge,
  WireHostsEdge,
  WireMountEdge,
  WireNetwork,
  WireNode,
  WireRunsEdge,
  WireService,
  WireSnapshot,
  WireStack,
  WireSurvey,
  WireVolume,
} from './wire.ts';
export { WIRE_ERROR_PREFIX, WIRE_VERSION, fromWire, toWire } from './wire.ts';
