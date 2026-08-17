"use strict";
NEXUS_SAM.Modules.Handoff.Controller = (()=>{
 function refresh(){NEXUS_SAM.Modules.Handoff.View.render(NEXUS_SAM.Modules.Workflow.Controller.activeBatch());}
 async function submit(){
   const batchId=NEXUS_SAM.Modules.Workflow.Controller.activeBatch();
   if(!batchId){NEXUS_SAM.UI.Notification.warning("Billing not submitted.","Open a scholarship batch first.");return;}
   if(!confirm("Finalize this billing package? Attendance, validation, allowance, and report details will be frozen into the transaction snapshot."))return;
   const result=NEXUS_SAM.Modules.Handoff.Service.submit(batchId,"TSF_FULL");
   if(!result.ok){NEXUS_SAM.UI.Notification.warning("Billing package was not submitted.",result.errors?.[0]||"Resolve the remaining requirements.");refresh();return;}
   await NEXUS_SAM.Modules.Handoff.Documents.retag(batchId,result.row.transactionNo);NEXUS_SAM.UI.Notification.success("Billing package submitted.",`${result.row.transactionNo} created. Online documents were linked to the SPECTRA transaction. Print the school reports, attach the hard copies, and submit them to TESDA Provincial Office.`);
   refresh();NEXUS_SAM.Modules.Tracking?.Controller?.refresh?.();
 }
 function initialize(){document.getElementById("btnSubmitBilling")?.addEventListener("click",submit);refresh();NEXUS_SAM.Modules.Home?.Controller?.refresh?.();}
 return Object.freeze({initialize,refresh});
})();