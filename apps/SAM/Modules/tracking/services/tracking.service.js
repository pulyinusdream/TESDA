"use strict";
NEXUS_SAM.Modules.Tracking = NEXUS_SAM.Modules.Tracking || {};
NEXUS_SAM.Modules.Tracking.Service=(()=>{
 const stages=[
   {key:"SUBMITTED",label:"Billing Finalized",desc:"Online billing package finalized and transaction number created."},
   {key:"RECEIVED",label:"Hard-Copy Received",desc:"Physical billing documents received and assigned a Provincial Office control number."},
   {key:"SCHOLARSHIP",label:"Scholarship Review",desc:"Technical/documentary review and due-diligence verification."},
   {key:"ACCOUNTING",label:"Accounting Review",desc:"Financial/documentary review and Provincial Office payroll preparation."},
   {key:"BUDGET",label:"Budget / Obligation",desc:"Budget certification and BURS/ORS/obligation processing."},
   {key:"DVJEV",label:"DV / JEV",desc:"Accounting preparation of Disbursement Voucher and Journal Entry Voucher."},
   {key:"CASHIER",label:"Cashiering / Payment",desc:"Check, cash advance, or LANDBANK payment processing."},
   {key:"PAID",label:"Paid / Closed",desc:"Payment completed and billing transaction closed."}
 ];
 const statusStage={
   AWAITING_HARD_COPY:0,RECEIVED_AT_PO:1,FOR_COMPLIANCE:2,SCHOLARSHIP_REVIEW:2,
   ACCOUNTING_REVIEW:3,FOR_BUDGET_OBLIGATION:4,OBLIGATED:5,ACCOUNTING_DV_JEV:5,
   FOR_CASHIER:6,PAYMENT_PROCESSING:6,PAID:7,CLOSED:7
 };
 function all(){return NEXUS_SAM.Modules.Handoff.Repository.all().sort((a,b)=>(b.updatedAt||b.createdAt||"").localeCompare(a.updatedAt||a.createdAt||""));}
 function stageIndex(tx){return statusStage[tx.status]??0;}
 function stage(tx){return stages[stageIndex(tx)];}
 function queueInfo(tx){
   const processing=all().filter(x=>!["PAID","CLOSED","CANCELLED"].includes(x.status)&&x.hardCopyStatus==="RECEIVED").sort((a,b)=>String(a.receivedAt||a.createdAt).localeCompare(String(b.receivedAt||b.createdAt)));
   const pos=processing.findIndex(x=>x.transactionNo===tx.transactionNo);
   return {receivedCount:processing.length,position:pos>=0?pos+1:null,ahead:pos>0?pos:0};
 }
 function actionMessage(tx){
   if(tx.status==="FOR_COMPLIANCE")return tx.deficiencyNote||"TESDA Provincial Office requires compliance/additional documents.";
   if(tx.status==="AWAITING_HARD_COPY")return "Submit the required hard-copy billing package to TESDA Provincial Office and quote the transaction number.";
   if(["PAID","CLOSED"].includes(tx.status))return "Billing transaction completed.";
   return `Current processing office: ${(tx.physicalHolder||"PROVINCIAL OFFICE").replaceAll("_"," ")}. No school action is required unless a deficiency is issued.`;
 }
 return Object.freeze({stages,all,stageIndex,stage,actionMessage,queueInfo});
})();