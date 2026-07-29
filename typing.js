// Static headline — no typing animation (reads as AI-template)
(function(){
var el=document.querySelector(".hero-sub");
if(!el)return;
el.textContent="基础优化 ¥100 起 · 远程一对一精调 · 7天售后保障";
el.style.opacity="0";
el.style.transition="opacity 1s ease-in";
setTimeout(function(){el.style.opacity="1"},400);
})();
