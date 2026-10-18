import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createThesisMotion} from '../src/runtime/thesis-motion.js';

test('viewport playback, audio activation, preferences, failure fallback and cleanup',async()=>{
  class Target extends EventTarget {setAttribute(key,value){this[key]=value;}}
  const film=new Target(),source=new Target(),sound=new Target(),status={hidden:true};
  Object.assign(film,{paused:true,muted:true,playCalls:0,querySelector:()=>source,
    async play(){this.playCalls++;this.paused=false;this.dispatchEvent(new Event('play'));},
    pause(){if(!this.paused){this.paused=true;this.dispatchEvent(new Event('pause'));}}});
  const reduced=new Target(),connection=new Target(),doc=new Target();
  Object.assign(reduced,{matches:false});Object.assign(connection,{saveData:false});doc.hidden=false;
  const previous={document:globalThis.document,matchMedia:globalThis.matchMedia,IntersectionObserver:globalThis.IntersectionObserver};
  const oldNavigator=Object.getOwnPropertyDescriptor(globalThis,'navigator');
  let visibility,disconnected=false;
  globalThis.document=doc;globalThis.matchMedia=()=>reduced;
  Object.defineProperty(globalThis,'navigator',{configurable:true,value:{connection}});
  globalThis.IntersectionObserver=class{constructor(callback){visibility=callback;}observe(){}disconnect(){disconnected=true;}};
  const section={dataset:{},querySelector:selector=>({'#energy-thesis-film':film,'#thesis-sound':sound,'#thesis-film-status':status}[selector])};
  let controller;
  const settle=async()=>{await Promise.resolve();await Promise.resolve();};
  try{
    controller=createThesisMotion(section);
    assert.equal(film.playCalls,0,'does not fetch/play before entering viewport');
    visibility([{intersectionRatio:.3,isIntersecting:true}]);await settle();
    assert.equal(film.paused,false);assert.equal(film.muted,true);assert.equal(film.loop,true);assert.equal(film.controls,false);
    sound.dispatchEvent(new Event('click'));await settle();assert.equal(film.muted,false);assert.equal(sound['aria-pressed'],'true');
    assert.equal(sound['aria-label'],'Sound on, mute section soundtrack');
    visibility([{intersectionRatio:0,isIntersecting:false}]);await settle();assert.equal(film.paused,true);
    visibility([{intersectionRatio:.4,isIntersecting:true}]);await settle();assert.equal(film.paused,false);
    doc.hidden=true;doc.dispatchEvent(new Event('visibilitychange'));await settle();assert.equal(film.paused,true);
    doc.hidden=false;doc.dispatchEvent(new Event('visibilitychange'));await settle();assert.equal(film.paused,false);
    controller.toggleMotion();await settle();assert.equal(film.paused,true);assert.equal(section.dataset.motion,'static');
    controller.toggleMotion();await settle();assert.equal(film.paused,false);
    reduced.matches=true;reduced.dispatchEvent(new Event('change'));await settle();
    assert.equal(section.dataset.motion,'static');assert.equal(film.paused,true);assert.equal(sound.disabled,true);
    reduced.matches=false;connection.saveData=true;connection.dispatchEvent(new Event('change'));await settle();assert.equal(film.paused,true);
    connection.saveData=false;connection.dispatchEvent(new Event('change'));await settle();assert.equal(film.paused,false);
    source.dispatchEvent(new Event('error'));assert.equal(section.dataset.motion,'static');assert.equal(status.hidden,false);assert.equal(film.paused,true);
    controller.dispose();assert.equal(disconnected,true);
    const calls=film.playCalls;sound.dispatchEvent(new Event('click'));assert.equal(film.playCalls,calls);
  }finally{
    controller?.dispose();
    for(const [key,value] of Object.entries(previous)){if(value===undefined)delete globalThis[key];else globalThis[key]=value;}
    if(oldNavigator)Object.defineProperty(globalThis,'navigator',oldNavigator);else delete globalThis.navigator;
  }
});
