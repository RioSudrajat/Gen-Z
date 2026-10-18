import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function disposeModel(model) {
  const geometries = new Set();
  const materials = new Set();
  model?.traverse((object) => {
    if (!object.isMesh) return;
    geometries.add(object.geometry);
    (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) => materials.add(material));
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
}

export async function createWindTurbine(container, signal, onContextLost) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0xffffff, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0xb2c2bd, 2.4));
  const key = new THREE.DirectionalLight(0xffffff, 3.3);
  key.position.set(-60, 100, 90);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xc9e5df, 1.6);
  fill.position.set(60, 50, -40);
  scene.add(fill);
  const camera = new THREE.OrthographicCamera(-50, 50, 59, -59, 0.1, 600);
  camera.position.set(65, 86, 240);
  camera.lookAt(0, 52, 0);
  let model;
  try {
    const response = await fetch('/assets/gen-z-wind-turbine.glb', { signal });
    if (!response.ok) throw new Error('Turbine model request failed');
    const gltf = await new GLTFLoader().parseAsync(await response.arrayBuffer(), '/assets/');
    model = gltf.scene;
    if (signal.aborted) throw new DOMException('Turbine loading cancelled', 'AbortError');
    const rigNodes = [];
    model.traverse((object) => { if (object.isLight || object.isCamera) rigNodes.push(object); });
    rigNodes.forEach((object) => object.removeFromParent());
    scene.add(model);
    if (!model.getObjectByName('ROTOR_wind')) throw new Error('Turbine rotor is missing');
  } catch (error) {
    disposeModel(model);
    renderer.dispose();
    throw error;
  }

  const rotor = model.getObjectByName('ROTOR_wind');
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  // The canvas never captures wheel, pointer, or touch input from the page.
  canvas.style.pointerEvents = 'none';
  container.append(canvas);
  let frame;
  let visible = false;
  let disposed = false;
  const render = () => {
    if (disposed || !visible || document.hidden) return;
    if (frame) return;
    frame = requestAnimationFrame(() => { frame = null; if (!disposed && visible && !document.hidden) renderer.render(scene, camera); });
  };
  const resize = () => {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    const aspect = width / height;
    const viewHeight = Math.max(118, 80 / aspect);
    camera.left = -viewHeight * aspect / 2;
    camera.right = viewHeight * aspect / 2;
    camera.top = viewHeight / 2;
    camera.bottom = -viewHeight / 2;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld(true);
    renderer.setSize(width, height);
    const ground = new THREE.Vector3(0, 0, 0).project(camera);
    container.parentElement.style.setProperty('--turbine-ground', ((1 + ground.y) * height / 2 - 6) + 'px');
    render();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) render();
    else { cancelAnimationFrame(frame); frame = null; }
  });
  visibility.observe(container);
  const onVisibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = null; } else render(); };
  document.addEventListener('visibilitychange', onVisibility);
  const lost = (event) => { event.preventDefault(); onContextLost(); };
  canvas.addEventListener('webglcontextlost', lost);

  resize();
  return {
    setAngle(angle) {
      rotor.rotation.z = -angle;
      canvas.dataset.rotorAngle = angle.toFixed(4);
      render();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', lost);
      container.parentElement.style.removeProperty('--turbine-ground');
      disposeModel(model);
      renderer.dispose();
      canvas.remove();
    },
  };
}
