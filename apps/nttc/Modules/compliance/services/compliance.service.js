"use strict";
TAESF.NTTC.ComplianceService=(()=>{
  const S=TAESF.NTTC.Constants.STATUS;
  function pending(applicationId){return TAESF.NTTC.DeficiencyRepository.openForApplication(applicationId);}
  async function uploadAgainstDeficiency(applicationId,deficiencyId,file){
    const app=TAESF.NTTC.ApplicationService.get(applicationId);
    if(app.status!==S.WITH_DEFICIENCY)throw new Error("This application is not currently open for applicant compliance.");
    const deficiency=TAESF.NTTC.DeficiencyRepository.findById(deficiencyId);
    if(!deficiency||deficiency.applicationId!==applicationId)throw new Error("Deficiency not found for this application.");
    const source=TAESF.NTTC.DocumentRepository.findById(deficiency.documentId);
    const uploaded=await TAESF.NTTC.DocumentService.uploadCompliance(applicationId,deficiency,source,file);
    TAESF.NTTC.DeficiencyRepository.markComplied(deficiencyId,uploaded.documentId);
    return uploaded;
  }
  function readyToSubmit(applicationId){
    const rows=pending(applicationId);
    const remaining=rows.filter(x=>x.status!=="COMPLIED_PENDING_REVIEW");
    return {ready:rows.length>0&&remaining.length===0,total:rows.length,remaining:remaining.length};
  }
  function submit(applicationId){
    const app=TAESF.NTTC.ApplicationService.get(applicationId);
    if(app.status!==S.WITH_DEFICIENCY)throw new Error("The application is not currently open for compliance submission.");
    const check=readyToSubmit(applicationId);
    if(!check.ready)throw new Error("Upload the required compliance document for every open finding before resubmitting.");
    return TAESF.NTTC.ApplicationService.changeStatus(applicationId,S.COMPLIANCE_SUBMITTED);
  }
  return Object.freeze({pending,uploadAgainstDeficiency,readyToSubmit,submit});
})();
