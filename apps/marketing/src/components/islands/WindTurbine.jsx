'use client';

import React, { useEffect, useRef, useState } from 'react';

export function WindTurbine({ active, rotor }) {
  const mount = useRef(null);
  const [status, setStatus] = useState('poster');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!active || navigator.connection?.saveData) return;
    let alive = true;
    let viewer;
    const controller = new AbortController();
    setStatus('loading');
    import('../../runtime/wind-turbine-scene.js')
      .then(({ createWindTurbine }) => alive ? createWindTurbine(mount.current, controller.signal, () => {
        if (alive) { rotor.current.render = null; viewer?.dispose(); setStatus('error'); }
      }) : null)
      .then((instance) => {
        if (!instance) return;
        if (!alive) { instance.dispose(); return; }
        viewer = instance;
        rotor.current.render = viewer.setAngle;
        viewer.setAngle(rotor.current.angle);
        setStatus('ready');
      })
      .catch((error) => { if (alive && error.name !== 'AbortError') setStatus('error'); });
    return () => { alive = false; controller.abort(); rotor.current.render = null; viewer?.dispose(); };
  }, [active, attempt, rotor]);

  return <figure className="capital-turbine" data-state={status}>
    <div className="capital-turbine-mount" ref={mount} aria-hidden="true" />
    <img src="/assets/gen-z-wind-turbine.webp" width="840" height="1100" alt="Illustrative three-bladed wind turbine representing productive energy infrastructure"
      loading="lazy" className={'capital-turbine-poster' + (status === 'ready' ? ' is-hidden' : '')} />
    <figcaption className="sr-only">The turbine blades follow page scrolling. Reduced motion displays a stationary turbine.</figcaption>
    {status === 'loading' && <p className="capital-model-status" role="status">Loading turbine…</p>}
    {status === 'error' && <div className="capital-model-error"><p role="status">The 3D view is unavailable. The illustration remains visible.</p><button className="text-button" onClick={() => setAttempt((value) => value + 1)}>Retry the 3D turbine</button></div>}
  </figure>;
}
