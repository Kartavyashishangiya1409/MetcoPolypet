(function(){
if (customElements.get('preform-glb')) return;
class PreformGLB extends HTMLElement {
  connectedCallback(){
    if (this._init) return; this._init = true; this._dead = false;
    if (!this.style.display) this.style.display = 'block';
    this.style.opacity = '0'; this.style.transition = 'opacity 1s cubic-bezier(.16,1,.3,1)';
    Promise.all([
      import('https://esm.sh/three@0.160.0'),
      import('https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js')
    ]).then(([T, G]) => this._build(T, G.GLTFLoader)).catch(e => console.warn('preform-glb', e));
  }
  disconnectedCallback(){ this._dead = true; this._init = false; cancelAnimationFrame(this._raf); this._ro && this._ro.disconnect(); this._off && this._off(); this._r && this._r.dispose(); }
  _studio(T){
    // dark studio with softboxes: gives glass dark edges + crisp highlights
    const s = new T.Scene();
    const room = new T.Mesh(new T.BoxGeometry(30, 30, 30), new T.MeshBasicMaterial({ color:0x15181a, side:T.BackSide })); s.add(room);
    const panel = (w, h, x, y, z, ry, inten) => { const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color:new T.Color(inten, inten, inten), side:T.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, y*0.3, 0); s.add(m); };
    panel(1.2, 16, -7, 1, 4, 0, 14);    // left strip
    panel(0.8, 16,  7.5, 1, 2, 0, 10);  // right strip
    panel(10, 3, 0, 12, 0, 0, 3);      // top
    panel(8, 10, 0, 0, -13, 0, 1.6);   // back fill
    panel(14, 12, 0, 0, 14, 0, 0.35);   // front fill (camera side)
    return s;
  }
  _build(T, GLTFLoader){
    if (this._dead) return;
    const bg = this.getAttribute('bg') || '#F4F4F1';
    const r = new T.WebGLRenderer({ antialias:true, alpha:false, preserveDrawingBuffer:true });
    r.setPixelRatio(Math.min(devicePixelRatio, 2));
    r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = 0.9; r.outputColorSpace = T.SRGBColorSpace;
    r.setClearColor(bg, 1);
    r.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;cursor:grab;touch-action:pan-y';
    this.appendChild(r.domElement); this._r = r;
    const scene = new T.Scene(); scene.background = new T.Color(bg);
    const pm = new T.PMREMGenerator(r); scene.environment = pm.fromScene(this._studio(T), 0.02).texture;
    // soft contact shadow
    const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
    const gr = g.createRadialGradient(128,128,0,128,128,128); gr.addColorStop(0,'rgba(0,0,0,.28)'); gr.addColorStop(.6,'rgba(0,0,0,.08)'); gr.addColorStop(1,'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(0,0,256,256);
    const shadow = new T.Mesh(new T.PlaneGeometry(5.2, 1.6), new T.MeshBasicMaterial({ map:new T.CanvasTexture(c), transparent:true, depthWrite:false }));
    shadow.rotation.x = -Math.PI/2; shadow.position.y = -5.6; scene.add(shadow);
    // faint backdrop strips so the glass has something to refract
    const stripMat = new T.MeshBasicMaterial({ color:new T.Color(bg).offsetHSL(0, 0, -0.06) });
    
    const cam = new T.PerspectiveCamera(22, 1, 0.1, 200);
    const holder = new T.Group(), spin = new T.Group(); holder.add(spin); scene.add(holder);
    const glass = new T.MeshPhysicalMaterial({ color:0xf2f8f8, metalness:0, roughness:0.03, transparent:true, opacity:0.1,
      specularIntensity:1, clearcoat:1, clearcoatRoughness:0.01, envMapIntensity:1.6, side:T.DoubleSide, depthWrite:false });
    glass.onBeforeCompile = (sh) => {
      sh.fragmentShader = sh.fragmentShader.replace('#include <dithering_fragment>',
        '#include <dithering_fragment>\n float frs = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 1.35);\n float lum = dot(gl_FragColor.rgb, vec3(0.333));\n float hiL = smoothstep(0.86, 1.0, lum) * (1.0 - frs*0.55);\n gl_FragColor.rgb = mix(mix(gl_FragColor.rgb * 0.92, vec3(0.16,0.19,0.21), frs*0.92), vec3(1.0), hiL);\n gl_FragColor.a = clamp(0.03 + frs*0.95 + hiL, 0.0, 0.97);');
    };
    glass.customProgramCacheKey = () => 'pfglb';
    new GLTFLoader().load(this.getAttribute('src'), (gltf) => {
      if (this._dead) return;
      const m = gltf.scene;
      m.traverse(o => { if (o.isMesh){ if (!o.geometry.attributes.normal) o.geometry.computeVertexNormals(); o.material = glass; o.renderOrder = o.name.indexOf('Thread') >= 0 ? 2 : 1; } });
      const box = new T.Box3().setFromObject(m), sz = box.getSize(new T.Vector3()), ctr = box.getCenter(new T.Vector3());
      const k = 10.6 / sz.y; m.scale.setScalar(k); m.position.set(-ctr.x*k, -ctr.y*k, -ctr.z*k);
      spin.add(m);
      this.style.opacity = '1';
      const poster = this.parentElement && this.parentElement.querySelector('[data-poster]');
      if (poster) { poster.style.transition = 'opacity .8s'; poster.style.opacity = '0'; }
    }, undefined, (e) => console.warn('preform-glb load', e));
    const fit = () => { const w = this.clientWidth||1, h = this.clientHeight||1; r.setSize(w, h, false); cam.aspect = w/h;
      const t = Math.tan(cam.fov*Math.PI/360), d = Math.max(12.4/(2*t), 4.2/(2*t*cam.aspect)); cam.position.set(0, 1.2, d); cam.lookAt(0, -0.2, 0); cam.updateProjectionMatrix(); };
    this._ro = new ResizeObserver(fit); this._ro.observe(this); fit();
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const st = { ry:0.4, vy: reduce ? 0 : 0.4, auto: reduce ? 0 : 0.4, drag:false, lx:0, ly:0, tx:0, rx:0 };
    const cv = r.domElement;
    const down = (e) => { st.drag = true; st.lx = e.clientX; st.ly = e.clientY; cv.style.cursor = 'grabbing'; cv.setPointerCapture && cv.setPointerCapture(e.pointerId); };
    const move = (e) => { if (!st.drag) return; const dx = e.clientX - st.lx, dy = e.clientY - st.ly; st.lx = e.clientX; st.ly = e.clientY;
      st.ry += dx * 0.011; st.vy = dx * 0.011 * 60; st.tx = Math.max(-0.4, Math.min(0.4, st.tx + dy * 0.005)); };
    const up = () => { if (!st.drag) return; st.drag = false; cv.style.cursor = 'grab'; st.vy = Math.max(-9, Math.min(9, st.vy)); };
    cv.addEventListener('pointerdown', down); addEventListener('pointermove', move); addEventListener('pointerup', up); addEventListener('pointercancel', up);
    this._off = () => { cv.removeEventListener('pointerdown', down); removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); };
    let last = performance.now(); const t0 = last;
    const loop = () => {
      if (this._dead) return;
      const now = performance.now(), dt = Math.min(0.05, (now - last)/1000); last = now;
      if (!st.drag){ st.vy += (st.auto - st.vy) * Math.min(1, dt*1.3); st.ry += st.vy * dt; st.tx *= 0.94; }
      st.rx += (st.tx - st.rx) * 0.12;
      spin.rotation.y = st.ry; holder.rotation.x = st.rx;
      const f = reduce ? 0 : Math.sin((now - t0)/1000*0.9);
      holder.position.y = f * 0.14; shadow.scale.setScalar(1 - f*0.06);
      r.render(scene, cam); this._raf = requestAnimationFrame(loop);
    };
    loop();
  }
}
customElements.define('preform-glb', PreformGLB);
})();
