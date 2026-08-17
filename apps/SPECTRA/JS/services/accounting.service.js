"use strict";
NEXUS_SPECTRA.Services.Accounting=(()=>{
 const checklist=[
   {id:"SCHOLARSHIP_REVIEW",label:"Scholarship technical/documentary review is verified"},
   {id:"SYSTEM_AMOUNT",label:"Claim amount agrees with the finalized SAM allowance computation"},
   {id:"ATTENDANCE_SUMMARY",label:"Attendance Summary agrees with the online/hard-copy supporting records"},
   {id:"BILLING_STATEMENT",label:"Billing Statement amount and scholar details are correct"},
   {id:"PRIOR_PAYMENT",label:"No duplicate/prior payment for the same RQM component/tranche"},
   {id:"RQM_BALANCE",label:"Claim is within the current approved RQM/component balance"},
   {id:"ACCOUNTING_DOCS",label:"Required accounting supporting documents are complete"},
   {id:"PAYROLL_READY",label:"Provincial Office payroll has been generated/reviewed and is ready for budget certification"}
 ];
 function ensure(no){const tx=NEXUS_SPECTRA.Repository.Transactions.get(no);if(!tx)return null;let row=NEXUS_SPECTRA.Repository.Accounting.get(no);if(!row){row={schemaVersion:"SPECTRA-ACC-REVIEW-1",transactionNo:no,status:"DRAFT",reviewer:"",startedAt:new Date().toISOString(),updatedAt:new Date().toISOString(),checklist:checklist.map(x=>({...x,result:"PENDING",remarks:""})),payrollGenerated:false,payrollGeneratedAt:"",payrollGeneratedBy:"",systemChecks:{}};}row.systemChecks=systemChecks(tx);NEXUS_SPECTRA.Repository.Accounting.save(row);return row;}
 function systemChecks(tx){
   const claim=Number(tx.claimAmount||0),sam=(tx.snapshot?.allowance?.scholars||[]).reduce((n,s)=>n+Number(s.earned||0),0);
   const sameRqm=NEXUS_SPECTRA.Repository.Transactions.all().filter(x=>x.transactionNo!==tx.transactionNo&&(x.rqmCode||x.rqmNo)===(tx.rqmCode||tx.rqmNo)&&x.claimType===tx.claimType);
   const previouslyPaid=sameRqm.filter(x=>["PAID","CLOSED"].includes(x.status)).reduce((n,x)=>n+Number(x.claimAmount||0),0);
   const activeDup=sameRqm.filter(x=>!["CANCELLED","RETURNED_TO_TVI","PAID","CLOSED"].includes(x.status));
   const ceiling=Number(tx.snapshot?.batch?.maximumTsf||0)*Number(tx.snapshot?.batch?.numberOfSlots||0);
   return {
     SCHOLARSHIP_VERIFIED:{ok:!!tx.scholarshipReviewedAt,detail:tx.scholarshipReviewedBy?`Verified by ${tx.scholarshipReviewedBy}`:"Scholarship verification missing"},
     CLAIM_MATCH:{ok:Math.abs(claim-sam)<.01,detail:`Transaction ${claim.toFixed(2)} vs SAM ${sam.toFixed(2)}`},
     PRIOR_PAYMENT:{ok:activeDup.length===0,detail:`Previously paid same component: ${previouslyPaid.toFixed(2)}; active duplicate cases: ${activeDup.length}`},
     RQM_BALANCE:{ok:claim+previouslyPaid<=ceiling+.01,detail:`Claim + prior paid ${(claim+previouslyPaid).toFixed(2)} / batch ceiling ${ceiling.toFixed(2)}`}
   };
 }
 function saveReviewer(no,name){const r=ensure(no);r.reviewer=String(name||"").trim();r.updatedAt=new Date().toISOString();return NEXUS_SPECTRA.Repository.Accounting.save(r);}
 function update(no,id,result,remarks=""){const r=ensure(no),x=r.checklist.find(i=>i.id===id);if(x){x.result=result;x.remarks=remarks;}r.updatedAt=new Date().toISOString();return NEXUS_SPECTRA.Repository.Accounting.save(r);}
 function markPayroll(no,by){const r=ensure(no);r.payrollGenerated=true;r.payrollGeneratedAt=new Date().toISOString();r.payrollGeneratedBy=String(by||r.reviewer||"").trim();const x=r.checklist.find(i=>i.id==="PAYROLL_READY");if(x)x.result="PASSED";NEXUS_SPECTRA.Repository.Accounting.save(r);return r;}
 function readiness(no){const r=ensure(no),tx=NEXUS_SPECTRA.Repository.Transactions.get(no),errors=[];if(!r||!tx)return {ok:false,errors:["Accounting review not found."]};if(!r.reviewer)errors.push("Accounting reviewer name is required.");const sys=Object.values(r.systemChecks).filter(x=>!x.ok);if(sys.length)errors.push(`${sys.length} accounting system exception(s) remain.`);const pending=r.checklist.filter(x=>x.result!=="PASSED");if(pending.length)errors.push(`${pending.length} accounting checklist item(s) are not passed.`);if(!r.payrollGenerated)errors.push("Provincial Office payroll has not yet been generated/reviewed.");return {ok:errors.length===0,errors,row:r,tx};}
 function forwardBudget(no){const ready=readiness(no);if(!ready.ok)return ready;const {row,tx}=ready,now=new Date().toISOString();row.status="VERIFIED";row.verifiedAt=now;row.reviewSnapshot=JSON.parse(JSON.stringify({systemChecks:row.systemChecks,checklist:row.checklist,payrollGenerated:row.payrollGenerated,payrollGeneratedAt:row.payrollGeneratedAt}));NEXUS_SPECTRA.Repository.Accounting.save(row);NEXUS_SPECTRA.Services.Transactions.addEvent(tx,"ACCOUNTING_REVIEW_VERIFIED","FOR_BUDGET_OBLIGATION","BUDGET",row.reviewer,"Accounting review completed; payroll reviewed and transaction forwarded for budget certification / obligation.");tx.accountingReviewedAt=now;tx.accountingReviewedBy=row.reviewer;tx.actionRequiredBy="BUDGET";NEXUS_SPECTRA.Repository.Transactions.save(tx);return {ok:true,row,tx};}
 return Object.freeze({ensure,systemChecks,saveReviewer,update,markPayroll,readiness,forwardBudget});
})();