"use strict";
TAESF.NTTC.ApplicantPortalController=(()=>{
  function show(applicant){
    const apps=TAESF.NTTC.ApplicationService.forApplicant(applicant.applicantId);
    document.getElementById("app").innerHTML=TAESF.NTTC.ApplicantPortalView.render(applicant,apps);
    document.getElementById("newApplication")?.addEventListener("click",()=>TAESF.NTTC.ApplicationController.startNewApplication(applicant));
    document.querySelectorAll(".open-application").forEach(btn=>btn.addEventListener("click",()=>TAESF.NTTC.ApplicationController.openApplication(applicant,btn.dataset.appId)));
    document.getElementById("logoutApplicant")?.addEventListener("click",()=>{TAESF.NTTC.ApplicantService.clearSession();TAESF.NTTC.App.initialize();});
  }
  return Object.freeze({show});
})();
