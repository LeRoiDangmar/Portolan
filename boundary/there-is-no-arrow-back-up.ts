// The target every package's tsconfig `paths` catch-all points `@portolan/*` at,
// for the packages it is not permitted to import.
//
// It is a real file, so module resolution stops here instead of falling back to the
// workspace symlink in node_modules — which is what made a declarative-only graph
// miss an upward import as soon as the other package had been built once.
//
// It lives outside every package's `rootDir`, so including it is TS6059 and the
// build fails, on an incremental run as well as a clean one. ESLint reports the
// same import in readable terms; this is the half that no cached output can hide.
//
// There is no arrow back up, anywhere. See the Dependency direction in
// ARCHITECTURE-SPINE.md, and dependency-graph.json for it as data.

export {};
