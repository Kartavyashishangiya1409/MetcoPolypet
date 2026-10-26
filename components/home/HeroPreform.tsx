'use client';

// Port of the design's preform-glb.js. Every material, lighting, camera, physics, float and
// shadow value is unchanged — they were tuned by eye. Additions: Meshopt decoding, pausing when
// off-screen or the tab is hidden, and full disposal on unmount.

import { useEffect, useRef } from 'react';
import * as T from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import s from './Hero.module.scss';

type Props = {
  src: string;
  bg?: string;
  onLoad?: () => void;
};

/** Dark studio with softboxes: gives glass dark edges + crisp highlights */
function studio() {
  const scene = new T.Scene();
  const room = new T.Mesh(
    new T.BoxGeometry(30, 30, 30),
    new T.MeshBasicMaterial({ color: 0x15181a, side: T.BackSide }),
  );
  scene.add(room);
  const panel = (w: number, h: number, x: number, y: number, z: number, inten: number) => {
    const m = new T.Mesh(
      new T.PlaneGeometry(w, h),
      new T.MeshBasicMaterial({ color: new T.Color(inten, inten, inten), side: T.DoubleSide }),
    );
    m.position.set(x, y, z);
    m.lookAt(0, y * 0.3, 0);
    scene.add(m);
  };
  panel(1.2, 16, -7, 1, 4, 14); // left strip
  panel(0.8, 16, 7.5, 1, 2, 10); // right strip
  panel(10, 3, 0, 12, 0, 3); // top
  panel(8, 10, 0, 0, -13, 1.6); // back fill
  panel(14, 12, 0, 0, 14, 0.35); // front fill (camera side)
  return scene;
}

/** Let the browser paint / handle input between heavy setup steps. */
const yieldToMain = () =>
  new Promise<void>((resolve) => {
    const sched = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
    if (sched?.yield) sched.yield().then(resolve);
    else setTimeout(resolve, 0);
  });

function disposeScene(root: T.Object3D) {
  root.traverse((o) => {
    const mesh = o as T.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const mats = mesh.material ? ([] as T.Material[]).concat(mesh.material) : [];
    mats.forEach((m) => {
      (m as T.MeshBasicMaterial).map?.dispose();
      m.dispose();
    });
  });
}

export default function HeroPreform({ src, bg = '#F4F4F1', onLoad }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onLoadRef = useRef(onLoad);
  onLoadRef.current = onLoad;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let dead = false;
    let raf = 0;
    let ready = false;
    let envRT: T.WebGLRenderTarget | null = null;
    let model: T.Object3D | null = null;

    const r = new T.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    r.toneMapping = T.ACESFilmicToneMapping;
    r.toneMappingExposure = 0.9;
    r.outputColorSpace = T.SRGBColorSpace;
    r.setClearColor(bg, 1);
    r.domElement.className = s.canvas;
    host.appendChild(r.domElement);

    const scene = new T.Scene();
    scene.background = new T.Color(bg);

    // soft contact shadow
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d')!;
    const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    gr.addColorStop(0, 'rgba(0,0,0,.28)');
    gr.addColorStop(0.6, 'rgba(0,0,0,.08)');
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 256, 256);
    const shadow = new T.Mesh(
      new T.PlaneGeometry(5.2, 1.6),
      new T.MeshBasicMaterial({ map: new T.CanvasTexture(c), transparent: true, depthWrite: false }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -5.6;
    scene.add(shadow);

    const cam = new T.PerspectiveCamera(22, 1, 0.1, 200);
    const holder = new T.Group();
    const spin = new T.Group();
    holder.add(spin);
    scene.add(holder);

    const glass = new T.MeshPhysicalMaterial({
      color: 0xf2f8f8,
      metalness: 0,
      roughness: 0.03,
      transparent: true,
      opacity: 0.1,
      specularIntensity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.01,
      envMapIntensity: 1.6,
      side: T.DoubleSide,
      depthWrite: false,
    });
    glass.onBeforeCompile = (sh) => {
      sh.fragmentShader = sh.fragmentShader.replace(
        '#include <dithering_fragment>',
        '#include <dithering_fragment>\n float frs = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 1.35);\n float lum = dot(gl_FragColor.rgb, vec3(0.333));\n float hiL = smoothstep(0.86, 1.0, lum) * (1.0 - frs*0.55);\n gl_FragColor.rgb = mix(mix(gl_FragColor.rgb * 0.92, vec3(0.16,0.19,0.21), frs*0.92), vec3(1.0), hiL);\n gl_FragColor.a = clamp(0.03 + frs*0.95 + hiL, 0.0, 0.97);',
      );
    };
    glass.customProgramCacheKey = () => 'pfglb';

    // Heavy setup is split into steps that yield to the main thread (no long tasks).
    const boot = async () => {
      await yieldToMain();
      if (dead) return;
      const pm = new T.PMREMGenerator(r);
      const studioScene = studio();
      envRT = pm.fromScene(studioScene, 0.02);
      scene.environment = envRT.texture;
      disposeScene(studioScene);
      pm.dispose();
      await yieldToMain();
      if (dead) return;
      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);
      loader.load(
        src,
        (gltf) => {
          if (dead) {
            disposeScene(gltf.scene);
            return;
          }
          const m = gltf.scene;
          m.traverse((o) => {
            const mesh = o as T.Mesh;
            if (mesh.isMesh) {
              if (!mesh.geometry.attributes.normal) mesh.geometry.computeVertexNormals();
              (mesh.material as T.Material).dispose();
              mesh.material = glass;
              mesh.renderOrder = mesh.name.indexOf('Thread') >= 0 ? 2 : 1;
            }
          });
          const box = new T.Box3().setFromObject(m);
          const sz = box.getSize(new T.Vector3());
          const ctr = box.getCenter(new T.Vector3());
          const k = 10.6 / sz.y;
          m.scale.setScalar(k);
          m.position.set(-ctr.x * k, -ctr.y * k, -ctr.z * k);
          spin.add(m);
          model = m;
          // Compile shaders off the critical path (KHR_parallel_shader_compile where available)
          // and draw one frame before announcing, so the cross-fade never shows a blank canvas.
          r.compileAsync(scene, cam).then(() => {
            if (dead) return;
            r.render(scene, cam);
            ready = true;
            sync();
            host.dataset.ready = '';
            onLoadRef.current?.();
          });
        },
        undefined,
        (e) => console.warn('hero preform load', e),
      );
    };

    const fit = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      r.setSize(w, h, false);
      cam.aspect = w / h;
      const t = Math.tan((cam.fov * Math.PI) / 360);
      const d = Math.max(12.4 / (2 * t), 4.2 / (2 * t * cam.aspect));
      cam.position.set(0, 1.2, d);
      cam.lookAt(0, -0.2, 0);
      cam.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(fit);
    ro.observe(host);
    fit();

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const st = { ry: 0.4, vy: reduce ? 0 : 0.4, auto: reduce ? 0 : 0.4, drag: false, lx: 0, ly: 0, tx: 0, rx: 0 };
    const cv = r.domElement;
    const down = (e: PointerEvent) => {
      st.drag = true;
      st.lx = e.clientX;
      st.ly = e.clientY;
      cv.style.cursor = 'grabbing';
      cv.setPointerCapture?.(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!st.drag) return;
      const dx = e.clientX - st.lx;
      const dy = e.clientY - st.ly;
      st.lx = e.clientX;
      st.ly = e.clientY;
      st.ry += dx * 0.011;
      st.vy = dx * 0.011 * 60;
      st.tx = Math.max(-0.4, Math.min(0.4, st.tx + dy * 0.005));
    };
    const up = () => {
      if (!st.drag) return;
      st.drag = false;
      cv.style.cursor = 'grab';
      st.vy = Math.max(-9, Math.min(9, st.vy));
    };
    cv.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);

    let last = performance.now();
    const t0 = last;
    const loop = () => {
      if (dead) return;
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!st.drag) {
        st.vy += (st.auto - st.vy) * Math.min(1, dt * 1.3);
        st.ry += st.vy * dt;
        st.tx *= 0.94;
      }
      st.rx += (st.tx - st.rx) * 0.12;
      spin.rotation.y = st.ry;
      holder.rotation.x = st.rx;
      const f = reduce ? 0 : Math.sin(((now - t0) / 1000) * 0.9);
      holder.position.y = f * 0.14;
      shadow.scale.setScalar(1 - f * 0.06);
      r.render(scene, cam);
      raf = requestAnimationFrame(loop);
    };

    // Only render while the hero is on screen and the tab is visible.
    let onScreen = true;
    const sync = () => {
      const run = ready && onScreen && !document.hidden;
      if (run && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      sync();
    });
    io.observe(host);
    document.addEventListener('visibilitychange', sync);
    boot();

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', sync);
      cv.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      if (model) model.traverse((o) => (o as T.Mesh).geometry?.dispose());
      glass.dispose();
      disposeScene(shadow);
      envRT?.dispose();
      r.dispose();
      r.forceContextLoss();
      cv.remove();
    };
  }, [src, bg]);

  return <div ref={hostRef} className={s.viewer} />;
}
