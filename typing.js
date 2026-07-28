// Hero typing animation with blinking cursor
(function(){
var el=document.querySelector(".hero-sub");
if(!el)return;
var phrases=[
"111+项电竞级优化 · 14色游戏滤镜 · 远程一对一精调",
"不改硬件 · 系统级深度优化 · 7天售后保障",
"掉帧、卡顿、延迟——今天到此为止",
"抖音认证主播 · 600+ 帧实测 · 真实案例说话"
];
var i=0,j=0,deleting=false,waiting=false;
var speed=60,deleteSpeed=30,pauseEnd=2200,pauseStart=600;
// Blinking cursor
var cursorVisible=true;
setInterval(function(){cursorVisible=!cursorVisible},530);
function type(){
var current=phrases[i];
var cursor=cursorVisible?"|":" ";
if(!deleting && !waiting){
if(j<current.length){el.textContent=current.substring(0,j+1)+cursor;j++;speed=40+Math.random()*40;}
else{waiting=true;setTimeout(function(){waiting=false;deleting=true;tick();},pauseEnd);return;}
}
if(deleting){
if(j>0){el.textContent=current.substring(0,j-1)+cursor;j--;}
else{deleting=false;i=(i+1)%phrases.length;setTimeout(tick,pauseStart);return;}
}
setTimeout(tick,deleting?deleteSpeed:speed);
}
function tick(){type();}
el.textContent="|";
setTimeout(tick,300);
})();
