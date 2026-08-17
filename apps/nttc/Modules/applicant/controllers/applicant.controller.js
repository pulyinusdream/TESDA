"use strict";
TAESF.NTTC.ApplicantController = (()=>{
  function showRegistration(){
    document.getElementById("app").innerHTML=TAESF.NTTC.ApplicantRegistrationView.render();
    const form=document.getElementById("applicantRegistrationForm");
    form.addEventListener("submit",e=>{e.preventDefault();const data=Object.fromEntries(new FormData(form).entries());try{const applicant=TAESF.NTTC.ApplicantService.register(data);TAESF.NTTC.ApplicationController.startNewApplication(applicant);}catch(err){const m=document.getElementById("registrationMessage");m.hidden=false;m.className="message error";m.textContent=err.message;}});
  }
  return Object.freeze({showRegistration});
})();
