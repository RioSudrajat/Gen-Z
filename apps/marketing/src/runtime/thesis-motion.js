export function createThesisMotion(section) {
  const film=section?.querySelector('#energy-thesis-film');
  const status=section?.querySelector('#thesis-film-status');
  const sound=section?.querySelector('#thesis-sound');
  const idle={enabled:false,canAnimate:false,playing:false,sound:false,error:false};
  if (!film || !sound || !status) return {getState:()=>idle,subscribe:()=>()=>{},toggleMotion:()=>{},dispose:()=>{}};
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const connection=navigator.connection;
  const listeners=new Set();
  let manuallyStopped=false, inView=false, failed=false, disposed=false, playAttempt=0;
  const allowed=()=>!reduced.matches&&!connection?.saveData;
  const enabled=()=>allowed()&&!manuallyStopped;
  const getState=()=>({enabled:enabled(),canAnimate:allowed(),playing:!film.paused,sound:!film.muted,error:failed});
  const emit=()=>{
    section.dataset.motion=enabled()&&!failed?'animated':'static';
    sound.setAttribute('aria-pressed',String(!film.muted));
    sound.textContent=film.muted?'Sound off':'Sound on';
    sound.setAttribute('aria-label',film.muted?'Sound off, enable section soundtrack':'Sound on, mute section soundtrack');
    sound.disabled=!enabled()||failed;
    listeners.forEach(listener=>listener(getState()));
  };
  const shouldPlay=()=>enabled()&&inView&&!document.hidden&&!failed&&!disposed;
  async function sync() {
    const attempt=++playAttempt;
    if (!shouldPlay()) {film.pause();emit();return;}
    try {
      await film.play();
      // A pending play promise must not undo a newer viewport/preference decision.
      if (disposed||!shouldPlay()) film.pause();
      if(attempt!==playAttempt)return;
    } catch(error) {
      if(error.name==='NotAllowedError'&&!film.muted) {
        film.muted=true;
        if(shouldPlay()) {try {await film.play();}catch{}}
      } else if(!['AbortError','NotAllowedError'].includes(error.name)) onError();
    }
    if(!disposed)emit();
  }
  function onError(){failed=true;film.pause();status.hidden=false;emit();}
  function onLoaded(){failed=false;status.hidden=true;sync();}
  function onSound(){
    film.muted=!film.muted;
    film.volume=.65;
    // Invoked directly from the visitor's click so audible playback has activation.
    sync();emit();
  }
  const observer=new IntersectionObserver(([entry])=>{
    if(entry.intersectionRatio>=.18)inView=true;
    else if(!entry.isIntersecting)inView=false;
    sync();
  },{threshold:[0,.18]});
  const source=film.querySelector('source');
  film.muted=true;film.loop=true;film.controls=false;film.volume=.65;
  film.addEventListener('error',onError);source?.addEventListener('error',onError);
  film.addEventListener('loadeddata',onLoaded);
  film.addEventListener('play',emit);film.addEventListener('pause',emit);
  sound.addEventListener('click',onSound);
  reduced.addEventListener('change',sync);connection?.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  observer.observe(film);emit();
  return {
    getState,
    subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener);},
    toggleMotion(){manuallyStopped=!manuallyStopped;sync();},
    dispose(){disposed=true;++playAttempt;film.pause();observer.disconnect();listeners.clear();
      film.removeEventListener('error',onError);source?.removeEventListener('error',onError);
      film.removeEventListener('loadeddata',onLoaded);film.removeEventListener('play',emit);film.removeEventListener('pause',emit);
      sound.removeEventListener('click',onSound);reduced.removeEventListener('change',sync);
      connection?.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);
    },
  };
}
