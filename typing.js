// Hero typing animation - cycles through phrases
(function(){
var el=document.querySelector(".hero-sub");
if(!el)return;
var phrases=[
"96项电竞级优化 · 远程一对一精调 · 把浪费的性能找回来",
"不改硬件 · 系统级深度优化 · 7天售后保障",
"掉帧、卡顿、延迟——今天到此为止",
"抖音认证主播 · 600+ 帧实测 · 真实案例说话"
];
var i=0,j=0,deleting=false,waiting=false;
var speed=60,deleteSpeed=30,pauseEnd=2000,pauseStart=800;
function type(){
var current=phrases[i];
if(!deleting && !waiting){
if(j<current.length){el.textContent=current.substring(0,j+1)+"|";j++;speed=40+Math.random()*40;}
else{waiting=true;setTimeout(function(){waiting=false;deleting=true;tick();},pauseEnd);return;}
}
if(deleting){
if(j>0){el.textContent=current.substring(0,j-1)+"|";j--;}
else{deleting=false;i=(i+1)%phrases.length;setTimeout(tick,pauseStart);return;}
}
setTimeout(tick,deleting?deleteSpeed:speed);
}
function tick(){type();}
el.textContent="|";
setTimeout(tick,300);
})();
