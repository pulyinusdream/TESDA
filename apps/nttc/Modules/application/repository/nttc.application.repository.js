"use strict";
TAESF.NTTC.ApplicationRepository = (()=>{
  const KEY="nttc.block2.applications";
  function all(){return TAESF.NTTC.LocalStorage.get(KEY)||[];}
  function save(app){const rows=all(); const i=rows.findIndex(x=>x.applicationId===app.applicationId); app.updatedAt=new Date().toISOString(); if(i>=0) rows[i]=app; else rows.push(app); TAESF.NTTC.LocalStorage.set(KEY,rows); return app;}
  function findById(id){return all().find(x=>x.applicationId===id)||null;}
  function byApplicant(applicantId){return all().filter(x=>x.applicantId===applicantId).sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt)));}
  return Object.freeze({all,save,findById,byApplicant});
})();
