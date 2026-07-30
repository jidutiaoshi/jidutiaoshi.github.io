// Constellation Starfield — 3D particle field + network topology lines
// Particles drift in perspective space, nearby ones connect with faint lines
// Lines brighten near cursor, giving a living network feel
(function(){
  var old = document.getElementById("starfield");
  if (old) old.style.display = "none";

  var c = document.createElement("canvas");
  c.id = "gl-starfield";
  c.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:0;transition:opacity 2s ease-in";
  document.body.prepend(c);

  function isLight() {
    return document.documentElement.hasAttribute("data-theme") &&
      document.documentElement.getAttribute("data-theme") === "light";
  }
  setTimeout(function() { c.style.opacity = isLight() ? ".55" : ".38"; }, 400);

  var ctx = c.getContext("2d");
  var W, H, N = 220;
  var particles = [];
  var camAngleY = 0, camAngleX = 0.15;
  var targetAngleY = 0, targetAngleX = 0.15;
  var fov;
  var mouseX = -999, mouseY = -999;
  var connDist = 140; // max distance in px to draw a connection line

  function resize() {
    W = c.width = window.innerWidth;
    H = c.height = window.innerHeight;
    fov = Math.min(W, H) * 0.8;
    connDist = Math.min(W, H) * 0.18;
  }

  function create() {
    particles = [];
    for (var i = 0; i < N; i++) {
      var z = 50 + Math.random() * 900;
      particles.push({
        x: (Math.random() - 0.5) * 1800,
        y: (Math.random() - 0.5) * 1200,
        z: z,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.1,
        vz: 0.2 + Math.random() * 0.5,
        size: 0.4 + Math.random() * 1.8,
        hue: 190 + Math.random() * 30
      });
    }
  }

  function project(px, py, pz) {
    var cosY = Math.cos(camAngleY), sinY = Math.sin(camAngleY);
    var cosX = Math.cos(camAngleX), sinX = Math.sin(camAngleX);
    var rx = px * cosY - pz * sinY;
    var rz = px * sinY + pz * cosY;
    var ry = py * cosX - rz * sinX;
    rz = py * sinX + rz * cosX;
    if (rz < 10) rz = 10;
    var s = fov / rz;
    return { x: rx * s + W / 2, y: ry * s + H / 2, s: s, z: rz };
  }

  function draw(now) {
    ctx.clearRect(0, 0, W, H);

    // Smooth camera follow
    camAngleY += (targetAngleY - camAngleY) * 0.015;
    camAngleX += (targetAngleX - camAngleX) * 0.015;

    var glow = isLight() ? 0.48 : 0.42;
    var projected = new Array(N);

    // Update + project all particles
    for (var i = 0; i < N; i++) {
      var pi = particles[i];
      pi.x += pi.vx; pi.y += pi.vy; pi.z -= pi.vz;
      if (pi.z < 20)  { pi.z = 950; pi.x = (Math.random() - 0.5) * 1800; pi.y = (Math.random() - 0.5) * 1200; }
      if (pi.z > 1000) { pi.z = 20;  pi.x = (Math.random() - 0.5) * 1800; pi.y = (Math.random() - 0.5) * 1200; }
      if (Math.abs(pi.x) > 1200) pi.x *= -0.95;
      if (Math.abs(pi.y) > 900)  pi.y *= -0.95;
      projected[i] = { pr: project(pi.x, pi.y, pi.z), hue: pi.hue, size: pi.size };
    }

    // ── Constellation lines (draw behind particles) ──
    ctx.lineWidth = 0.35;
    for (var i = 0; i < N; i++) {
      var pA = projected[i];
      var ax = pA.pr.x, ay = pA.pr.y, az = pA.pr.z;
      var hA = pA.hue;

      for (var j = i + 1; j < N; j++) {
        var pB = projected[j];
        var dx = pB.pr.x - ax;
        var dy = pB.pr.y - ay;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connDist) {
          // Midpoint of the line segment
          var mx = (ax + pB.pr.x) * 0.5;
          var my = (ay + pB.pr.y) * 0.5;

          // Mouse proximity factor (1.0 baseline, up to 3.5× near cursor)
          var md = Math.sqrt((mx - mouseX) * (mx - mouseX) + (my - mouseY) * (my - mouseY));
          var mouseBoost = 1 + 2.5 * Math.max(0, 1 - md / 300);

          // Distance factor — closer particles = brighter line
          var distFactor = 1 - dist / connDist;

          // Depth factor — deeper particles = fainter line
          var zAvg = (az + pB.pr.z) * 0.5;
          var depthFactor = 0.25 + zAvg / 1000 * 0.75;

          // Composite alpha
          var alpha = glow * 0.09 * distFactor * depthFactor * mouseBoost;

          if (alpha > 0.015) {
            var hue = (hA + pB.hue) * 0.5;
            ctx.strokeStyle = "hsla(" + hue + ", 20%, 70%, " + alpha.toFixed(4) + ")";
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(pB.pr.x, pB.pr.y);
            ctx.stroke();
          }
        }
      }
    }

    // ── Particles (draw on top of lines) ──
    for (var i = 0; i < N; i++) {
      var pi = particles[i];
      var pr = projected[i].pr;
      var alpha = glow * (0.2 + pr.z / 1000 * 0.4);
      var r = projected[i].size * pr.s;

      // Glow
      var grad = ctx.createRadialGradient(pr.x, pr.y, 0, pr.x, pr.y, r * 2.5);
      grad.addColorStop(0, "hsla(" + projected[i].hue + ", 35%, 75%, " + alpha + ")");
      grad.addColorStop(0.35, "hsla(" + projected[i].hue + ", 25%, 55%, " + (alpha * 0.5) + ")");
      grad.addColorStop(1, "hsla(210, 20%, 30%, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(pr.x, pr.y, r * 2.5, 0, Math.PI * 2); ctx.fill();

      // Core
      ctx.fillStyle = "hsla(" + (projected[i].hue - 10) + ", 15%, 90%, " + (alpha * 0.7) + ")";
      ctx.beginPath(); ctx.arc(pr.x, pr.y, r * 0.35, 0, Math.PI * 2); ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  // Track mouse for constellation brightness
  document.addEventListener("mousemove", function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    targetAngleY = (e.clientX / W - 0.5) * 0.5;
    targetAngleX = 0.15 + (e.clientY / H - 0.5) * 0.2;
  });

  window.addEventListener("resize", function() { resize(); create(); });

  resize();
  create();
  requestAnimationFrame(draw);
})();
