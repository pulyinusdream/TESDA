"use strict";
TAESF.NTTC.App=(()=>{
 function initialize(){const root=document.getElementById("app");if(!root)throw new Error("NTTC app container not found.");const applicant=TAESF.NTTC.ApplicantService.current();if(applicant)TAESF.NTTC.ApplicantPortalController.show(applicant);else TAESF.NTTC.ApplicantController.showRegistration();console.info("[NTTC] Block 6 initialized",TAESF.NTTC.Constants.VERSION);}
 return Object.freeze({initialize});
})();
