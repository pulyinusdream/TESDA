"use strict";
TAESF.NTTC.CoCIEFormService=(()=>{
  const ELIGIBLE=new Set(Object.values(TAESF.NTTC.Constants.STATUS).filter(x=>![TAESF.NTTC.Constants.STATUS.DRAFT,TAESF.NTTC.Constants.STATUS.READY_FOR_ONLINE_SUBMISSION,TAESF.NTTC.Constants.STATUS.SUBMITTED_FOR_INITIAL_REVIEW,TAESF.NTTC.Constants.STATUS.UNDER_INITIAL_REVIEW,TAESF.NTTC.Constants.STATUS.WITH_DEFICIENCY,TAESF.NTTC.Constants.STATUS.COMPLIANCE_SUBMITTED,TAESF.NTTC.Constants.STATUS.UNDER_RE_REVIEW].includes(x)));
  function canGenerate(app){return !!app&&ELIGIBLE.has(app.status);}
  function evidenceRows(applicationId){const D=TAESF.NTTC.Constants.DOCUMENT_TYPES;return TAESF.NTTC.DocumentService.list(applicationId).filter(x=>x.documentType===D.IWER_EVIDENCE).map((x,i)=>{const review=TAESF.NTTC.ScreeningRepository?.byDocument?.(applicationId,x.documentId);return{tabCode:String(i+1).padStart(2,"0"),evidence:x.title||x.fileName||"IWER Evidence",fromDate:x.fromDate||"",toDate:x.toDate||"",modality:x.modality||"",estimatedHours:review?.hoursConfirmed?review.approvedEquivalentHours:(x.systemEquivalentHours||x.claimedHours||"")};});}
  function modalityLetter(code){return({PRE_SERVICE:"A",INDUSTRY_IMMERSION:"B",DTP_DTS:"C",TECHNICAL_CONSULTING:"D"})[code]||"";}
  function saveEndorser(applicationId,name){const app=TAESF.NTTC.ApplicationRepository.findById(applicationId);if(!app)throw new Error("Application not found.");app.applicationDetails=app.applicationDetails||{};app.applicationDetails.endorserName=String(name||"").trim();if(!app.applicationDetails.endorserName)throw new Error("TVI Administrator/President endorser name is required for Form A.");app.updatedAt=new Date().toISOString();app.version=Number(app.version||1)+1;TAESF.NTTC.ApplicationRepository.save(app);return app;}
  function url(applicationId){return `form-a.html?applicationId=${encodeURIComponent(applicationId)}`;}
  return Object.freeze({canGenerate,evidenceRows,modalityLetter,saveEndorser,url});
})();
