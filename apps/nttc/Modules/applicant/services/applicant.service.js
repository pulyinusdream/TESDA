"use strict";
TAESF.NTTC.ApplicantService = (()=>{
  const SESSION_KEY="nttc.block2.currentApplicantId";
  function register(data){
    const result=TAESF.NTTC.ApplicantValidator.validate(data);
    if(!result.valid) throw new Error(result.errors.join("\n"));
    if(TAESF.NTTC.ApplicantRepository.findByEmail(data.email)) throw new Error("An applicant account already exists for this email address.");
    const model=new TAESF.NTTC.ApplicantModel(data);
    TAESF.NTTC.ApplicantRepository.save(model);
    TAESF.NTTC.LocalStorage.set(SESSION_KEY,model.applicantId);
    return model;
  }
  function current(){ const id=TAESF.NTTC.LocalStorage.get(SESSION_KEY); return id?TAESF.NTTC.ApplicantRepository.findById(id):null; }
  function useApplicant(applicantId){ if(!TAESF.NTTC.ApplicantRepository.findById(applicantId)) throw new Error("Applicant not found."); TAESF.NTTC.LocalStorage.set(SESSION_KEY,applicantId); return current(); }
  function updateProfile(applicantId,patch){
    const existing=TAESF.NTTC.ApplicantRepository.findById(applicantId);
    if(!existing) throw new Error("Applicant not found.");
    ["placeOfBirth","heightM","weightKg","telephone","institutionAddress","sex","civilStatus","highestEducation","governmentIdTypeNo"].forEach(k=>{if(Object.prototype.hasOwnProperty.call(patch,k))existing[k]=String(patch[k]||"").trim();});
    return TAESF.NTTC.ApplicantRepository.save(existing);
  }
  function clearSession(){ TAESF.NTTC.LocalStorage.remove(SESSION_KEY); }
  return Object.freeze({register,current,useApplicant,updateProfile,clearSession});
})();
