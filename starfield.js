// Enhanced Canvas 2D Starfield — 300 particles, constellation lines, depth layers
(function(){
var old=document.getElementById("starfield");
if(old)old.style.display="none";

var c=document.createElement("canvas");
c.id="gl-starfield";
c.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:.55";
document.body.prepend(c);

var ctx=c.getContext("2d");
var W,H,N=300,mx=0,my=0,tmx=0,tmy=0;
var p=[]; // particles: {x,y,vx,vy,depth,size,alpha}

function resize(){
var dpr=Math.min(window.devicePixelRatio||1,2);
W=c.width=window.innerWidth*dpr;
H=c.height=window.innerHeight*dpr;
ctx.scale(dpr,dpr);
W=window.innerWidth;H=window.innerHeight;
}

function create(){
p=[];
for(var i=0;i<N;i++){
var depth=Math.random();
p.push({
x:Math.random()*W,y:Math.random()*H,
vx:(Math.random()-.5)*.15,vy:(Math.random()-.5)*.12-.04,
depth:depth,size:.4+depth*1.6,
alpha:.2+depth*.5
});
}
}

function draw(now){
ctx.clearRect(0,0,W,H);
mx+=(tmx-mx)*.04;my+=(tmy-my)*.04;

// Update & draw particles
for(var i=0;i<N;i++){
var pi=p[i];
pi.x+=pi.vx;pi.y+=pi.vy;
if(pi.x<0)pi.x=W;if(pi.x>W)pi.x=0;
if(pi.y<0)pi.y=H;if(pi.y>H)pi.y=0;

// Mouse parallax
var px=pi.x+mx*pi.depth*15;
var py=pi.y+my*pi.depth*15;

// Glow
var grad=ctx.createRadialGradient(px,py,0,px,py,pi.size*3);
var alpha=pi.alpha*(.7+.3*Math.sin(now*.0005+i*.1));
var hue=200+pi.depth*20;
grad.addColorStop(0,"rgba(0,200,255,"+alpha+")");
grad.addColorStop(.3,"rgba(0,160,220,"+alpha*.5+")");
grad.addColorStop(1,"rgba(0,100,180,0)");
ctx.fillStyle=grad;
ctx.beginPath();ctx.arc(px,py,pi.size*3,0,Math.PI*2);ctx.fill();

// Bright core
ctx.fillStyle="rgba(180,230,255,"+(alpha*.8)+")";
ctx.beginPath();ctx.arc(px,py,pi.size*.6,0,Math.PI*2);ctx.fill();
}

// Constellation lines between nearby particles
ctx.lineWidth=.3;
for(var i=0;i<N;i++){
var pi=p[i];
var ppx=pi.x+mx*pi.depth*15;
var ppy=pi.y+my*pi.depth*15;
for(var j=i+1;j<N;j++){
var pj=p[j];
var dx=ppx-(pj.x+mx*pj.depth*15);
var dy=ppy-(pj.y+my*pj.depth*15);
var dist=dx*dx+dy*dy;
var maxDist=80+Math.max(pi.depth,pj.depth)*40;
if(dist<maxDist*maxDist){
var alpha=.06*(1-dist/(maxDist*maxDist));
ctx.strokeStyle="rgba(0,200,255,"+alpha+")";
ctx.beginPath();ctx.moveTo(ppx,ppy);ctx.lineTo(pj.x+mx*pj.depth*15,pj.y+my*pj.depth*15);ctx.stroke();
}
}
}

requestAnimationFrame(draw);
}

document.addEventListener("mousemove",function(e){
tmx=(e.clientX/W-.5)*2;
tmy=(e.clientY/H-.5)*2;
});
window.addEventListener("resize",function(){resize();create();});

resize();create();
requestAnimationFrame(draw);
})();
