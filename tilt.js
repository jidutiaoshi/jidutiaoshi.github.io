// 3D Card Tilt — subtle perspective on hover
(function(){
var cards=document.querySelectorAll(".card,.case-card,.platform-card,.feat-card,.prebuy-card,.tool-card,.trust-item");
if(!cards.length)return;

var isTouch="ontouchstart"in window;
var evtMove=isTouch?"touchmove":"mousemove";
var evtEnter=isTouch?"touchstart":"mouseenter";
var evtLeave=isTouch?"touchend":"mouseleave";

function handleEnter(e){
  this.style.transition="transform .15s ease,box-shadow .4s ease,border-color .4s ease";
  this.style.transformStyle="preserve-3d";
  this.style.perspective="800px";
}

function handleMove(e){
  var rect=this.getBoundingClientRect();
  var x=isTouch?e.touches[0].clientX:e.clientX;
  var y=isTouch?e.touches[0].clientY:e.clientY;
  var cx=(x-rect.left)/rect.width-.5;
  var cy=(y-rect.top)/rect.height-.5;
  var tilt=6; // max degrees
  this.style.transform="rotateY("+(cx*tilt)+"deg) rotateX("+(-cy*tilt)+"deg) translateZ(2px)";
}

function handleLeave(e){
  this.style.transition="transform .6s cubic-bezier(.16,1,.3,1),box-shadow .4s ease,border-color .4s ease";
  this.style.transform="rotateY(0) rotateX(0) translateZ(0)";
}

// Only apply on non-touch devices (touch already has native tilt feel)
if(!isTouch){
  cards.forEach(function(card){
    card.addEventListener("mouseenter",handleEnter);
    card.addEventListener("mousemove",handleMove);
    card.addEventListener("mouseleave",handleLeave);
  });
}
})();
