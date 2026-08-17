"use strict";
NEXUS_SAM.Modules.Validation.Repository = (()=>{
  const KEY="attendanceValidations";
  const all=()=>NEXUS_SAM.Services.Storage.load(KEY,[]);
  const keyOf=(attendanceImportId,scholarNo)=>`${attendanceImportId}::${Number(scholarNo||0)}`;
  function save(row){
    const rows=all(), key=keyOf(row.attendanceImportId,row.scholarNo), idx=rows.findIndex(r=>keyOf(r.attendanceImportId,r.scholarNo)===key);
    if(idx>=0) rows[idx]=row; else rows.push(row);
    NEXUS_SAM.Services.Storage.save(KEY,rows); return row;
  }
  function find(attendanceImportId,scholarNo){return all().find(r=>keyOf(r.attendanceImportId,r.scholarNo)===keyOf(attendanceImportId,scholarNo))||null;}
  function byBatch(batchId){return all().filter(r=>r.batchId===batchId);}
  function remove(attendanceImportId,scholarNo){NEXUS_SAM.Services.Storage.save(KEY,all().filter(r=>keyOf(r.attendanceImportId,r.scholarNo)!==keyOf(attendanceImportId,scholarNo)));}
  return Object.freeze({all,save,find,byBatch,remove});
})();
