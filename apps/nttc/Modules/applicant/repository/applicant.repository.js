"use strict";
TAESF.NTTC.ApplicantRepository = (()=>{
  const KEY="nttc.block2.applicants";
  function all(){ return TAESF.NTTC.LocalStorage.get(KEY)||[]; }
  function findById(id){ return all().find(x=>x.applicantId===id)||null; }
  function findByEmail(email){ return all().find(x=>String(x.email||"").toLowerCase()===String(email||"").toLowerCase())||null; }
  function save(applicant){
    const rows=all(); const i=rows.findIndex(x=>x.applicantId===applicant.applicantId);
    applicant.updatedAt=new Date().toISOString();
    if(i>=0) rows[i]=applicant; else rows.push(applicant);
    TAESF.NTTC.LocalStorage.set(KEY,rows); return applicant;
  }
  return Object.freeze({all,findById,findByEmail,save});
})();
