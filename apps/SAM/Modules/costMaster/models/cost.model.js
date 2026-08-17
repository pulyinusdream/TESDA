"use strict";
NEXUS_SAM.Modules.CostMaster = NEXUS_SAM.Modules.CostMaster || {};
NEXUS_SAM.Modules.CostMaster.Model = Object.freeze({
  normalize(row){ return {...row, trainingHours:Number(row.trainingHours||0), trainingDays:Number(row.trainingDays||0), tsfRate:Number(row.tsfRate||0), maximumTsf:Number(row.maximumTsf||0)}; }
});
