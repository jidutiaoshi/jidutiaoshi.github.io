// Enhanced Canvas 2D Starfield — depth layers, shooting stars, multi-color particles
(function(){
var old=document.getElementById("starfield");
if(old)old.style.display="none";

var c=document.createElement("canvas");
c.id="gl-starfield";
c.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:0;transition:opacity 1.5s ease-in";
document.body.prepend(c);
setTimeout(function(){c.style.opacity=".6"},200);

var ctx=c.getContext("2d");
var W,H,N=350,mx=0,my=0,tmx=0,tmy=0;
var p=[]; // particles
var shootingStars=[];
var baseHue=200; // cyan base

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
// Mix cyan and purple particles based on depth
var hue=baseHue+Math.random()*30-Math.random()*40; // 160-230 range (cyan to purple)
var sat=40+Math.random()*30;
var light=60+Math.random()*20;
p.push({
x:Math.random()*W,y:Math.random()*H,
vx:(Math.random()-.5)*.12,vy:(Math.random()-.5)*.10-.03,
depth:depth,size:.3+depth*2.0,
alpha:.15+depth*.6,
hue:hue,sat:sat,light:light,
twinkle:Math.random()*Math.PI*2
});
}
}

function spawnShootingStar(){
var fromLeft=Math.random()>.5;
return {
x:fromLeft?Math.random()*W*0.3:W-Math.random()*W*0.3,
y:Math.random()*H*0.5,
vx:(Math.random()*4+2)*(fromLeft?1:-1),
vy:Math.random()*2+1,
life:1,
maxLife:60+Math.random()*40,
len:60+Math.random()*100
};
}

function draw(now){
ctx.clearRect(0,0,W,H);
mx+=(tmx-mx)*.04;my+=(tmy-my)*.04;

// Draw particles
for(var i=0;i<N;i++){
var pi=p[i];
pi.x+=pi.vx;pi.y+=pi.vy;
if(pi.x<0)pi.x=W;if(pi.x>W)pi.x=0;
if(pi.y<0)pi.y=H;if(pi.y>H)pi.y=0;

// Mouse parallax (near particles move more)
var px=pi.x+mx*pi.depth*20;
var py=pi.y+my*pi.depth*20;

// Twinkle
var twinkle=.75+.25*Math.sin(now*.001+pi.twinkle);

// Glow radius varies with depth
var glowR=pi.size*(2.5+pi.depth*2);
var alpha=pi.alpha*twinkle;

// Color from HSB
var hue=pi.hue;
var sat=pi.sat;
var light=pi.light;

// Outer glow
var grad=ctx.createRadialGradient(px,py,0,px,py,glowR);
grad.addColorStop(0,"hsla("+hue+","+sat+"%,"+(light+20)+"%,"+alpha+")");
grad.addColorStop(.25,"hsla("+hue+","+sat+"%,"+light+"%,"+alpha*.6+")");
grad.addColorStop(.6,"hsla("+hue+","+sat+"%,"+(light-20)+"%,"+alpha*.15+")");
grad.addColorStop(1,"hsla("+hue+",30%,10%,0)");
ctx.fillStyle=grad;
ctx.beginPath();ctx.arc(px,py,glowR,0,Math.PI*2);ctx.fill();

// Bright core
ctx.fillStyle="hsla("+(hue+10)+",30%,"+(light+30)+"%,"+(alpha*.9)+")";
ctx.beginPath();ctx.arc(px,py,pi.size*.5,0,Math.PI*2);ctx.fill();
}

// Constellation lines (only between nearby particles)
ctx.lineWidth=.25;
for(var i=0;i<N;i++){
var pi=p[i];
var ppx=pi.x+mx*pi.depth*20;
var ppy=pi.y+my*pi.depth*20;
for(var j=i+1;j<N;j++){
var pj=p[j];
var dx=ppx-(pj.x+mx*pj.depth*20);
var dy=ppy-(pj.y+my*pj.depth*20);
var dist=dx*dx+dy*dy;
var maxDist=70+Math.max(pi.depth,pj.depth)*35;
if(dist<maxDist*maxDist){
var avgDepth=(pi.depth+pj.depth)/2;
var lineAlpha=.05*(1-dist/(maxDist*maxDist))*avgDepth;
ctx.strokeStyle="rgba(0,200,255,"+lineAlpha+")";
ctx.beginPath();ctx.moveTo(ppx,ppy);ctx.lineTo(pj.x+mx*pj.depth*20,pj.y+my*pj.depth*20);ctx.stroke();
}
}
}

// Shooting stars
if(shootingStars.length<2 && Math.random()<.005){
shootingStars.push(spawnShootingStar());
}

for(var i=shootingStars.length-1;i>=0;i--){
var ss=shootingStars[i];
ss.x+=ss.vx;ss.y+=ss.vy;
ss.life-=1/ss.maxLife;

if(ss.life<=0||ss.x<-200||ss.x>W+200||ss.y>H+200){
shootingStars.splice(i,1);
continue;
}

var tailX=ss.x-ss.vx*ss.len/6;
var tailY=ss.y-ss.vy*ss.len/6;
var grad2=ctx.createLinearGradient(tailX,tailY,ss.x,ss.y);
grad2.addColorStop(0,"rgba(0,200,255,0)");
grad2.addColorStop(.3,"rgba(0,200,255,"+(.15*ss.life)+")");
grad2.addColorStop(.7,"rgba(180,230,255,"+(.6*ss.life)+")");
grad2.addColorStop(1,"rgba(255,255,255,"+(.9*ss.life)+")");
ctx.strokeStyle=grad2;
ctx.lineWidth=1.2*ss.life;
ctx.beginPath();ctx.moveTo(tailX,tailY);ctx.lineTo(ss.x,ss.y);ctx.stroke();

// Head glow
ctx.fillStyle="rgba(255,255,255,"+(.8*ss.life)+")";
ctx.beginPath();ctx.arc(ss.x,ss.y,1.5*ss.life,0,Math.PI*2);ctx.fill();
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
