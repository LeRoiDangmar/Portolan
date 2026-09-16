// invocations — AD-3's enforcement clause, which asks for this counter by name.
//
// WHY A COUNTER AND NOT A TEST. AD-3 says only three actions may call layout: Reorganise, a
// change of zone mode, and toggling the node backdrop. Filtering, selecting, searching,
// hovering, opening the detail panel, changing text size, changing density, toggling
// masking and changing palette must each produce ZERO calls. AD-8's determinism test cannot
// catch a violation — an unwarranted call returns the same answer, so the map does not move
// and every assertion about positions still passes. Without this counter, AD-3's entire
// reason to exist is guarded by nothing.
//
// IT IS NOT LAYOUT STATE, AND THE DISTINCTION MATTERS. AD-2 gives `layout` the positions and
// the retained cells; this number is neither. It never reaches an output, it is never read
// by the stage itself, and clearing it changes no result — it is an instrument bolted to the
// outside, so that `view-state`'s tests can assert something about a function whose only
// observable behaviour is its return value.

let calls = 0;

/** How many times `layout` has been called in this tab since the last reset. */
export const layoutInvocations = (): number => calls;

/** Count one call. Called by `layout` and by nothing else. */
export const countInvocation = (): void => {
  calls += 1;
};

/**
 * Set the count back to zero.
 *
 * For a test that wants to assert *this interaction made no call*, which is the whole of
 * AD-3's enforcement clause and is unreadable against a running total.
 */
export const resetInvocations = (): void => {
  calls = 0;
};
