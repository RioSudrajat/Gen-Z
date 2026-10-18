import React, { useEffect, useState } from 'react';
import { site } from '../../config/site';
import { Navigation } from './Navigation.jsx';
import { subscribeLandingRuntime } from '../../runtime/landing-session.js';

export function NavigationIsland() {
  const [runtime, setRuntime] = useState(null);
  useEffect(() => subscribeLandingRuntime(setRuntime), []);
  if (runtime && !runtime.failed) return <Navigation media={runtime.media} sectionMedia={runtime.sectionMedia} />;
  return <nav className="navigation-fallback" aria-label="Main navigation">
    <a href="#top" className="brand"><img src="/assets/gen-z-symbol.svg" width="32" height="32" alt="" />Gen-Z</a>
    <a href="/contact/">Contact Gen-Z</a><a className="launch-button" href={site.platformAuthUrl}>Launch app</a>
    {runtime?.failed && <span role="status">Motion unavailable. Page links remain available.</span>}
  </nav>;
}
