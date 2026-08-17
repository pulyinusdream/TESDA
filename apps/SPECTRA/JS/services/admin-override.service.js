"use strict";
NEXUS_SPECTRA.Services.AdminOverride=(()=>{
 function request(input){
   const errors=[];
   if(!input.module)errors.push("Module is required.");
   if(!input.requestType)errors.push("Request type is required.");
   if(!String(input.requestedBy||"").trim())errors.push("Requested by is required.");
   if(!String(input.reason||"").trim())errors.push("Reason/justification is required.");
   if(errors.length)return {ok:false,errors};
   const now=new Date().toISOString(),row={
     requestId:`OVR-${Date.now()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`,
     module:input.module,
     requestType:input.requestType,
     referenceType:input.referenceType||"",
     referenceNo:input.referenceNo||"",
     currentValue:input.currentValue??null,
     requestedValue:input.requestedValue??null,
     requestedBy:String(input.requestedBy).trim(),
     reason:String(input.reason).trim(),
     attachmentRef:input.attachmentRef||"",
     status:"PENDING_ADMIN_APPROVAL",
     requestedAt:now,
     reviewedBy:"",
     reviewedAt:"",
     decisionRemarks:""
   };
   NEXUS_SPECTRA.Repository.Admin.saveOverride(row);
   return {ok:true,row};
 }
 function decide(requestId,input){
   const row=NEXUS_SPECTRA.Repository.Admin.overrideRequests().find(x=>x.requestId===requestId);
   if(!row)return {ok:false,errors:["Override request not found."]};
   const errors=[];
   if(!String(input.reviewedBy||"").trim())errors.push("Head of Admin / approver is required.");
   if(!["APPROVED","REJECTED"].includes(input.decision))errors.push("Decision must be Approved or Rejected.");
   if(errors.length)return {ok:false,errors};
   row.status=input.decision;
   row.reviewedBy=String(input.reviewedBy).trim();
   row.reviewedAt=new Date().toISOString();
   row.decisionRemarks=String(input.remarks||"").trim();
   NEXUS_SPECTRA.Repository.Admin.saveOverride(row);
   NEXUS_SPECTRA.Repository.Admin.saveApproval({
     approvalId:`APR-${Date.now()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`,
     requestId:row.requestId,
     module:row.module,
     referenceNo:row.referenceNo,
     decision:row.status,
     approvedBy:row.reviewedBy,
     approvedAt:row.reviewedAt,
     remarks:row.decisionRemarks
   });
   return {ok:true,row};
 }
 function pending(){return NEXUS_SPECTRA.Repository.Admin.overrideRequests().filter(x=>x.status==="PENDING_ADMIN_APPROVAL").sort((a,b)=>(a.requestedAt||"").localeCompare(b.requestedAt||""));}
 function recent(){return NEXUS_SPECTRA.Repository.Admin.overrideRequests().sort((a,b)=>(b.requestedAt||"").localeCompare(a.requestedAt||"")).slice(0,20);}
 return Object.freeze({request,decide,pending,recent});
})();