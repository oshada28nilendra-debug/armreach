/* Pure planar two-link geometry. Public angles in degrees, lengths in metres. */
(function(root){
'use strict';
const rad=x=>x*Math.PI/180, deg=x=>x*180/Math.PI;
function finite(x){return typeof x==='number'&&Number.isFinite(x)}
function validate(c){
 if(!c||![c.l1,c.l2].every(x=>finite(x)&&x>=0.01&&x<=10))throw Error('Link lengths must be 0.01–10 metres.');
 for(const k of ['q1','q2'])if(!Array.isArray(c[k])||c[k].length!==2||!c[k].every(finite)||c[k][0]<-180||c[k][1]>180||c[k][0]>c[k][1])throw Error('Joint limits must be ordered within −180° to 180°.');
 return c;
}
function fk(c,a,b){validate(c);if(!finite(a)||!finite(b)||Math.abs(a)>180||Math.abs(b)>180)throw Error('Angles must be finite and within ±180°.');const elbow={x:c.l1*Math.cos(rad(a)),y:c.l1*Math.sin(rad(a))};return {elbow,x:elbow.x+c.l2*Math.cos(rad(a+b)),y:elbow.y+c.l2*Math.sin(rad(a+b))};}
function equivalents(a,limit){const out=[];for(let k=-2;k<=2;k++){const v=a+360*k;if(v>=limit[0]-1e-9&&v<=limit[1]+1e-9)out.push(Math.max(limit[0],Math.min(limit[1],v)));}return out;}
function ik(c,x,y){validate(c);if(!finite(x)||!finite(y)||Math.abs(x)>100||Math.abs(y)>100)throw Error('Target coordinates must be finite within ±100 metres.');
 const r=Math.hypot(x,y), eps=1e-10*(c.l1+c.l2);
 if(r>c.l1+c.l2+eps||r<Math.abs(c.l1-c.l2)-eps)return {status:'outside workspace',solutions:[],singular:false};
 // At equal-link origin the shoulder is free. Return a valid representative.
 if(r===0&&c.l1===c.l2){const bs=equivalents(180,c.q2);return {status:bs.length?'infinite family':'blocked by joint limits',singular:true,solutions:bs.slice(0,1).map(b=>({q1:c.q1[0],q2:b}))};}
 const cos=Math.max(-1,Math.min(1,(r*r-c.l1*c.l1-c.l2*c.l2)/(2*c.l1*c.l2))), b=Math.acos(cos), sol=[];
 for(const beta of [b,-b]){const alpha=Math.atan2(y,x)-Math.atan2(c.l2*Math.sin(beta),c.l1+c.l2*Math.cos(beta));for(const a of equivalents(deg(alpha),c.q1))for(const q of equivalents(deg(beta),c.q2)){
 // ±180 describe the same pose; keep one representation admitted by limits.
 if(!sol.some(s=>Math.abs(Math.sin(rad((s.q1-a)/2)))<1e-8&&Math.abs(Math.sin(rad((s.q2-q)/2)))<1e-8))sol.push({q1:a,q2:q});
 }}
 return {status:sol.length?'reachable':'blocked by joint limits',solutions:sol,singular:Math.abs(Math.sin(b))<1e-8};
}
const api={validate,fk,ik};if(typeof module!=='undefined')module.exports=api;else root.ArmReach=api;
})(typeof globalThis!=='undefined'?globalThis:this);
