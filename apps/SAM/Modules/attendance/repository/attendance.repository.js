"use strict";
NEXUS_SAM.Modules.Attendance.Repository = (()=>{
 const KEY="attendanceReports";
 function all(){return NEXUS_SAM.Services.Storage.load(KEY,[]);} 
 function save(row){const rows=all();rows.push(row);NEXUS_SAM.Services.Storage.save(KEY,rows);return row;}
 function remove(id){NEXUS_SAM.Services.Storage.save(KEY,all().filter(r=>r.attendanceImportId!==id));}
 function byBatch(batchId){return all().filter(r=>r.batchId===batchId).sort((a,b)=>(a.attendanceDate||"").localeCompare(b.attendanceDate||""));}
 function duplicate(batchId,reportNumber,attendanceDate){return all().find(r=>r.batchId===batchId&&r.reportNumber===reportNumber&&r.attendanceDate===attendanceDate)||null;}
 function byDate(batchId,attendanceDate){return all().filter(r=>r.batchId===batchId&&attendanceDate&&r.attendanceDate===attendanceDate);}
 return Object.freeze({all,save,remove,byBatch,duplicate,byDate});
})();