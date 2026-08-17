"use strict";
NEXUS_SAM.Modules.Handoff.Documents=(()=>{
 const META_KEY="NEXUS:SAM:onlineDocumentMeta";
 function metaAll(){try{return JSON.parse(localStorage.getItem(META_KEY)||"[]");}catch(_){return [];}}
 function saveMeta(row){const rows=metaAll(),i=rows.findIndex(x=>x.documentId===row.documentId);if(i>=0)rows[i]=row;else rows.push(row);localStorage.setItem(META_KEY,JSON.stringify(rows));return row;}
 function removeMeta(id){localStorage.setItem(META_KEY,JSON.stringify(metaAll().filter(x=>x.documentId!==id)));}
 function byBatch(batchId){return metaAll().filter(x=>x.batchId===batchId).sort((a,b)=>(a.uploadedAt||"").localeCompare(b.uploadedAt||""));}
 async function upload(batchId,file,docType,remarks=""){
   if(!batchId)throw new Error("Open a scholarship batch first.");
   if(!file)throw new Error("Choose a document.");
   const allowed=["application/pdf","image/jpeg","image/png"];
   if(!allowed.includes(file.type))throw new Error("Only PDF, JPG and PNG files are allowed.");
   const documentId=`DOC-${Date.now()}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
   const row={documentId,batchId,transactionNo:"",docType:docType||"OTHER",fileName:file.name,mimeType:file.type,fileSize:file.size,remarks:String(remarks||"").trim(),uploadedAt:new Date().toISOString(),uploadedBy:"TVET_PROVIDER"};
   await NEXUS_SHARED_DOCS.put(row,file);saveMeta(row);return row;
 }
 async function remove(id){await NEXUS_SHARED_DOCS.remove(id);removeMeta(id);}
 async function open(id){const row=await NEXUS_SHARED_DOCS.get(id);if(row)NEXUS_SHARED_DOCS.openBlob(row);}
 async function retag(batchId,transactionNo){const count=await NEXUS_SHARED_DOCS.retagBatchDocs(batchId,transactionNo);const rows=metaAll().map(r=>r.batchId===batchId?{...r,transactionNo}:r);localStorage.setItem(META_KEY,JSON.stringify(rows));return count;}
 return Object.freeze({upload,remove,open,byBatch,retag,metaAll});
})();