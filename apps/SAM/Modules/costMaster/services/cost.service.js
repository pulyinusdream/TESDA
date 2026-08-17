"use strict";
NEXUS_SAM.Modules.CostMaster.Service = (() => {
 function list(filters={}){ let rows=NEXUS_SAM.Modules.CostMaster.Repository.getAll(); if(filters.program) rows=rows.filter(r=>r.scholarshipPrograms.includes(filters.program)); if(filters.implementationType) rows=rows.filter(r=>r.implementationType===filters.implementationType); if(filters.search){const q=filters.search.toLowerCase();rows=rows.filter(r=>[r.qualificationTitle,r.qualificationCode,r.socCode,r.sector].some(v=>String(v||"").toLowerCase().includes(q)));} return rows; }
 function get(id){return NEXUS_SAM.Modules.CostMaster.Repository.getById(id);}
 function verifyTsf(row){return Number((row.trainingDays*row.tsfRate).toFixed(2))===Number(row.maximumTsf);}
 return Object.freeze({list,get,verifyTsf});
})();
