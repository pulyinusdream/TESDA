"use strict";
NEXUS_SAM.Modules.Handoff.DocumentController=(()=>{
 const batchId=()=>NEXUS_SAM.Modules.Workflow.Controller.activeBatch();
 async function upload(){try{const file=document.getElementById("onlineDocumentFile").files[0],type=document.getElementById("onlineDocumentType").value,remarks=document.getElementById("onlineDocumentRemarks").value;const row=await NEXUS_SAM.Modules.Handoff.Documents.upload(batchId(),file,type,remarks);document.getElementById("onlineDocumentFile").value="";document.getElementById("onlineDocumentRemarks").value="";NEXUS_SAM.UI.Notification.success("Supporting document uploaded.",row.fileName);refresh();}catch(e){NEXUS_SAM.UI.Notification.error("Document upload failed.",e.message);}}
 async function click(e){const o=e.target.closest("[data-doc-open]");if(o)return NEXUS_SAM.Modules.Handoff.Documents.open(o.dataset.docOpen);const r=e.target.closest("[data-doc-remove]");if(r&&confirm("Remove this online supporting document?")){await NEXUS_SAM.Modules.Handoff.Documents.remove(r.dataset.docRemove);NEXUS_SAM.UI.Notification.success("Supporting document removed.");refresh();}}
 function refresh(){NEXUS_SAM.Modules.Handoff.DocumentView.render(batchId());NEXUS_SAM.Modules.Handoff.Controller?.refresh?.();}
 function initialize(){document.getElementById("btnUploadOnlineDocument")?.addEventListener("click",upload);document.getElementById("onlineDocumentList")?.addEventListener("click",click);refresh();}
 return Object.freeze({initialize,refresh});
})();