// Elegant Starfield — subtle, clean, professional
(function(){
var old=document.getElementById("starfield");
if(old)old.style.display="none";

var c=document.createElement("canvas");
c.id="gl-starfield";
c.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:0;transition:opacity 2s ease-in";
document.body.prepend(c);
setTimeout(function(){c.style.opacity=".45"},300);

var ctx=c.getContext("2d");
var W,H,N=200,mx=0,my=0,tmx=0,tmy=0;
var p=[];

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
vx:(Math.random()-.5)*.06,vy:(Math.random()-.5)*.05-.02,
depth:depth,size:.2+depth*1.2,
alpha:.08+depth*.35,
twinkle:Math.random()*Math.PI*2
});
}
}

function draw(now){
ctx.clearRect(0,0,W,H);
mx+=(tmx-mx)*.03;my+=(tmy-my)*.03;

for(var i=0;i<N;i++){
var pi=p[i];
pi.x+=pi.vx;pi.y+=pi.vy;
if(pi.x<0)pi.x=W;if(pi.x>W)pi.x=0;
if(pi.y<0)pi.y=H;if(pi.y>H)pi.y=0;

var px=pi.x+mx*pi.depth*10;
var py=pi.y+my*pi.depth*10;
var twinkle=.7+.3*Math.sin(now*.0008+pi.twinkle);
var alpha=pi.alpha*twinkle;

// Single clean glow
var grad=ctx.createRadialGradient(px,py,0,px,py,pi.size*2.5);
grad.addColorStop(0,"rgba(180,220,255,"+alpha+")");
grad.addColorStop(.4,"rgba(140,200,240,"+alpha*.4+")");
grad.addColorStop(1,"rgba(100,160,220,0)");
ctx.fillStyle=grad;
ctx.beginPath();ctx.arc(px,py,pi.size*2.5,0,Math.PI*2);ctx.fill();

// Tiny core
ctx.fillStyle="rgba(220,240,255,"+(alpha*.7)+")";
ctx.beginPath();ctx.arc(px,py,pi.size*.4,0,Math.PI*2);ctx.fill();
}

requestAnimationFrame(draw);
}

document.addEventListener("mousemove",function(e){
tmx=(e.clientX/W-.5)*1.2;
tmy=(e.clientY/H-.5)*1.2;
});
window.addEventListener("resize",function(){resize();create();});

resize();create();
requestAnimationFrame(draw);
})();
