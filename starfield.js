(function(){
var c=document.getElementById("starfield");
if(!c)return;
var gl=c.getContext("webgl",{alpha:true,antialias:false})||c.getContext("experimental-webgl",{alpha:true,antialias:false});
if(!gl)return;
var vs=gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs,"attribute vec2 p;attribute float s;attribute float a;attribute vec3 cl;varying float va;varying vec3 vc;uniform vec2 r;uniform float t;uniform vec2 m;uniform float d;void main(){vec2 mp=p+m*a*0.02;gl_Position=vec4(mp,0,1);gl_PointSize=s*d*(0.8+a*1.2);va=a;vc=cl;}");
gl.compileShader(vs);
if(!gl.getShaderParameter(vs,gl.COMPILE_STATUS))return;
var fs=gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs,"precision mediump float;varying float va;varying vec3 vc;void main(){float dist=length(gl_PointCoord-0.5)*2.0;float glow=1.0-smoothstep(0.0,1.0,dist);glow=pow(glow,1.5);gl_FragColor=vec4(vc,glow*va);}");
gl.compileShader(fs);
if(!gl.getShaderParameter(fs,gl.COMPILE_STATUS))return;
var prog=gl.createProgram();
gl.attachShader(prog,vs);
gl.attachShader(prog,fs);
gl.linkProgram(prog);
if(!gl.getProgramParameter(prog,gl.LINK_STATUS))return;
gl.useProgram(prog);
var aP=gl.getAttribLocation(prog,"p");
var aS=gl.getAttribLocation(prog,"s");
var aA=gl.getAttribLocation(prog,"a");
var aC=gl.getAttribLocation(prog,"cl");
var uR=gl.getUniformLocation(prog,"r");
var uT=gl.getUniformLocation(prog,"t");
var uM=gl.getUniformLocation(prog,"m");
var uD=gl.getUniformLocation(prog,"d");
var N=1200;
var pos=new Float32Array(N*2);
var siz=new Float32Array(N);
var alp=new Float32Array(N);
var col=new Float32Array(N*3);
var vel=new Float32Array(N*2);
var dep=new Float32Array(N);
for(var i=0;i<N;i++){
pos[i*2]=(Math.random()-0.5)*2.4;
pos[i*2+1]=(Math.random()-0.5)*2.4;
dep[i]=Math.random();
var dd=dep[i];
siz[i]=0.8+dd*3.5;
alp[i]=0.15+dd*0.55;
col[i*3]=0.0+dd*0.15;
col[i*3+1]=0.5+dd*0.5;
col[i*3+2]=0.7+dd*0.3;
vel[i*2]=(Math.random()-0.5)*0.0003;
vel[i*2+1]=(Math.random()-0.5)*0.0002-0.0001;
}
var bP=gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,bP);
gl.bufferData(gl.ARRAY_BUFFER,pos,gl.DYNAMIC_DRAW);
var bS=gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,bS);
gl.bufferData(gl.ARRAY_BUFFER,siz,gl.STATIC_DRAW);
var bA=gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,bA);
gl.bufferData(gl.ARRAY_BUFFER,alp,gl.DYNAMIC_DRAW);
var bC=gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,bC);
gl.bufferData(gl.ARRAY_BUFFER,col,gl.STATIC_DRAW);
function resize(){
c.width=window.innerWidth;
c.height=window.innerHeight;
gl.viewport(0,0,c.width,c.height);
gl.uniform2f(uR,c.width,c.height);
gl.uniform1f(uD,window.devicePixelRatio||1);
}
var mx=0,my=0,tmx=0,tmy=0;
var st=performance.now(),animId;
document.addEventListener("mousemove",function(e){
tmx=(e.clientX/window.innerWidth-0.5)*2;
tmy=-(e.clientY/window.innerHeight-0.5)*2;
});
function draw(now){
var dt=Math.min((now-st)/1000,0.1);
st=now;
mx+=(tmx-mx)*0.05;
my+=(tmy-my)*0.05;
for(var i=0;i<N;i++){
pos[i*2]+=vel[i*2]*dt*60;
pos[i*2+1]+=vel[i*2+1]*dt*60;
if(pos[i*2]>1.3)pos[i*2]=-1.3;
if(pos[i*2]<-1.3)pos[i*2]=1.3;
if(pos[i*2+1]>1.3){pos[i*2+1]=-1.3;pos[i*2]=(Math.random()-0.5)*2.6;}
if(pos[i*2+1]<-1.3){pos[i*2+1]=1.3;pos[i*2]=(Math.random()-0.5)*2.6;}
var dd=dep[i];
alp[i]=(0.15+dd*0.55)+Math.sin(now*0.001+i*0.1)*0.05;
}
gl.bindBuffer(gl.ARRAY_BUFFER,bP);
gl.bufferSubData(gl.ARRAY_BUFFER,0,pos);
gl.enableVertexAttribArray(aP);
gl.vertexAttribPointer(aP,2,gl.FLOAT,false,0,0);
gl.bindBuffer(gl.ARRAY_BUFFER,bS);
gl.enableVertexAttribArray(aS);
gl.vertexAttribPointer(aS,1,gl.FLOAT,false,0,0);
gl.bindBuffer(gl.ARRAY_BUFFER,bA);
gl.bufferSubData(gl.ARRAY_BUFFER,0,alp);
gl.enableVertexAttribArray(aA);
gl.vertexAttribPointer(aA,1,gl.FLOAT,false,0,0);
gl.bindBuffer(gl.ARRAY_BUFFER,bC);
gl.enableVertexAttribArray(aC);
gl.vertexAttribPointer(aC,3,gl.FLOAT,false,0,0);
gl.uniform1f(uT,now*0.001);
gl.uniform2f(uM,mx,my);
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA,gl.ONE);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.POINTS,0,N);
animId=requestAnimationFrame(draw);
}
document.addEventListener("visibilitychange",function(){
if(document.hidden){cancelAnimationFrame(animId);}
else{st=performance.now();animId=requestAnimationFrame(draw);}
});
window.addEventListener("resize",resize);
resize();
animId=requestAnimationFrame(draw);
})();
