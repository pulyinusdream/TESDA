"use strict";
NEXUS_SPECTRA.Repository.Admin=(()=>{
 const KEYS={
   overrides:"NEXUS:SPECTRA:overrideRequests",
   approvals:"NEXUS:SPECTRA:approvalActions",
   adminNotes:"NEXUS:SPECTRA:adminNotes"
 };
 const load=k=>{try{return JSON.parse(localStorage.getItem(k)||"[]");}catch(_){return [];}};
 const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
 function upsert(k,row,id){const rows=load(k),i=rows.findIndex(x=>x[id]===row[id]);if(i>=0)rows[i]=row;else rows.push(row);save(k,rows);return row;}
 return Object.freeze({
   overrideRequests:()=>load(KEYS.overrides),
   saveOverride:r=>upsert(KEYS.overrides,r,"requestId"),
   approvalActions:()=>load(KEYS.approvals),
   saveApproval:r=>upsert(KEYS.approvals,r,"approvalId"),
   adminNotes:()=>load(KEYS.adminNotes),
   saveAdminNote:r=>upsert(KEYS.adminNotes,r,"noteId")
 });
})();