// Utility: click QQ numbers to copy
(function(){
var qqNumbers=[
"1070422968","1104609299"
];
// Find all text nodes containing QQ numbers and make them clickable
function walk(node){
if(node.nodeType===3){
var t=node.textContent;
for(var i=0;i<qqNumbers.length;i++){
var qq=qqNumbers[i];
var idx=t.indexOf(qq);
if(idx>=0){
var span=document.createElement("span");
span.textContent=qq;
span.style.cssText="cursor:pointer;border-bottom:1px dashed var(--cyan);color:var(--cyan);transition:color .2s";
span.title="点击复制QQ群号";
span.addEventListener("click",function(e){
var num=this.textContent;
navigator.clipboard.writeText(num).then(function(){
var orig=this.textContent;
this.textContent="已复制!";
this.style.color="#4ac890";
var self=this;
setTimeout(function(){self.textContent=orig;self.style.color="";},1500);
}.bind(this)).catch(function(){});
});
span.addEventListener("mouseenter",function(){this.style.color="#fff"});
span.addEventListener("mouseleave",function(){this.style.color=""});
var before=t.substring(0,idx);
var after=t.substring(idx+qq.length);
var frag=document.createDocumentFragment();
if(before)frag.appendChild(document.createTextNode(before));
frag.appendChild(span);
if(after)frag.appendChild(document.createTextNode(after));
node.parentNode.replaceChild(frag,node);
return;
}
}
}
for(var i=0;i<node.childNodes.length;i++){walk(node.childNodes[i]);}
}
walk(document.body);
})();
