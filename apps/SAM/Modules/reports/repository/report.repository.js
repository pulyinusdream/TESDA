"use strict";
NEXUS_SAM.Modules.Reports = NEXUS_SAM.Modules.Reports || {};
NEXUS_SAM.Modules.Reports.Repository = (()=>{
 const KEY="reportProfiles";
 function all(){return NEXUS_SAM.Services.Storage.load(KEY,{});}
 function get(batchId){return all()[batchId]||null;}
 function save(batchId,profile){const rows=all();rows[batchId]={...profile,batchId,updatedAt:new Date().toISOString()};NEXUS_SAM.Services.Storage.save(KEY,rows);return rows[batchId];}
 return Object.freeze({get,save});
})();