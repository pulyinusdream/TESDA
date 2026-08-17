"use strict";
TAESF.NTTC.ScreeningRepository=(()=>{
  const KEY="nttc.block4.screening";
  function all(){return TAESF.NTTC.LocalStorage.get(KEY)||[];}
  function save(row){const rows=all();const i=rows.findIndex(x=>x.screeningId===row.screeningId);if(i>=0)rows[i]=row;else rows.push(row);TAESF.NTTC.LocalStorage.set(KEY,rows);return row;}
  function byApplication(applicationId){return all().filter(x=>x.applicationId===applicationId);}
  function byDocument(applicationId,documentId){return all().find(x=>x.applicationId===applicationId&&x.documentId===documentId)||null;}
  return Object.freeze({all,save,byApplication,byDocument});
})();
