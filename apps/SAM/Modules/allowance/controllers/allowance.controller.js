"use strict";
NEXUS_SAM.Modules.Allowance.Controller = (()=>{
 function id(){return document.getElementById("allowanceBatchId").value;}
 function refresh(){const batches=NEXUS_SAM.Modules.Batch.Service.list();NEXUS_SAM.Modules.Allowance.View.batches(batches);const result=NEXUS_SAM.Modules.Allowance.Service.build(id());NEXUS_SAM.Modules.Allowance.View.summary(result);NEXUS_SAM.Modules.Allowance.View.table(result);NEXUS_SAM.Modules.Allowance.View.payroll(result);}
 function initialize(){document.getElementById("allowanceBatchId").addEventListener("change",refresh);refresh();}
 return Object.freeze({initialize,refresh});
})();