"use strict";
NEXUS_SPECTRA.Services.Documents=(()=>{
 async function list(transactionNo){const tx=NEXUS_SPECTRA.Repository.Transactions.get(transactionNo);let rows=[];try{rows=await NEXUS_SHARED_DOCS.byTransaction(transactionNo);}catch(_){}if(!rows.length&&tx?.sourceBatchId){try{rows=await NEXUS_SHARED_DOCS.byBatch(tx.sourceBatchId);}catch(_){}}if(!rows.length&&Array.isArray(tx?.snapshot?.onlineDocuments))rows=tx.snapshot.onlineDocuments;return rows.sort((a,b)=>(a.uploadedAt||"").localeCompare(b.uploadedAt||""));}
 async function open(documentId){const row=await NEXUS_SHARED_DOCS.get(documentId);if(row?.blob){NEXUS_SHARED_DOCS.openBlob(row);return true;}NEXUS_SPECTRA.Views.App.notify("Document metadata is present, but the local uploaded file is not available in this browser profile. In production this will come from shared document storage.","error");return false;}
 return Object.freeze({list,open});
})();