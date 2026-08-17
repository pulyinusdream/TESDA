"use strict";
NEXUS_SAM.Modules.Validation = NEXUS_SAM.Modules.Validation || {};
NEXUS_SAM.Modules.Validation.Model = (()=>{
  const clean=v=>(v??"").toString().trim();
  function record(input={}){
    return {
      validationId: input.validationId || `SAM-VAL-${Date.now()}-${Math.random().toString(36).slice(2,7).toUpperCase()}`,
      attendanceImportId: clean(input.attendanceImportId),
      batchId: clean(input.batchId),
      scholarNo: Number(input.scholarNo||0),
      scholarName: clean(input.scholarName),
      resolution: clean(input.resolution),
      source: clean(input.source),
      manualTimeIn: clean(input.manualTimeIn),
      manualTimeOut: clean(input.manualTimeOut),
      finalTimeIn: clean(input.finalTimeIn),
      finalTimeOut: clean(input.finalTimeOut),
      finalStatus: clean(input.finalStatus),
      reason: clean(input.reason),
      supportingReference: clean(input.supportingReference),
      validatedBy: clean(input.validatedBy),
      validatedAt: input.validatedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
  return Object.freeze({record});
})();
