"use strict";
NEXUS_SPECTRA.Services.Transactions=(()=>{
 const CONTROL_KEY="NEXUS:SPECTRA:receivingSequence";
 const pad=(n,l=6)=>String(n).padStart(l,"0");
 function nextControlNo(){
   const year=new Date().getFullYear();let d={year,seq:0};
   try{d=JSON.parse(localStorage.getItem(CONTROL_KEY)||JSON.stringify(d));}catch(_){}
   if(Number(d.year)!==year)d={year,seq:0};d.seq=Number(d.seq||0)+1;localStorage.setItem(CONTROL_KEY,JSON.stringify(d));return `RCV-${year}-${pad(d.seq)}`;
 }
 function addEvent(row,type,status,holder,by,remarks=""){
   const now=new Date().toISOString();row.events=row.events||[];row.events.push({eventId:`EV-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,type,status,holder,by,remarks,at:now});row.status=status;row.physicalHolder=holder;row.updatedAt=now;return row;
 }
 function receive(transactionNo,input){
   const row=NEXUS_SPECTRA.Repository.Transactions.get(transactionNo);if(!row)return {ok:false,errors:["Billing transaction not found."]};
   if(row.hardCopyStatus==="RECEIVED")return {ok:false,errors:[`Hard copy was already received under ${row.controlNo}.`]};
   const errors=[];if(!String(input.receivedBy||"").trim())errors.push("Receiving staff name is required.");if(!input.completenessStatus)errors.push("Select whether the submission is complete or incomplete.");const components=Array.isArray(input.receivedComponents)?input.receivedComponents.filter(Boolean):[];if(!components.length)errors.push("Select at least one billing component received in this hard-copy submission.");if(errors.length)return {ok:false,errors};
   row.controlNo=row.controlNo||nextControlNo();row.receivedComponents=components;row.claimComponents=[...new Set([...(row.claimComponents||[]),...components])];row.hardCopyStatus="RECEIVED";row.receivedAt=new Date().toISOString();row.receivedBy=String(input.receivedBy).trim();row.documentSets=Number(input.documentSets||1);row.completenessStatus=input.completenessStatus;row.receivingRemarks=String(input.remarks||"").trim();row.deficiencyNote=input.completenessStatus==="INCOMPLETE"?String(input.deficiencyNote||"").trim():"";
   addEvent(row,"HARD_COPY_RECEIVED","RECEIVED_AT_PO","RECEIVING",row.receivedBy,`Control No. ${row.controlNo}. Components received: ${components.join(", ")}. ${row.completenessStatus}. ${row.receivingRemarks}`.trim());
   if(row.completenessStatus==="COMPLETE_FOR_ROUTING")addEvent(row,"ROUTED_TO_SCHOLARSHIP","SCHOLARSHIP_REVIEW","SCHOLARSHIP",row.receivedBy,"Hard-copy billing package routed to Scholarship Section for technical review.");
   else addEvent(row,"RECEIVED_INCOMPLETE","FOR_COMPLIANCE","RECEIVING",row.receivedBy,row.deficiencyNote||"Submission received incomplete; written feedback required.");
   NEXUS_SPECTRA.Repository.Transactions.save(row);return {ok:true,row};
 }
 function route(transactionNo,target,by,remarks=""){
   const row=NEXUS_SPECTRA.Repository.Transactions.get(transactionNo);if(!row)return {ok:false,errors:["Transaction not found."]};
   const map={
     SCHOLARSHIP:{status:"SCHOLARSHIP_REVIEW",event:"ROUTED_TO_SCHOLARSHIP"},
     ACCOUNTING_REVIEW:{status:"ACCOUNTING_REVIEW",event:"ROUTED_TO_ACCOUNTING_REVIEW"},
     RECEIVING:{status:"RECEIVED_AT_PO",event:"ROUTED_TO_RECEIVING"}
   };
   if(!map[target])return {ok:false,errors:["Unsupported routing target in Block 1."]};
   addEvent(row,map[target].event,map[target].status,target,by,remarks);NEXUS_SPECTRA.Repository.Transactions.save(row);return {ok:true,row};
 }
 function summary(){
   const rows=NEXUS_SPECTRA.Repository.Transactions.all();
   return {
     total:rows.length,
     awaiting:rows.filter(x=>x.status==="AWAITING_HARD_COPY").length,
     receiving:rows.filter(x=>x.physicalHolder==="RECEIVING").length,
     scholarship:rows.filter(x=>x.physicalHolder==="SCHOLARSHIP").length,
     incomplete:rows.filter(x=>x.status==="FOR_COMPLIANCE").length
   };
 }
 function qrToken(row){
   // Keep token <=25 chars and alphanumeric for Version 1-L.
   return String(row.transactionNo||"").replace(/-/g,"").slice(0,25).toUpperCase();
 }
 return Object.freeze({receive,route,summary,qrToken,addEvent});
})();