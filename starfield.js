// WebGL Aurora Background - full-screen shader flowing color field
(function(){
var test=document.createElement("canvas");
var gl=test.getContext("webgl2",{alpha:true,premultipliedAlpha:true})||test.getContext("webgl",{alpha:true,premultipliedAlpha:true})||test.getContext("experimental-webgl",{alpha:true,premultipliedAlpha:true});
if(!gl){return;}

// Hide old canvas, create our own
var oldC=document.getElementById("starfield");
if(oldC)oldC.style.display="none";

var c=document.createElement("canvas");
c.id="gl-starfield";
c.style.cssText="position:fixed;inset:0;z-index:0;pointer-events:none";
document.body.prepend(c);

gl=c.getContext("webgl2",{alpha:true,premultipliedAlpha:true})||c.getContext("webgl",{alpha:true,premultipliedAlpha:true})||c.getContext("experimental-webgl",{alpha:true,premultipliedAlpha:true});
if(!gl)return;

// Vertex shader — full screen triangle
var vs=gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs,"attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0,1);}");
gl.compileShader(vs);
if(!gl.getShaderParameter(vs,gl.COMPILE_STATUS))return;

// Fragment shader — organic color field
// Uses nested trig functions to create flowing aurora-like patterns
var fs=gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs,"precision highp float;uniform float t;uniform vec2 r;varying vec2 uv;void main(){vec2 u=(uv*2.-1.)*r/min(r.x,r.y);float d=-t*.8,a=0.;for(float i=0.;i<6.;i++){a+=cos(i-d-a*u.x);d+=sin(u.y*i+a);}d+=t*.5;vec3 col=vec3(cos(u*vec2(d,a))*.5+.5,cos(a+d)*.4+.6);col=cos(col*cos(vec3(d,a,2.5))*.5+.5);col=col*vec3(0.15,0.55,1.0)+vec3(0.02,0.04,0.10);gl_FragColor=vec4(col,0.18);}");
gl.compileShader(fs);
if(!gl.getShaderParameter(fs,gl.COMPILE_STATUS))return;

var prog=gl.createProgram();
gl.attachShader(prog,vs);
gl.attachShader(prog,fs);
gl.linkProgram(prog);
if(!gl.getProgramParameter(prog,gl.LINK_STATUS))return;
gl.useProgram(prog);

// Full screen triangle (covers viewport with 3 vertices)
var buf=gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,buf);
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
var loc=gl.getAttribLocation(prog,"p");
gl.enableVertexAttribArray(loc);
gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);

var uT=gl.getUniformLocation(prog,"t");
var uR=gl.getUniformLocation(prog,"r");

function resize(){
var dpr=Math.min(window.devicePixelRatio||1,2);
c.width=c.clientWidth*dpr;
c.height=c.clientHeight*dpr;
gl.viewport(0,0,c.width,c.height);
gl.uniform2f(uR,c.width,c.height);
}
resize();
window.addEventListener("resize",resize);

// Render loop
function loop(ts){
requestAnimationFrame(loop);
gl.uniform1f(uT,ts*0.001);
gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
gl.drawArrays(gl.TRIANGLES,0,3);
}
requestAnimationFrame(loop);
})();
