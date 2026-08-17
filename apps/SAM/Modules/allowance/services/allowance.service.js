"use strict";
NEXUS_SAM.Modules.Allowance.Service = (()=>{
 const money=n=>Math.round((Number(n)||0)*100)/100;
 const norm=s=>(s||"").toString().trim().toUpperCase().replace(/\s+/g," ");
 const keyOf=s=>norm(s.email)||norm(s.name);
 function parseTime(v){
   const m=(v||"").match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);if(!m)return null;
   let h=Number(m[1])%12;if(m[3].toUpperCase()==="PM")h+=12;return h*60+Number(m[2]);
 }
 function timeIssue(inTime,outTime){
   const a=parseTime(inTime),b=parseTime(outTime);if(a===null||b===null)return "";
   if(b<a)return "TIME_OUT_BEFORE_TIME_IN";
   if(b===a)return "ZERO_DURATION";
   return "";
 }
 function build(batchId){
   const batch=NEXUS_SAM.Modules.Batch.Service.get(batchId);
   if(!batch)return {batch:null,rows:[],summary:{},issues:["Select a scholarship batch."]};
   const reports=NEXUS_SAM.Modules.Attendance.Repository.byBatch(batchId);
   const expectedDays=Number(batch.approvedTrainingDays||0),rate=Number(batch.tsfRate||0),maxTsf=Number(batch.maximumTsf||0);
   const map=new Map(),issues=[];
   const criticalReports=reports.filter(r=>(r.warnings||[]).some(w=>w.severity==="critical"));
   const dated=reports.map(r=>r.attendanceDate).filter(Boolean);
   const uniqueReportDates=new Set(dated);
   const duplicateDates=[...new Set(dated.filter((d,i)=>dated.indexOf(d)!==i))];
   reports.forEach(report=>{
     report.scholars.forEach(s=>{
       const key=keyOf(s);if(!key)return;
       if(!map.has(key))map.set(key,{key,name:s.name,email:s.email,days:[],presentDays:0,absentDays:0,pendingDays:0,reviewDays:0});
       const row=map.get(key),val=NEXUS_SAM.Modules.Validation.Repository.find(report.attendanceImportId,s.no);
       const finalIn=val?.finalTimeIn||s.bsrsTimeIn||"",finalOut=val?.finalTimeOut||s.bsrsTimeOut||"";
       let status="",issue="";
       if(val?.finalStatus==="ABSENT"){status="ABSENT";}
       else if(s.attendanceStatus!=="COMPLETE_BSRS"&&!val){status="PENDING_VALIDATION";}
       else{
         issue=timeIssue(finalIn,finalOut);
         status=issue?"REVIEW":"PRESENT";
       }
       row.days.push({date:report.attendanceDate,reportId:report.attendanceImportId,reportNumber:report.reportNumber,scholarNo:s.no,status,issue,finalIn,finalOut,source:val?.source||(s.attendanceStatus==="COMPLETE_BSRS"?"BSRS":"")});
       if(status==="PRESENT")row.presentDays++;else if(status==="ABSENT")row.absentDays++;else if(status==="PENDING_VALIDATION")row.pendingDays++;else row.reviewDays++;
     });
   });
   const rows=[...map.values()].map(r=>{
     const accounted=r.presentDays+r.absentDays+r.pendingDays+r.reviewDays;
     const missingDays=Math.max(0,expectedDays-accounted);
     const dayProgress=expectedDays?Math.min(100,(r.presentDays/expectedDays)*100):0;
     const earned=money(Math.min(r.presentDays,expectedDays)*rate);
     const absenceDeduction=money(Math.min(r.absentDays,expectedDays)*rate);
     const unresolvedDays=r.pendingDays+r.reviewDays+missingDays;
     const unresolvedAmount=money(unresolvedDays*rate);
     const isReady=unresolvedDays===0&&criticalReports.length===0&&uniqueReportDates.size>=expectedDays&&!duplicateDates.length;
     let tranche="NOT YET ELIGIBLE";
     if(dayProgress>=80)tranche="80% MILESTONE REACHED";
     else if(dayProgress>=20)tranche="20% MILESTONE REACHED";
     return NEXUS_SAM.Modules.Allowance.Model.scholar({...r,expectedDays,missingDays,dayProgress,rate,maxTsf,earned,absenceDeduction,unresolvedDays,unresolvedAmount,isReady,tranche});
   }).sort((a,b)=>a.name.localeCompare(b.name));
   if(uniqueReportDates.size<expectedDays)issues.push(`${expectedDays-uniqueReportDates.size} dated attendance report day(s) are still missing based on the qualification's ${expectedDays} approved training days.`);
   if(duplicateDates.length)issues.push(`Duplicate attendance date(s) detected: ${duplicateDates.join(", ")}.`);
   if(criticalReports.length)issues.push(`${criticalReports.length} imported report(s) have critical data issues and must be reviewed before payroll can be finalized.`);
   const pending=rows.reduce((n,r)=>n+r.pendingDays,0),review=rows.reduce((n,r)=>n+r.reviewDays,0),missing=rows.reduce((n,r)=>n+r.missingDays,0);
   const projected=money(rows.reduce((n,r)=>n+r.earned,0)),maxBatch=money(rows.length*maxTsf);
   return {batch,reports,rows,issues,summary:{scholars:rows.length,expectedDays,reports:uniqueReportDates.size,pending,review,missing,projected,maxBatch,ready:rows.length>0&&rows.every(r=>r.isReady)}};
 }
 return Object.freeze({build,keyOf,parseTime,timeIssue});
})();