// 3D Particle Field — Canvas 2D perspective projection
// Floating particles in 3D space with depth-based rendering
(function(){
var old=document.getElementById("starfield");
if(old)old.style.display="none";

var c=document.createElement("canvas");
c.id="gl-starfield";
c.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:0;transition:opacity 2s ease-in";
document.body.prepend(c);

function isLight(){
  return document.documentElement.hasAttribute("data-theme")&&
    document.documentElement.getAttribute("data-theme")==="light";
}
setTimeout(function(){c.style.opacity=isLight()?".6":".4"},400);

var ctx=c.getContext("2d");
var W,H,N=250;
var p=[];
var camAngleY=0,camAngleX=.15,targetAngleY=0,targetAngleX=.15;
var fov;

function resize(){
W=c.width=window.innerWidth;
H=c.height=window.innerHeight;
fov=Math.min(W,H)*.8;
}

function create(){
p=[];
for(var i=0;i<N;i++){
var z=50+Math.random()*900;
p.push({
x:(Math.random()-.5)*1800,
y:(Math.random()-.5)*1200,
z:z,
vx:(Math.random()-.5)*.15,
vy:(Math.random()-.5)*.1,
vz:.2+Math.random()*.5,
size:.4+Math.random()*1.8,
hue:5+Math.random()*15
});
}
}

function project(px,py,pz){
var cosY=Math.cos(camAngleY),sinY=Math.sin(camAngleY);
var cosX=Math.cos(camAngleX),sinX=Math.sin(camAngleX);
// Rotate Y
var rx=px*cosY-pz*sinY;
var rz=px*sinY+pz*cosY;
// Rotate X
var ry=py*cosX-rz*sinX;
rz=py*sinX+rz*cosX;
if(rz<10)rz=10;
var s=fov/rz;
return {x:rx*s+W/2,y:ry*s+H/2,s:s,z:rz};
}

function draw(now){
ctx.clearRect(0,0,W,H);

// Smooth camera follow
camAngleY+=(targetAngleY-camAngleY)*.015;
camAngleX+=(targetAngleX-camAngleX)*.015;

var glow=isLight()?.55:.5;

// Update particles
for(var i=0;i<N;i++){
var pi=p[i];
pi.x+=pi.vx;pi.y+=pi.vy;pi.z-=pi.vz;
// Wrap
if(pi.z<20){pi.z=950;pi.x=(Math.random()-.5)*1800;pi.y=(Math.random()-.5)*1200;}
if(pi.z>1000){pi.z=20;pi.x=(Math.random()-.5)*1800;pi.y=(Math.random()-.5)*1200;}
if(Math.abs(pi.x)>1200)pi.x*=-.95;
if(Math.abs(pi.y)>900)pi.y*=-.95;

var pr=project(pi.x,pi.y,pi.z);
var alpha=glow*(.2+pr.z/1000*.4);
var r=pi.size*pr.s;

// Glow
var grad=ctx.createRadialGradient(pr.x,pr.y,0,pr.x,pr.y,r*2.5);
grad.addColorStop(0,"hsla("+pi.hue+",35%,75%,"+alpha+")");
grad.addColorStop(.35,"hsla("+pi.hue+",25%,55%,"+alpha*.5+")");
grad.addColorStop(1,"hsla(210,20%,30%,0)");
ctx.fillStyle=grad;
ctx.beginPath();ctx.arc(pr.x,pr.y,r*2.5,0,Math.PI*2);ctx.fill();

// Core
ctx.fillStyle="hsla("+(pi.hue-10)+",15%,90%,"+(alpha*.7)+")";
ctx.beginPath();ctx.arc(pr.x,pr.y,r*.35,0,Math.PI*2);ctx.fill();
}

requestAnimationFrame(draw);
}

document.addEventListener("mousemove",function(e){
targetAngleY=(e.clientX/W-.5)*.5;
targetAngleX=.15+(e.clientY/H-.5)*.2;
});

window.addEventListener("resize",function(){resize();create();});

resize();create();
requestAnimationFrame(draw);
})();
