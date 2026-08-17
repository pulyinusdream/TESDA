"use strict";
NEXUS_SAM.Modules.CostMaster.Repository = (() => {
 const KEY="cost_master";
 function seedIfEmpty(){ let rows=NEXUS_SAM.Services.Storage.load(KEY,[]); if(!Array.isArray(rows)||rows.length===0){ rows=NEXUS_SAM.Data.CostMasterSeed.map(NEXUS_SAM.Modules.CostMaster.Model.normalize); NEXUS_SAM.Services.Storage.save(KEY,rows);} return rows; }
 function getAll(){return seedIfEmpty();}
 function getById(id){return getAll().find(r=>r.id===id)||null;}
 return Object.freeze({seedIfEmpty,getAll,getById});
})();
