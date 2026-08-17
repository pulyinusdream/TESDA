"use strict";
NEXUS_SAM.Modules.Attendance.Service = (()=>{
 const months={JANUARY:0,FEBRUARY:1,MARCH:2,APRIL:3,MAY:4,JUNE:5,JULY:6,AUGUST:7,SEPTEMBER:8,OCTOBER:9,NOVEMBER:10,DECEMBER:11};
 function parseBsrsDate(v){
   const m=(v||"").toUpperCase().match(/^([A-Z]+)\s+(\d{1,2}),\s*(\d{4})$/);if(!m||months[m[1]]===undefined)return null;
   return new Date(Number(m[3]),months[m[1]],Number(m[2]),12,0,0);
 }
 function reportWarnings(batch,parsed){
   const warnings=[], q=(parsed.qualification||"").toUpperCase(),bq=(batch.qualificationTitle||"").toUpperCase();
   if(!parsed.reportNumber)warnings.push({severity:"critical",code:"MISSING_REPORT_NUMBER",message:"BSRS Report Number was not read. Verify the PDF before using it for allowance."});
   if(!parsed.attendanceDate)warnings.push({severity:"critical",code:"MISSING_ATTENDANCE_DATE",message:"Attendance date was not read. This report cannot be placed correctly in the training timeline."});
   if(q&&bq&&!q.includes(bq)&&!bq.includes(q))warnings.push({severity:"critical",code:"QUALIFICATION_MISMATCH",message:`PDF qualification “${parsed.qualification}” does not match batch qualification “${batch.qualificationTitle}”.`});
   if(parsed.tvi&&batch.tvi&&!parsed.tvi.toUpperCase().includes(batch.tvi.toUpperCase())&&!batch.tvi.toUpperCase().includes(parsed.tvi.toUpperCase()))warnings.push({severity:"critical",code:"TVI_MISMATCH",message:"PDF TVET Provider does not match the selected batch TVET Provider."});
   const dt=parseBsrsDate(parsed.attendanceDate),start=batch.trainingStartDate?new Date(`${batch.trainingStartDate}T12:00:00`):null,end=batch.trainingEndDate?new Date(`${batch.trainingEndDate}T12:00:00`):null;
   if(dt&&start&&end&&(dt<start||dt>end))warnings.push({severity:"critical",code:"OUTSIDE_TRAINING_PERIOD",message:`Attendance date ${parsed.attendanceDate} is outside the batch training period ${batch.trainingStartDate} to ${batch.trainingEndDate}.`});
   if(parsed.scholars.length!==Number(batch.numberOfSlots))warnings.push({severity:"critical",code:"SCHOLAR_COUNT_MISMATCH",message:`PDF contains ${parsed.scholars.length} scholar rows while the batch has ${batch.numberOfSlots} allocated slots.`});
   if(parsed.diagnostics?.duplicateScholarNos?.length)warnings.push({severity:"critical",code:"DUPLICATE_SCHOLAR_ROWS",message:`Duplicate scholar number(s) detected in the PDF: ${parsed.diagnostics.duplicateScholarNos.join(", ")}.`});
   if(parsed.diagnostics?.duplicateEmails?.length)warnings.push({severity:"critical",code:"DUPLICATE_EMAILS",message:`Duplicate scholar email(s) detected: ${parsed.diagnostics.duplicateEmails.join(", ")}.`});
   return warnings;
 }
 async function importFile(batchId,file){
   if(!batchId)return {ok:false,errors:["Select a scholarship batch before importing attendance."]};
   if(!file||file.type!=="application/pdf")return {ok:false,errors:["Only BSRS PDF files can be imported."]};
   const batch=NEXUS_SAM.Modules.Batch.Service.get(batchId);if(!batch)return {ok:false,errors:["Selected scholarship batch was not found."]};
   try{
     const extracted=await NEXUS_SAM.Services.Pdf.extract(file);const parsed=NEXUS_SAM.Modules.Attendance.BsrsParser.parse(extracted);
     if(parsed.reportNumber&&parsed.attendanceDate&&NEXUS_SAM.Modules.Attendance.Repository.duplicate(batchId,parsed.reportNumber,parsed.attendanceDate))return {ok:false,errors:[`BSRS Report ${parsed.reportNumber} for ${parsed.attendanceDate} was already imported to this batch.`]};
     const warnings=reportWarnings(batch,parsed);const sameDate=NEXUS_SAM.Modules.Attendance.Repository.byDate(batchId,parsed.attendanceDate);if(parsed.attendanceDate&&sameDate.length)warnings.push({severity:"critical",code:"DUPLICATE_ATTENDANCE_DATE",message:`Another BSRS report is already attached to ${parsed.attendanceDate}. Verify whether this is a duplicate or replacement report.`});
     const row=NEXUS_SAM.Modules.Attendance.Model.report({...parsed,batchId,fileName:file.name,fileSize:file.size,pageCount:extracted.pageCount,warnings});
     NEXUS_SAM.Modules.Attendance.Repository.save(row);return {ok:true,row,warnings:warnings.map(w=>w.message)};
   }catch(e){console.error("BSRS import failed",e);return {ok:false,errors:[e.message||"Unable to import the BSRS attendance PDF."]};}
 }
 function reports(batchId=""){return batchId?NEXUS_SAM.Modules.Attendance.Repository.byBatch(batchId):NEXUS_SAM.Modules.Attendance.Repository.all();}
 function remove(id){NEXUS_SAM.Modules.Attendance.Repository.remove(id);}
 function reportState(report){
   const pending=report.scholars.filter(s=>{const val=NEXUS_SAM.Modules.Validation?.Repository?.find(report.attendanceImportId,s.no);const timeIssue=NEXUS_SAM.Modules.Allowance?.Service?.timeIssue?.(s.bsrsTimeIn,s.bsrsTimeOut)||"";return (!val)&&(s.attendanceStatus!=="COMPLETE_BSRS"||!!timeIssue);}).length;
   const critical=(report.warnings||[]).filter(w=>w.severity==="critical").length;
   const warning=(report.warnings||[]).filter(w=>w.severity==="warning").length;
   if(critical)return {key:"CRITICAL",label:"Critical Review",kind:"danger",pending,critical,warning};
   if(pending)return {key:"VALIDATION",label:"Needs Validation",kind:"warning",pending,critical,warning};
   if(warning)return {key:"WARNING",label:"Review Notice",kind:"warning",pending,critical,warning};
   return {key:"READY",label:"Attendance Ready",kind:"success",pending,critical,warning};
 }
 function summary(batchId=""){
   if(!batchId)return {reports:0,attendanceRecords:0,complete:0,exceptions:0,criticalReports:0,readyReports:0};
   const rs=reports(batchId);const scholars=rs.flatMap(r=>r.scholars);
   const exceptions=scholars.filter(s=>s.attendanceStatus!=="COMPLETE_BSRS").length;
   const states=rs.map(reportState);
   return {reports:rs.length,attendanceRecords:scholars.length,complete:scholars.length-exceptions,exceptions,criticalReports:states.filter(x=>x.key==="CRITICAL").length,readyReports:states.filter(x=>x.key==="READY").length};
 }
 return Object.freeze({importFile,reports,remove,summary,reportState,parseBsrsDate,reportWarnings});
})();