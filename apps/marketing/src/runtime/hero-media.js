export function createHeroMedia(video, statusElement) {
  const listeners = new Set();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  let state = 'paused';
  let requested = true;
  let inView = false;
  let typographyReady = false;
  const emit = (next) => { state = next; listeners.forEach((listener) => listener(next)); };
  const onPlay = () => emit('playing');
  const onPause = () => { if (state !== 'error') emit('paused'); };
  const onError = () => {
    video.pause();
    emit('error');
    statusElement.textContent = 'The background film could not load. Retry it in Resources.';
  };
  async function play() {
    try { await video.play(); }
    catch (error) { if (!['AbortError', 'NotAllowedError'].includes(error.name)) onError(); }
  }
  const automaticallyAllowed = () => requested && typographyReady && inView && !document.hidden && !reduced.matches && !connection?.saveData;
  const onPreference = () => automaticallyAllowed() ? play() : video.pause();
  const onVisibility = () => document.hidden ? video.pause() : onPreference();
  video.addEventListener('play', onPlay);
  video.addEventListener('pause', onPause);
  video.addEventListener('error', onError);
  const source = video.querySelector('source');
  source.addEventListener('error', onError);
  reduced.addEventListener('change', onPreference);
  connection?.addEventListener('change', onPreference);
  document.addEventListener('visibilitychange', onVisibility);
  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (!entry.isIntersecting) video.pause();
    else if (automaticallyAllowed()) play();
  }, { threshold: .1 });
  observer.observe(video);
  document.fonts.ready.then(() => requestAnimationFrame(() => requestAnimationFrame(() => { typographyReady = true; onPreference(); })));
  return {
    getState: () => state,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    pause: () => video.pause(),
    async toggle() {
      if (state === 'playing') { requested = false; video.pause(); return; }
      requested = true;
      if (state === 'error') {
        const retryURL = new URL(source.src);
        retryURL.searchParams.set('retry', Date.now());
        source.src = retryURL.href;
        statusElement.textContent = '';
        emit('paused');
        video.load();
      }
      await play();
    },
    dispose() {
      video.pause(); observer.disconnect(); listeners.clear();
      video.removeEventListener('play', onPlay); video.removeEventListener('pause', onPause);
      video.removeEventListener('error', onError); source.removeEventListener('error', onError);
      reduced.removeEventListener('change', onPreference); connection?.removeEventListener('change', onPreference);
      document.removeEventListener('visibilitychange', onVisibility);
    },
  };
}
