"use strict";
NEXUS_SAM.Modules.Handoff.Service = (()=>{
 const SEQ_KEY="NEXUS:SPECTRA:billingSequence";
 const pad=(n,l=6)=>String(n).padStart(l,"0");
 function nextTransactionNo(){
   const year=new Date().getFullYear();
   let data={year,seq:0};
   try{data=JSON.parse(localStorage.getItem(SEQ_KEY)||JSON.stringify(data));}catch(_){}
   if(Number(data.year)!==year)data={year,seq:0};
   data.seq=Number(data.seq||0)+1;
   localStorage.setItem(SEQ_KEY,JSON.stringify(data));
   return `SPT-${year}-${pad(data.seq)}`;
 }
 function stableStringify(value){
   if(value===null||typeof value!=="object")return JSON.stringify(value);
   if(Array.isArray(value))return `[${value.map(stableStringify).join(",")}]`;
   return `{${Object.keys(value).sort().map(k=>JSON.stringify(k)+":"+stableStringify(value[k])).join(",")}}`;
 }
 function hashText(text){
   let h1=0x811c9dc5;
   for(let i=0;i<text.length;i++){h1^=text.charCodeAt(i);h1=Math.imul(h1,0x01000193);}
   return ("00000000"+(h1>>>0).toString(16)).slice(-8).toUpperCase();
 }
 function buildSnapshot(batchId){
   const batch=NEXUS_SAM.Modules.Batch.Service.get(batchId);
   const allowance=NEXUS_SAM.Modules.Allowance.Service.build(batchId);
   const reportData=NEXUS_SAM.Modules.Reports.Service.build(batchId);
   const attendance=NEXUS_SAM.Modules.Attendance.Repository.byBatch(batchId);
   const validations=NEXUS_SAM.Modules.Validation.Repository.all().filter(v=>v.batchId===batchId);
   const profile=NEXUS_SAM.Modules.Reports.Repository.get(batchId)||{};
   const snapshot={
     schemaVersion:"SAM-SNAPSHOT-1",
     finalizedAt:new Date().toISOString(),
     batch,
     attendanceReports:attendance.map(r=>({
       attendanceImportId:r.attendanceImportId,reportNumber:r.reportNumber,attendanceDate:r.attendanceDate,
       qualification:r.qualification,tvi:r.tvi,fileName:r.fileName,
       scholars:r.scholars.map(s=>({no:s.no,name:s.name,email:s.email,bsrsTimeIn:s.bsrsTimeIn,bsrsTimeOut:s.bsrsTimeOut,bsrsDuration:s.bsrsDuration,attendanceStatus:s.attendanceStatus}))
     })),
     validations,
     allowance:{
       summary:allowance.summary,
       scholars:allowance.rows.map(r=>({
         key:r.key,name:r.name,email:r.email,presentDays:r.presentDays,absentDays:r.absentDays,
         pendingDays:r.pendingDays,reviewDays:r.reviewDays,missingDays:r.missingDays,
         dayProgress:r.dayProgress,rate:r.rate,maxTsf:r.maxTsf,earned:r.earned,
         absenceDeduction:r.absenceDeduction,isReady:r.isReady,tranche:r.tranche
       }))
     },
     reportProfile:{
       preparedBy:profile.preparedBy||"",preparedTitle:profile.preparedTitle||"",
       approvedBy:profile.approvedBy||"",approvedTitle:profile.approvedTitle||"",
       entityAddress:profile.entityAddress||"",ulis:profile.ulis||{}
     }
   };
   const canonical=stableStringify(snapshot);
   return {snapshot,hash:hashText(canonical)};
 }
 function readiness(batchId,claimType="TSF_COMBINED"){
   const workflow=NEXUS_SAM.Modules.Workflow.Service.status(batchId);
   const reports=NEXUS_SAM.Modules.Reports.Service.build(batchId);
   const errors=[];
   if(!workflow.batch)errors.push("Scholarship batch was not found.");
   if(/^TSF_/.test(claimType)&&!workflow.steps?.[5]?.ready)errors.push("Complete the Allowance workflow before submitting a TSF billing package.");
   if(!reports.ok)errors.push(...(reports.errors||[]));
   if(!reports.profile?.updatedAt)errors.push("Save the School Report Details before finalization.");
   const missingUli=(reports.scholars||[]).filter(s=>!String(s.uli||"").trim());
   const docs=NEXUS_SAM.Modules.Handoff.Documents.byBatch(batchId);
   const docTypes=new Set(docs.map(d=>d.docType));
   if(/^TSF_/.test(claimType)&&missingUli.length)errors.push(`${missingUli.length} scholar ULI record(s) are still blank.`);
   if(!docTypes.has("BILLING_STATEMENT"))errors.push("Upload the signed Billing Statement for online reviewer access.");
   if(/^TSF_/.test(claimType)&&!docTypes.has("ATTENDANCE_SUMMARY"))errors.push("Upload the signed Summary of Attendance for online reviewer access.");
   return {ok:errors.length===0,errors,workflow,reports};
 }
 function submit(batchId,claimType="TSF_COMBINED",options={}){
   const typeMap={TSF_FULL:{label:"Training Support Fund – Initial + Remaining (Combined)",components:["TSF_INITIAL_50","TSF_REMAINING_50"]},TSF_COMBINED:{label:"Training Support Fund – Initial + Remaining (Combined)",components:["TSF_INITIAL_50","TSF_REMAINING_50"]},TSF_INITIAL_50:{label:"Training Support Fund – Initial 50%",components:["TSF_INITIAL_50"]},TSF_REMAINING_50:{label:"Training Support Fund – Remaining / Final",components:["TSF_REMAINING_50"]},TRAINING_FEE:{label:"Training Fee / Training Cost",components:["TRAINING_FEE"]},ASSESSMENT_FEE:{label:"Assessment Fee",components:["ASSESSMENT_FEE"]},ENTREPRENEURSHIP_FEE:{label:"Entrepreneurship Fee",components:["ENTREPRENEURSHIP_FEE"]}};
   const type=typeMap[claimType]||{label:options.claimLabel||claimType,components:options.claimComponents||[claimType]};
   const ready=options.nonAllowance?{ok:true,errors:[]}:readiness(batchId,claimType);
   if(!ready.ok)return {ok:false,errors:ready.errors};
   const sourceRqm=options.rqmOverride||NEXUS_SAM.Modules.RQM?.get?.(String(batchId).replace(/^RQM-/,""))||null;
   const sourceBatch=NEXUS_SAM.Modules.Batch.Service.get(batchId);
   if(!sourceBatch&&!sourceRqm)return {ok:false,errors:["RQM/batch source not found."]};
   const rqmCode=sourceBatch?.rqmCode||sourceBatch?.rqmNo||sourceRqm?.rqmCode||sourceRqm?.rqmNo||"";
   const active=NEXUS_SAM.Modules.Handoff.Repository.all().filter(x=>String(x.rqmCode||x.rqmNo).trim().toUpperCase()===String(rqmCode).trim().toUpperCase()&&!["CANCELLED","RETURNED_TO_TVI"].includes(x.status));
   const used=new Set(active.flatMap(x=>x.claimComponents||[x.claimType]));
   if(type.components.some(c=>used.has(c)))return {ok:false,errors:["One or more selected billing components already have an active transaction for this RQM."]};
   let snapshot,hash;
   if(sourceBatch){({snapshot,hash}=buildSnapshot(sourceBatch.batchId));}else{snapshot={schemaVersion:"SAM-SNAPSHOT-1",finalizedAt:new Date().toISOString(),batch:{batchId,rqmNo:rqmCode,rqmCode,tvi:sourceRqm.tvi,qualificationTitle:sourceRqm.qualification,scholarshipProgram:sourceRqm.scholarshipProgram,numberOfSlots:sourceRqm.slots},attendanceReports:[],validations:[],allowance:{summary:{},scholars:[]},reportProfile:{preparedBy:"TVET Provider"}};hash=hashText(stableStringify(snapshot));}
   const onlineDocuments=Array.isArray(options.onlineDocuments)?options.onlineDocuments:(sourceBatch?NEXUS_SAM.Modules.Handoff.Documents.byBatch(sourceBatch.batchId):[]);snapshot.onlineDocuments=onlineDocuments;snapshot.claimContext={claimType,claimComponents:type.components,scholarSummary:options.scholarSummary||{},calculationBasis:"Provider Portal computed reference; Provincial Office verification required."};
   const batch=snapshot.batch,total=Number(options.claimAmount!==undefined?options.claimAmount:snapshot.allowance.scholars.reduce((n,s)=>n+Number(s.earned||0),0)),transactionNo=nextTransactionNo(),now=new Date().toISOString();
   const row={schemaVersion:"SPECTRA-BILLING-1",transactionNo,controlNo:"",sourceApp:"PROVIDER_PORTAL",sourceBatchId:sourceBatch?.batchId||batchId,rqmNo:rqmCode,rqmCode,scholarshipProgram:batch.scholarshipProgram||sourceRqm?.scholarshipProgram||"",claimType,claimComponents:options.claimComponents||type.components,claimLabel:options.claimLabel||type.label,claimAmount:Math.round(total*100)/100,tvi:batch.tvi||sourceRqm?.tvi||"",qualification:batch.qualificationTitle||sourceRqm?.qualification||"",slots:Number(batch.numberOfSlots||sourceRqm?.slots||0),trainingStartDate:batch.trainingStartDate||sourceRqm?.actualTrainingStart||"",trainingEndDate:batch.trainingEndDate||sourceRqm?.actualTrainingEnd||"",status:"AWAITING_HARD_COPY",physicalHolder:"TVET_PROVIDER",hardCopyStatus:"NOT_RECEIVED",completenessStatus:"NOT_ASSESSED",snapshotVersion:1,snapshotHash:hash,snapshot,createdAt:now,finalizedAt:now,updatedAt:now,events:[{eventId:`EV-${Date.now()}`,type:"FINALIZED_BY_TVI",status:"AWAITING_HARD_COPY",holder:"TVET_PROVIDER",at:now,by:(snapshot.reportProfile.preparedBy||"TVET Provider"),remarks:`${options.claimLabel||type.label} billing package finalized in the Provider Portal. Hard-copy submission pending.`}]};
   NEXUS_SAM.Modules.Handoff.Repository.save(row);return {ok:true,row};
 }
 return Object.freeze({readiness,submit,buildSnapshot,hashText});
})();