"use strict";
NEXUS_SPECTRA.Repository.Compliance=(()=>{
 const KEYS={cashAdvance:"NEXUS:SPECTRA:cashAdvanceCompliance",packages:"NEXUS:SPECTRA:coaSubmissionPackages",packageSeq:"NEXUS:SPECTRA:coaPackageSequence"};
 const load=k=>{try{return JSON.parse(localStorage.getItem(k)||"[]");}catch(_){return [];}};const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
 function upsert(k,row,id){const rows=load(k),i=rows.findIndex(x=>x[id]===row[id]);if(i>=0)rows[i]=row;else rows.push(row);save(k,rows);return row;}
 function nextPackageNo(){const y=new Date().getFullYear(),n=Number(localStorage.getItem(KEYS.packageSeq)||0)+1;localStorage.setItem(KEYS.packageSeq,String(n));return `COAPKG-${y}-${String(n).padStart(6,"0")}`;}
 return Object.freeze({cashAdvances:()=>load(KEYS.cashAdvance),saveCashAdvance:r=>upsert(KEYS.cashAdvance,r,"cashAdvanceId"),packages:()=>load(KEYS.packages),savePackage:r=>upsert(KEYS.packages,r,"packageNo"),nextPackageNo});
})();