"use strict";
TAESF.NTTC.QualificationService = (()=>{
  function list(){ return TAESF.NTTC.QualificationRepository.active().slice().sort((a,b)=>a.qualificationTitle.localeCompare(b.qualificationTitle)); }
  function get(code){ const q=TAESF.NTTC.QualificationRepository.find(code); if(!q||q.active===false) throw new Error("Selected qualification is not available."); return q; }
  return Object.freeze({list,get});
})();
