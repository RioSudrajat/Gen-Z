// Browser-only media controllers; no identity, account or persisted state.
let current;
const listeners = new Set();

export function publishLandingRuntime(runtime) {
  current = runtime;
  listeners.forEach(listener => listener(runtime));
}

export function subscribeLandingRuntime(listener) {
  listeners.add(listener);
  if (current) listener(current);
  return () => listeners.delete(listener);
}
