"use strict";
TAESF.NTTC.HardcopyRepository=(()=>{
  const KEY="nttc.block7.hardcopy.records";
  function all(){return TAESF.NTTC.LocalStorage.get(KEY)||[];}
  function byApplication(applicationId){return all().find(x=>x.applicationId===applicationId)||null;}
  function save(record){const rows=all();const i=rows.findIndex(x=>x.applicationId===record.applicationId);record.updatedAt=new Date().toISOString();if(i>=0)rows[i]=record;else rows.push(record);TAESF.NTTC.LocalStorage.set(KEY,rows);return record;}
  return Object.freeze({all,byApplication,save});
})();
