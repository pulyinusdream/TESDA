"use strict";
NEXUS_SAM.Modules.Handoff.DocumentView=(()=>{
 const esc=s=>(s??"").toString().replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
 const fmt=n=>n<1024?`${n} B`:n<1048576?`${(n/1024).toFixed(1)} KB`:`${(n/1048576).toFixed(1)} MB`;
 function render(batchId){const host=document.getElementById("onlineDocumentList");if(!host)return;const rows=batchId?NEXUS_SAM.Modules.Handoff.Documents.byBatch(batchId):[];host.innerHTML=rows.length?rows.map(r=>`<article class="doc-card"><div><strong>${esc(r.docType.replaceAll("_"," "))}</strong><small>${esc(r.fileName)} · ${fmt(r.fileSize)}</small><small>${esc(r.remarks||"")}</small></div><div class="actions"><button type="button" class="btn btn-secondary btn-sm" data-doc-open="${esc(r.documentId)}">View</button><button type="button" class="btn btn-danger btn-sm" data-doc-remove="${esc(r.documentId)}">Remove</button></div></article>`).join(""):'<div class="empty-state compact">No online supporting documents uploaded for this batch.</div>'; }
 return Object.freeze({render});
})();