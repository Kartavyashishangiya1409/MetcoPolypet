// Browser-side renderer, ported verbatim from the design's preform-img.js.
// Loaded by render-preforms.mjs inside headless Chromium; exposes window.renderPreform(spec, W, H).
import * as T from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const r = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
r.toneMapping = T.ACESFilmicToneMapping;
r.toneMappingExposure = 1.0;
r.outputColorSpace = T.SRGBColorSpace;
const pm = new T.PMREMGenerator(r);
const env = pm.fromScene(new RoomEnvironment(), 0.04).texture;
const sc = document.createElement('canvas');
sc.width = sc.height = 256;
const sg = sc.getContext('2d');
const sgr = sg.createRadialGradient(128, 128, 0, 128, 128, 128);
sgr.addColorStop(0, 'rgba(0,0,0,0.42)');
sgr.addColorStop(0.5, 'rgba(0,0,0,0.14)');
sgr.addColorStop(1, 'rgba(0,0,0,0)');
sg.fillStyle = sgr;
sg.fillRect(0, 0, 256, 256);
const L = { T, r, env, shadow: new T.CanvasTexture(sc), mats: {}, geos: {} };

const TINT = { clear: '#d9ecea', blue: '#5fb3c4', green: '#4f9a62', amber: '#b0661c', white: '#f1f1ec' };
function geo(L, T, neck, len) {
  const k = neck + '_' + len;
  if (L.geos[k]) return L.geos[k];
  const V = (x, y) => new T.Vector2(Math.max(0.001, x), y);
  const nr = neck * 0.05, H = len * 0.1, hn = Math.max(1.5, neck * 0.068), rb = H - hn;
  const br = nr * 0.9, bb = nr * 0.76, w = 0.36;
  const o = [V(0, 0), V(bb * 0.55, bb * 0.1), V(bb * 0.86, bb * 0.38), V(bb, bb * 0.95), V(bb * 1.02, rb * 0.5), V(br, rb - 0.55), V(br * 1.03, rb - 0.3),
    V(nr + 0.3, rb - 0.22), V(nr + 0.36, rb - 0.08), V(nr + 0.36, rb + 0.02), V(nr + 0.28, rb + 0.12), V(nr, rb + 0.16)];
  const t0 = rb + 0.42, t1 = H - 0.22, n = 3, step = (t1 - t0) / n;
  for (let i = 0; i < n; i++) { const y = t0 + i * step; o.push(V(nr, y), V(nr + 0.12, y + step * 0.3), V(nr + 0.12, y + step * 0.55), V(nr, y + step * 0.85)); }
  o.push(V(nr, H - 0.06), V(nr - 0.05, H));
  const ir = nr - 0.2;
  const inn = [V(ir, H), V(ir, rb - 0.1), V(br - w, rb - 0.75), V(bb - w, bb * 0.95), V((bb - w) * 0.7, 0.46), V(0, 0.35)];
  const g = new T.LatheGeometry(o.concat(inn), 128);
  g.computeVertexNormals();
  return (L.geos[k] = g);
}
function mat(L, T, tint) {
  if (L.mats[tint]) return L.mats[tint];
  let m;
  if (tint === 'white') m = new T.MeshPhysicalMaterial({ color: TINT.white, roughness: 0.32, clearcoat: 0.8, clearcoatRoughness: 0.15, sheen: 0.4, envMapIntensity: 1 });
  else {
    const c = new T.Color(TINT[tint] || TINT.clear), clear = tint === 'clear';
    m = new T.MeshPhysicalMaterial({ color: clear ? new T.Color('#f4fbfa') : c, transparent: true, opacity: clear ? 0.16 : 0.34,
      roughness: 0.05, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03, specularIntensity: 1, envMapIntensity: 2.4, depthWrite: false, side: T.DoubleSide });
    const rimCol = clear ? 'vec3(0.92,0.97,0.97)' : 'vec3(' + c.r.toFixed(3) + ',' + c.g.toFixed(3) + ',' + c.b.toFixed(3) + ')';
    m.onBeforeCompile = (sh) => {
      sh.fragmentShader = sh.fragmentShader.replace('#include <dithering_fragment>',
        '#include <dithering_fragment>\n float frs = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 2.2);\n gl_FragColor.rgb = mix(gl_FragColor.rgb, ' + rimCol + ' * 0.85 + gl_FragColor.rgb*0.4, frs*0.6);\n gl_FragColor.a = clamp(gl_FragColor.a + frs*0.7, 0.0, 0.96);');
    };
    m.customProgramCacheKey = () => 'pf_' + tint;
  }
  return (L.mats[tint] = m);
}
function parse(s) { return (s || '28,98,clear').split(';').filter(Boolean).map((x) => { const [a, b, c] = x.split(','); return { neck: +a || 28, len: +b || 98, tint: (c || 'clear').trim() }; }); }
function rng(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
function render(L, spec, W, Hh) {
  const { T, r } = L, items = parse(spec.items), layout = spec.layout || 'single';
  const scene = new T.Scene(); scene.environment = L.env; scene.background = new T.Color(spec.bg || '#E7E7E2');
  const grp = new T.Group(); scene.add(grp);
  const mk = (it) => new T.Mesh(geo(L, T, it.neck, it.len), mat(L, T, it.tint));
  const shade = (x, rad) => { const p = new T.Mesh(new T.PlaneGeometry(rad * 3.2, rad * 1.6), new T.MeshBasicMaterial({ map: L.shadow, transparent: true, depthWrite: false })); p.rotation.x = -Math.PI / 2; p.position.set(x, 0.002, 0); grp.add(p); };
  const dark = new T.Color(spec.bg || '#E7E7E2').getHSL({}).l < 0.4;
  let focus = null;
  if (layout === 'lineup' || layout === 'trio') {
    let x = 0; const gap = layout === 'trio' ? 1.1 : 0.55;
    items.forEach((it, i) => { const rad = it.neck * 0.05 + 0.36; x += i ? rad : 0; const m = mk(it); m.position.x = x; m.rotation.y = i * 0.7; grp.add(m); if (!dark) shade(x, rad); x += rad + gap; });
  } else if (layout === 'pile') {
    const rnd = rng(7), N = +spec.count || 36;
    for (let i = 0; i < N; i++) { const it = items[i % items.length], m = mk(it);
      const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd());
      m.position.set(Math.cos(a) * d * 9 + (+spec.ox || 0), (rnd() - 0.5) * 5.5 + (+spec.oy || 0), Math.sin(a) * d * 4 - 1);
      m.rotation.set(rnd() * Math.PI * 2, rnd() * Math.PI * 2, rnd() * Math.PI * 2); grp.add(m); }
  } else {
    const it = items[0], m = mk(it); m.rotation.y = 0.6; grp.add(m);
    if (layout === 'tilt') { m.rotation.z = -0.62; m.rotation.x = 0.18; }
    else if (!dark && layout !== 'macro') shade(0, it.neck * 0.05 + 0.36);
    if (layout === 'macro') { const H = it.len * 0.1, hn = Math.max(1.5, it.neck * 0.068), nr = it.neck * 0.05;
      focus = new T.Box3(new T.Vector3(-nr - 0.6, H - hn - 1.6, -nr), new T.Vector3(nr + 0.6, H + 0.2, nr)); }
  }
  const box = focus || (layout === 'pile' ? new T.Box3(new T.Vector3(-22, -12, -5), new T.Vector3(22, 12, 3)) : new T.Box3().setFromObject(grp, true));
  if (!focus && layout !== 'pile') { box.min.y = Math.max(box.min.y, -0.2); }
  const size = box.getSize(new T.Vector3()), ctr = box.getCenter(new T.Vector3());
  const aspect = W / Hh, fov = layout === 'macro' ? 22 : 26, cam = new T.PerspectiveCamera(fov, aspect, 0.1, 500);
  const t = Math.tan(fov * Math.PI / 360), pad = layout === 'macro' ? 1.0 : layout === 'pile' ? (+spec.pad || 1.1) : (+spec.pad || 1.32);
  const dist = Math.max(size.y / (2 * t), size.x / (2 * t * aspect)) * pad + size.z / 2;
  const el = layout === 'tilt' || layout === 'pile' ? 0 : layout === 'macro' ? -0.08 : 0.16;
  cam.position.set(ctr.x, ctr.y + dist * el, ctr.z + dist); cam.lookAt(ctr);
  const key = new T.DirectionalLight(0xffffff, 1.4); key.position.set(-6, 12, 10); scene.add(key);
  const rim = new T.DirectionalLight(0xffffff, 2.2); rim.position.set(8, 4, -10); scene.add(rim);
  r.setSize(W, Hh, false); r.render(scene, cam);
  return r.domElement.toDataURL('image/png');
}

window.renderPreform = (spec, W, H) => render(L, spec, W, H);
window.rendererReady = true;
