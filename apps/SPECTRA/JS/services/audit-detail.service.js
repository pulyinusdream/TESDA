"use strict";
NEXUS_SPECTRA.Services.AuditDetail=(()=>{
 const norm=s=>String(s||"").trim().toUpperCase().replace(/\s+/g," ");
 function scholarKey(s){return norm(s.email)||norm(s.name);}
 function scholars(tx){return (tx.snapshot?.allowance?.scholars||[]).map(s=>({key:s.key||scholarKey(s),name:s.name,email:s.email,presentDays:s.presentDays,absentDays:s.absentDays,earned:s.earned,rate:s.rate,isReady:s.isReady}));}
 function days(tx,key){
   const reports=tx.snapshot?.attendanceReports||[],vals=tx.snapshot?.validations||[];
   const out=[];
   for(const r of reports){for(const s of (r.scholars||[])){if(scholarKey(s)!==key)continue;const v=vals.find(x=>x.attendanceImportId===r.attendanceImportId&&Number(x.scholarNo)===Number(s.no));out.push({reportId:r.attendanceImportId,reportNumber:r.reportNumber,date:r.attendanceDate,scholarNo:s.no,name:s.name,email:s.email,bsrsIn:s.bsrsTimeIn||"",bsrsOut:s.bsrsTimeOut||"",duration:s.bsrsDuration||"",finalIn:v?.finalTimeIn||s.bsrsTimeIn||"",finalOut:v?.finalTimeOut||s.bsrsTimeOut||"",finalStatus:v?.finalStatus||(s.attendanceStatus==="COMPLETE_BSRS"?"PRESENT_BSRS":"FOR_VALIDATION"),source:v?.source||(s.attendanceStatus==="COMPLETE_BSRS"?"BSRS":"")});}}
   return out.sort((a,b)=>String(a.date).localeCompare(String(b.date)));
 }
 function saveNote(transactionNo,stage,input){
   const existing=NEXUS_SPECTRA.Repository.AuditNotes.find(transactionNo,stage,input.reportId,input.scholarNo);
   const row={noteId:existing?.noteId||`NOTE-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,transactionNo,stage,reportId:input.reportId,reportNumber:input.reportNumber||"",attendanceDate:input.attendanceDate||"",scholarNo:Number(input.scholarNo),scholarName:input.scholarName||"",finding:input.finding||"NONE",remarks:String(input.remarks||"").trim(),reviewedBy:String(input.reviewedBy||"").trim(),updatedAt:new Date().toISOString()};
   return NEXUS_SPECTRA.Repository.AuditNotes.save(row);
 }
 return Object.freeze({scholars,days,saveNote,scholarKey});
})();