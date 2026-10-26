(function(){
if (customElements.get('preform-3d')) return;
class Preform3D extends HTMLElement {
  connectedCallback(){
    if (this._init) return; this._init = true;
    if (!this.style.display) this.style.display = 'block';
    Promise.all([
      import('https://esm.sh/three@0.160.0'),
      import('https://esm.sh/three@0.160.0/examples/jsm/environments/RoomEnvironment.js')
    ]).then(([THREE, env]) => this._build(THREE, env.RoomEnvironment)).catch(e => console.warn('preform-3d', e));
  }
  disconnectedCallback(){ this._dead = true; cancelAnimationFrame(this._raf); this._ro && this._ro.disconnect(); this._off && this._off(); this._renderer && this._renderer.dispose(); this._init = false; }
  _glass(T, opts){
    const m = new T.MeshPhysicalMaterial({ color: opts.color || 0xffffff, transparent:true, opacity: opts.opacity ?? 0.08, roughness:0.04, metalness:0,
      clearcoat:1, clearcoatRoughness:0.02, specularIntensity:1, envMapIntensity: opts.env ?? 2.2, depthWrite:false, side:T.DoubleSide });
    const rim = opts.rim || 'vec3(0.30,0.34,0.36)', amt = (opts.rimAmt ?? 0.9).toFixed(2);
    m.onBeforeCompile = (sh) => {
      sh.fragmentShader = sh.fragmentShader.replace('#include <dithering_fragment>',
        '#include <dithering_fragment>\n float frs = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 2.6);\n vec3 spec = max(gl_FragColor.rgb - vec3(0.55), 0.0);\n gl_FragColor.rgb = mix(gl_FragColor.rgb, ' + rim + ' + spec*2.0, frs*' + amt + ');\n gl_FragColor.a = clamp(gl_FragColor.a + frs*0.85 + dot(spec, vec3(0.6)), 0.0, 0.97);');
    };
    m.customProgramCacheKey = () => 'pf3d_' + rim + amt;
    return m;
  }
  _build(T, RoomEnvironment){
    if (this._dead) return;
    const r = new T.WebGLRenderer({ antialias:true, alpha:true, preserveDrawingBuffer:true });
    r.setPixelRatio(Math.min(devicePixelRatio, 2));
    r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = 1.0; r.outputColorSpace = T.SRGBColorSpace;
    r.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;cursor:grab;touch-action:pan-y';
    this.appendChild(r.domElement); this._renderer = r;
    const scene = new T.Scene();
    scene.environment = new T.PMREMGenerator(r).fromScene(new RoomEnvironment(), 0.03).texture;
    const cam = new T.PerspectiveCamera(24, 1, 0.1, 100);
    const V = (x,y) => new T.Vector2(Math.max(0.001,x), y);
    // proportions taken from a 28 mm PCO preform: body Ø ≈ 0.24 × height
    const outer = [V(0,0),V(0.55,0.06),V(0.9,0.3),V(1.1,0.68),V(1.18,1.1),V(1.2,1.5),V(1.215,6.8),V(1.23,7.25),V(1.24,7.42),
      V(1.5,7.47),V(1.54,7.56),V(1.54,7.64),V(1.5,7.72),V(1.25,7.75),V(1.25,7.86),V(1.31,7.9),V(1.31,8.0),V(1.22,8.06),
      V(1.2,8.1),V(1.2,9.88),V(1.17,9.97),V(1.1,10)];
    const inner = [V(0.98,10),V(0.98,7.9),V(0.95,7.1),V(0.93,1.6),V(0.86,0.95),V(0.6,0.55),V(0.001,0.44)];
    const body = new T.LatheGeometry(outer.concat(inner), 200); body.computeVertexNormals();
    const glass = this._glass(T, { opacity:0.07 });
    const group = new T.Group(), pf = new T.Group(); group.add(pf); scene.add(group);
    pf.add(new T.Mesh(body, glass));
    class Helix extends T.Curve { getPoint(t, o = new T.Vector3()){ const a = t*Math.PI*2*2.1 + 0.4, y = 8.28 + t*1.28; return o.set(Math.cos(a)*1.235, y, Math.sin(a)*1.235); } }
    const th = new T.Mesh(new T.TubeGeometry(new Helix(), 360, 0.075, 12, false), this._glass(T, { opacity:0.1, rimAmt:0.95 }));
    th.renderOrder = 2; pf.add(th);
    pf.position.y = -5;
    const key = new T.DirectionalLight(0xffffff, 1.2); key.position.set(-5, 8, 8); scene.add(key);
    const back = new T.DirectionalLight(0xffffff, 1.6); back.position.set(6, 3, -8); scene.add(back);
    group.rotation.z = parseFloat(this.getAttribute('tilt') || '0');
    const size = () => { const w = this.clientWidth||1, h = this.clientHeight||1; r.setSize(w,h,false); cam.aspect = w/h;
      const t = Math.tan(cam.fov*Math.PI/360), d = Math.max(11.6/(2*t), 3.4/(2*t*cam.aspect)); cam.position.set(0, 0.6, d); cam.lookAt(0,0,0); cam.updateProjectionMatrix(); };
    this._ro = new T.Object3D() && new ResizeObserver(size); this._ro.observe(this); size();
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const st = { ry:0, rx:0, vy: reduce ? 0 : 0.35, auto: reduce ? 0 : 0.35, drag:false, lx:0, ly:0, tx:0, idle:0 };
    const cv = r.domElement;
    const down = (e) => { st.drag = true; st.lx = e.clientX; st.ly = e.clientY; cv.style.cursor = 'grabbing'; cv.setPointerCapture && cv.setPointerCapture(e.pointerId); };
    const move = (e) => { if (!st.drag) return; const dx = e.clientX - st.lx, dy = e.clientY - st.ly; st.lx = e.clientX; st.ly = e.clientY;
      st.ry += dx * 0.012; st.vy = dx * 0.012 * 60; st.tx = Math.max(-0.45, Math.min(0.45, st.tx + dy * 0.006)); };
    const up = () => { if (!st.drag) return; st.drag = false; cv.style.cursor = 'grab'; st.vy = Math.max(-8, Math.min(8, st.vy)); };
    cv.addEventListener('pointerdown', down); addEventListener('pointermove', move); addEventListener('pointerup', up); addEventListener('pointercancel', up);
    this._off = () => { cv.removeEventListener('pointerdown', down); removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); };
    let last = performance.now(); const t0 = last;
    const loop = () => {
      if (this._dead) return;
      const now = performance.now(), dt = Math.min(0.05, (now-last)/1000); last = now;
      if (!st.drag){ st.vy += (st.auto - st.vy) * Math.min(1, dt*1.4); st.ry += st.vy * dt; st.tx *= 0.94; }
      st.rx += (st.tx - st.rx) * 0.12;
      pf.rotation.y = st.ry; group.rotation.x = st.rx;
      group.position.y = reduce ? 0 : Math.sin((now-t0)/1000*0.9)*0.12;
      r.render(scene, cam); this._raf = requestAnimationFrame(loop);
    };
    loop();
  }
}
customElements.define('preform-3d', Preform3D);
})();
