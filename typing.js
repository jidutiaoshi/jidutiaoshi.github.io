// Static headline — fade-in only (文案单一来源在 index.html, 这里只做淡入, 避免双源漂移)
(function(){
var el=document.querySelector(".hero-sub");
if(!el)return;
el.style.opacity="0";
el.style.transition="opacity 1s ease-in";
setTimeout(function(){el.style.opacity="1"},400);
})();
