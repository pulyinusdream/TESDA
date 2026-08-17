"use strict";
NEXUS_SPECTRA.Controllers.Admin=(()=>{
 function refresh(){NEXUS_SPECTRA.Views.Admin.render();}
 function decide(id,decision){
   const reviewedBy=prompt("Head of Admin / Approver name:");
   if(reviewedBy===null)return;
   const remarks=prompt("Decision remarks / conditions:",decision==="APPROVED"?"Approved":"Rejected")||"";
   const r=NEXUS_SPECTRA.Services.AdminOverride.decide(id,{decision,reviewedBy,remarks});
   if(!r.ok){NEXUS_SPECTRA.Views.App.notify(r.errors[0],"error");return;}
   NEXUS_SPECTRA.Views.App.notify(`Override request ${decision.toLowerCase()}.`,"success");refresh();
 }
 function click(e){const a=e.target.closest("[data-admin-approve]");if(a)return decide(a.dataset.adminApprove,"APPROVED");const r=e.target.closest("[data-admin-reject]");if(r)return decide(r.dataset.adminReject,"REJECTED");}
 function initialize(){document.getElementById("adminOverrideQueue")?.addEventListener("click",click);refresh();}
 return Object.freeze({initialize,refresh});
})();