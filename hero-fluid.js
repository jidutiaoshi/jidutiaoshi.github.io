/* JiduOS 官网 · 深海流体 Hero 背景
 * 层(由下到上): 流体(MIT Navier-Stokes) → 焦散(screen) → 顶部体积光 → 旋转环/核芯 → 鼠标光斑 → 文案
 * 依赖: /fluid-jiduos.js(副作用脚本,暴露 window.__jiduFluid,按需注入加载)
 * 降级: 无 WebGL 跳过流体/焦散,保留 CSS 渐变兜底;hero 滚出视口即暂停(省 GPU)
 */
(function () {
  var hero = document.querySelector('.hero') || document.querySelector('.page-hero');
  if (!hero) return;
  var isPageHero = hero.classList.contains('page-hero');

  function el(tag, cls, id) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (id) e.id = id;
    return e;
  }

  // 1. 注入背景层(流体/焦散/光晕/光斑 = 全页 fixed;旋转环/核芯 = 仅首页 hero 内)
  var fluid = el('canvas', 'jd-fluid', 'fluid-canvas');
  var caustic = el('canvas', 'jd-caustic');
  var glow = el('div', 'jd-glow');
  var spot = el('div', 'jd-spot');
  var ringwrap = el('div', 'jd-ringwrap');
  ringwrap.innerHTML = '<div class="jd-ring"><span class="jd-dot"></span></div>';
  var core = el('div', 'jd-core');
  document.body.appendChild(fluid);
  document.body.appendChild(caustic);
  document.body.appendChild(glow);
  document.body.appendChild(spot);
  if (!isPageHero) {
    hero.appendChild(ringwrap);
    hero.appendChild(core);
  }

  // 1.5 让两个 canvas 精确铺满视口(px)。canvas 是替换元素,百分比高度会退化,故用 JS 量取视口宽高。
  function fitCanvas() {
    var w = Math.max(1, window.innerWidth);
    var h = Math.max(1, window.innerHeight);
    fluid.style.width = w + 'px';
    fluid.style.height = h + 'px';
    caustic.style.width = w + 'px';
    caustic.style.height = h + 'px';
  }
  fitCanvas();
  window.addEventListener('resize', fitCanvas);

  // 2. 鼠标光斑跟随
  window.addEventListener('mousemove', function (e) {
    spot.style.setProperty('--mx', e.clientX + 'px');
    spot.style.setProperty('--my', e.clientY + 'px');
  }, { passive: true });

  // 3. 焦散(移动端跳过,省一个 WebGL 上下文)
  if (!/Mobi|Android/i.test(navigator.userAgent)) initCaustic(caustic);

  // 4. 流体:WebGL 可用才加载
  var test = document.createElement('canvas');
  var webglOK = !!(window.WebGLRenderingContext && (test.getContext('webgl2') || test.getContext('webgl')));
  if (!webglOK) return;

  var s = document.createElement('script');
  s.src = '/fluid-jiduos.js';
  s.onload = function () {
    var F = window.__jiduFluid;
    if (!F || !F.splat) return;

    // 全页背景:只在页面隐藏时暂停(省 GPU)
    function syncIdle() {
      window.__jiduFluidIdle = document.hidden;
    }
    document.addEventListener('visibilitychange', syncIdle);
    syncIdle();

    // 悬停轻扰:鼠标划过带起水流(全页跟随,克制强度保护文字)
    var lx = 0, ly = 0, lt = 0;
    window.addEventListener('mousemove', function (e) {
      var now = performance.now();
      if (now - lt < 120) return;
      lt = now;
      var nx = e.clientX / window.innerWidth;
      var ny = e.clientY / window.innerHeight;
      var dx = (nx - lx) * 160;
      var dy = (ny - ly) * 160;
      lx = nx; ly = ny;
      if (Math.abs(dx) + Math.abs(dy) < 10) return;
      var c = F.generateColor();
      c.g *= 0.5; c.b *= 0.5;
      F.splat(nx, 1 - ny, dx, -dy, c);
    }, { passive: true });
  };
  s.onerror = function () { /* 流体加载失败,保留 CSS 兜底 */ };
  document.body.appendChild(s);
})();

function initCaustic(canvas) {
  var gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) return;
  var VS = 'attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }';
  var FS = [
    'precision highp float; uniform vec2 r; uniform float t;',
    'void main(){ vec2 uv=gl_FragCoord.xy/r; uv*=vec2(r.x/r.y,1.0); float s=0.0;',
    'for(int i=0;i<7;i++){ float fi=float(i); vec2 p=uv*(2.2+fi*0.45);',
    'p.x+=sin(p.y*1.6+t*0.65+fi*2.1)*0.35; p.y+=cos(p.x*1.5-t*0.55+fi*1.7)*0.35;',
    'float w=sin(p.x*3.14159+sin(p.y*2.2-t*0.4))*sin(p.y*3.14159+cos(p.x*2.0+t*0.35));',
    'w=abs(w); w=smoothstep(0.72,1.0,w); s+=w*(0.12+fi*0.012); }',
    'vec3 deep=vec3(0.008,0.04,0.08); vec3 lite=vec3(0.05,0.78,1.0);',
    'gl_FragColor=vec4(mix(deep,lite,clamp(s,0.0,1.0)),1.0); }'
  ].join('\n');
  function mk(t, src) { var o = gl.createShader(t); gl.shaderSource(o, src); gl.compileShader(o); return o; }
  var prog = gl.createProgram();
  gl.attachShader(prog, mk(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  gl.useProgram(prog);
  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  var uR = gl.getUniformLocation(prog, 'r'), uT = gl.getUniformLocation(prog, 't');
  function resize() {
    var d = Math.min(window.devicePixelRatio || 1, 1.5);
    var w = Math.max(1, Math.floor(canvas.clientWidth * d));
    var h = Math.max(1, Math.floor(canvas.clientHeight * d));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  }
  var t0 = performance.now();
  (function loop() {
    requestAnimationFrame(loop);
    if (window.__jiduFluidIdle) return;
    resize();
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uR, canvas.width, canvas.height);
    gl.uniform1f(uT, (performance.now() - t0) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  })();
}
