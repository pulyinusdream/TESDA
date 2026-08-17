"use strict";
TAESF.NTTC.DeficiencyRepository=(()=>{
  const KEY="nttc.block4.deficiencies";
  function all(){return TAESF.NTTC.LocalStorage.get(KEY)||[];}
  function save(row){const rows=all();const i=rows.findIndex(x=>x.deficiencyId===row.deficiencyId);if(i>=0)rows[i]=row;else rows.push(row);TAESF.NTTC.LocalStorage.set(KEY,rows);return row;}
  function findById(deficiencyId){return all().find(x=>x.deficiencyId===deficiencyId)||null;}
  function byApplication(applicationId){return all().filter(x=>x.applicationId===applicationId).sort((a,b)=>String(b.issuedAt).localeCompare(String(a.issuedAt)));}
  function openForApplication(applicationId){return byApplication(applicationId).filter(x=>["OPEN","COMPLIED_PENDING_REVIEW"].includes(x.status));}
  function markComplied(deficiencyId,complianceDocumentId){const row=findById(deficiencyId);if(!row)throw new Error("Deficiency not found.");row.status="COMPLIED_PENDING_REVIEW";row.complianceDocumentId=complianceDocumentId;row.compliedAt=new Date().toISOString();return save(row);}
  function close(deficiencyId,actor){const row=findById(deficiencyId);if(!row)throw new Error("Deficiency not found.");row.status="CLOSED";row.closedAt=new Date().toISOString();row.closedBy=actor||"CAC FOCAL";return save(row);}
  return Object.freeze({all,save,findById,byApplication,openForApplication,markComplied,close});
})();
