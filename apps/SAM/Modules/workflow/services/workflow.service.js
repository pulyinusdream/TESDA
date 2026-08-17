"use strict";
NEXUS_SAM.Modules.Workflow = NEXUS_SAM.Modules.Workflow || {};
NEXUS_SAM.Modules.Workflow.Service = (()=>{
 const KEY="NEXUS-SAM:activeBatchId";
 function activeBatchId(){return localStorage.getItem(KEY)||"";}
 function setActiveBatchId(id){if(id)localStorage.setItem(KEY,id);else localStorage.removeItem(KEY);}
 function status(batchId=activeBatchId()){
   const batch=NEXUS_SAM.Modules.Batch.Service.get(batchId);
   if(!batch)return {activeBatchId:"",batch:null,steps:{1:{ready:false,label:"Batch Setup",message:"Create or open a scholarship batch first."},2:{ready:false,label:"Attendance Import",message:"Complete Step 1 first."},3:{ready:false,label:"Attendance Validation",message:"Complete Step 2 first."},4:{ready:false,label:"Allowance Computation",message:"Complete Step 3 first."},5:{ready:false,label:"School Reports",message:"Complete Step 4 first."}},maxStep:1};
   const attendance=NEXUS_SAM.Modules.Attendance.Service.summary(batchId);
   const reports=NEXUS_SAM.Modules.Attendance.Service.reports(batchId);
   const uniqueDates=new Set(reports.map(r=>r.attendanceDate).filter(Boolean));
   const expected=Number(batch.approvedTrainingDays||0);
   const critical=reports.filter(r=>(r.warnings||[]).some(w=>w.severity==="critical")).length;
   const importReady=expected>0&&uniqueDates.size===expected&&critical===0;
   const validation=NEXUS_SAM.Modules.Validation.Service.summary(batchId);
   const valReady=importReady&&validation.ready;
   const allowance=NEXUS_SAM.Modules.Allowance.Service.build(batchId);
   const allowReady=valReady&&!!allowance.summary?.ready;
   const steps={
     1:{ready:true,label:"Batch Setup",message:"Batch setup is complete."},
     2:{ready:importReady,label:"Attendance Import",message:importReady?`${uniqueDates.size}/${expected} attendance days imported with no critical report issue.`:`Import all ${expected} approved training days and resolve any critical report-level issue. Current: ${uniqueDates.size}/${expected}; critical reports: ${critical}.`},
     3:{ready:valReady,label:"Attendance Validation",message:valReady?"All attendance exceptions are resolved.":`Resolve all attendance exceptions. Pending: ${validation.pending||0}.`},
     4:{ready:allowReady,label:"Allowance Computation",message:allowReady?"Allowance computation is payroll-ready.":"Resolve all remaining attendance/time/report issues before finalizing allowance."},
     5:{ready:allowReady,label:"School Reports",message:allowReady?"Summary of Attendance and Billing Statement are ready for generation.":"Complete allowance computation first."}
   };
   let maxStep=1; if(steps[2].ready)maxStep=3; else maxStep=2; if(steps[3].ready)maxStep=4; if(steps[4].ready)maxStep=5;
   return {activeBatchId:batchId,batch,steps,maxStep,attendance,validation,allowance,critical,expected,uniqueDates:uniqueDates.size};
 }
 return Object.freeze({activeBatchId,setActiveBatchId,status});
})();