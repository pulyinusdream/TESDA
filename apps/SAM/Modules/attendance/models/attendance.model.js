"use strict";
NEXUS_SAM.Modules.Attendance = NEXUS_SAM.Modules.Attendance || {};
NEXUS_SAM.Modules.Attendance.Model = (()=>{
  const clean=v=>(v??"").toString().trim();
  function status(timeIn,timeOut){
    const i=clean(timeIn),o=clean(timeOut);
    if(i&&o)return "COMPLETE_BSRS";
    if(!i&&o)return "MISSING_TIME_IN";
    if(i&&!o)return "MISSING_TIME_OUT";
    return "NO_BSRS_LOG";
  }
  function scholar(input={}){
    return Object.freeze({
      no:Number(input.no||0),name:clean(input.name),address:clean(input.address),contact:clean(input.contact),email:clean(input.email),
      bsrsTimeIn:clean(input.timeIn),bsrsTimeOut:clean(input.timeOut),bsrsDuration:clean(input.duration),
      attendanceStatus:status(input.timeIn,input.timeOut),validationStatus:status(input.timeIn,input.timeOut)==="COMPLETE_BSRS"?"VALIDATED":"FOR_VALIDATION"
    });
  }
  function report(input={}){
    const now=new Date().toISOString();
    return Object.freeze({
      attendanceImportId:input.attendanceImportId||`SAM-ATT-${Date.now()}-${Math.random().toString(36).slice(2,7).toUpperCase()}`,
      batchId:clean(input.batchId),fileName:clean(input.fileName),fileSize:Number(input.fileSize||0),pageCount:Number(input.pageCount||0),
      reportNumber:clean(input.reportNumber),attendanceDate:clean(input.attendanceDate),sessionStart:clean(input.sessionStart),sessionEnd:clean(input.sessionEnd),
      scholarshipProgram:clean(input.scholarshipProgram),tvi:clean(input.tvi),qualification:clean(input.qualification),trainer:clean(input.trainer),nttcNo:clean(input.nttcNo),
      trainingStart:clean(input.trainingStart),trainingEnd:clean(input.trainingEnd),approvedDailyDuration:clean(input.approvedDailyDuration),trainingLocation:clean(input.trainingLocation),
      generatedBy:clean(input.generatedBy),generatedAt:clean(input.generatedAt),scholars:(input.scholars||[]).map(s=>scholar(s)),
      warnings:[...(input.warnings||[])],diagnostics:{...(input.diagnostics||{})},
      importedAt:input.importedAt||now,source:"BSRS_PDF"
    });
  }
  return Object.freeze({scholar,report,status});
})();