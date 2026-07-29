// Static headline — no typing animation (reads as AI-template)
(function(){
var el=document.querySelector(".hero-sub");
if(!el)return;
el.textContent="111+项电竞级优化 · 14色游戏滤镜 · 远程一对一精调";
el.style.opacity="0";
el.style.transition="opacity 1s ease-in";
setTimeout(function(){el.style.opacity="1"},400);
})();
