"use strict";
/* Minimal QR Version 1-L alphanumeric encoder for short SPECTRA transaction tokens.
   Payload must use QR alphanumeric set and fit Version 1-L (<=25 chars). */
NEXUS_SPECTRA.Utilities.QR=(()=>{
 const ALPH="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";
 const gfExp=new Array(512),gfLog=new Array(256);let x=1;
 for(let i=0;i<255;i++){gfExp[i]=x;gfLog[x]=i;x<<=1;if(x&0x100)x^=0x11d;}for(let i=255;i<512;i++)gfExp[i]=gfExp[i-255];
 const mul=(a,b)=>a&&b?gfExp[gfLog[a]+gfLog[b]]:0;
 function rs(data,ec=7){
   let gen=[1];
   for(let i=0;i<ec;i++){const next=new Array(gen.length+1).fill(0);for(let j=0;j<gen.length;j++){next[j]^=gen[j];next[j+1]^=mul(gen[j],gfExp[i]);}gen=next;}
   const msg=data.concat(new Array(ec).fill(0));
   for(let i=0;i<data.length;i++){const coef=msg[i];if(!coef)continue;for(let j=0;j<gen.length;j++)msg[i+j]^=mul(gen[j],coef);}
   return msg.slice(data.length);
 }
 function bitsPush(arr,val,len){for(let i=len-1;i>=0;i--)arr.push((val>>i)&1);}
 function encodeData(text){
   text=String(text||"").toUpperCase();if(text.length>25)throw new Error("QR token too long.");
   for(const ch of text)if(!ALPH.includes(ch))throw new Error("Unsupported QR character.");
   const bits=[];bitsPush(bits,0b0010,4);bitsPush(bits,text.length,9);
   for(let i=0;i<text.length;i+=2){if(i+1<text.length)bitsPush(bits,ALPH.indexOf(text[i])*45+ALPH.indexOf(text[i+1]),11);else bitsPush(bits,ALPH.indexOf(text[i]),6);}
   const capacity=19*8;for(let i=0;i<Math.min(4,capacity-bits.length);i++)bits.push(0);while(bits.length%8)bits.push(0);
   const bytes=[];for(let i=0;i<bits.length;i+=8){let b=0;for(let j=0;j<8;j++)b=(b<<1)|bits[i+j];bytes.push(b);}
   const pads=[0xec,0x11];let pi=0;while(bytes.length<19){bytes.push(pads[pi++%2]);}
   return bytes.concat(rs(bytes,7));
 }
 function baseMatrix(){
   const n=21,m=Array.from({length:n},()=>Array(n).fill(null)),reserve=Array.from({length:n},()=>Array(n).fill(false));
   function set(r,c,v,res=true){if(r>=0&&c>=0&&r<n&&c<n){m[r][c]=v;if(res)reserve[r][c]=true;}}
   function finder(r,c){
     for(let dr=-1;dr<=7;dr++)for(let dc=-1;dc<=7;dc++){
       const rr=r+dr,cc=c+dc;if(rr<0||cc<0||rr>=n||cc>=n)continue;
       const inside=dr>=0&&dr<=6&&dc>=0&&dc<=6;
       const black=inside&&(dr===0||dr===6||dc===0||dc===6||(dr>=2&&dr<=4&&dc>=2&&dc<=4));
       set(rr,cc,black?1:0,true);
     }
   }
   finder(0,0);finder(0,14);finder(14,0);
   for(let i=8;i<=12;i++){set(6,i,i%2===0?1:0,true);set(i,6,i%2===0?1:0,true);}
   set(13,8,1,true); // dark module
   // Reserve format positions
   const fmt1=[[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[7,8],[8,8],[8,7],[8,5],[8,4],[8,3],[8,2],[8,1],[8,0]];
   const fmt2=[[8,20],[8,19],[8,18],[8,17],[8,16],[8,15],[8,14],[8,13],[14,8],[15,8],[16,8],[17,8],[18,8],[19,8],[20,8]];
   [...fmt1,...fmt2].forEach(([r,c])=>{reserve[r][c]=true;if(m[r][c]===null)m[r][c]=0;});
   return {m,reserve,fmt1,fmt2};
 }
 function formatBits(mask){
   let data=(1<<3)|mask; // L = 01
   let v=data<<10,poly=0x537;
   for(let i=14;i>=10;i--)if((v>>i)&1)v^=poly<<(i-10);
   return (((data<<10)|(v&0x3ff))^0x5412)&0x7fff;
 }
 function build(text,mask=0){
   const bytes=encodeData(text),bits=[];bytes.forEach(b=>bitsPush(bits,b,8));
   const {m,reserve,fmt1,fmt2}=baseMatrix(),n=21;let idx=0,up=true;
   for(let c=n-1;c>0;c-=2){if(c===6)c--;for(let k=0;k<n;k++){const r=up?n-1-k:k;for(let dc=0;dc<2;dc++){const cc=c-dc;if(reserve[r][cc])continue;let bit=idx<bits.length?bits[idx++]:0;const invert=((r+cc)%2===0);if(mask===0&&invert)bit^=1;m[r][cc]=bit;}}up=!up;}
   const fb=formatBits(mask);for(let i=0;i<15;i++){const bit=(fb>>i)&1;const [r1,c1]=fmt1[i],[r2,c2]=fmt2[i];m[r1][c1]=bit;m[r2][c2]=bit;}
   return m;
 }
 function svg(text,size=150){
   const matrix=build(text,0),n=matrix.length,q=4,total=n+q*2,cell=size/total;
   let rects="";for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(matrix[r][c])rects+=`<rect x="${(c+q)*cell}" y="${(r+q)*cell}" width="${cell+0.05}" height="${cell+0.05}"/>`;
   return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="white"/><g fill="black">${rects}</g></svg>`;
 }
 return Object.freeze({build,svg});
})();