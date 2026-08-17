"use strict";
TAESF.NTTC.DocumentRepository=(()=>{
  const META_KEY="nttc.block3.documents.meta";
  const DB_NAME="nttc-block3-files"; const STORE="documents"; const DB_VERSION=1;
  function metaAll(){return TAESF.NTTC.LocalStorage.get(META_KEY)||[];}
  function saveMeta(meta){const rows=metaAll();const i=rows.findIndex(x=>x.documentId===meta.documentId);if(i>=0)rows[i]=meta;else rows.push(meta);TAESF.NTTC.LocalStorage.set(META_KEY,rows);return meta;}
  function findById(documentId){return metaAll().find(x=>x.documentId===documentId)||null;}
  function byApplication(applicationId){return metaAll().filter(x=>x.applicationId===applicationId).sort((a,b)=>String(b.uploadedAt).localeCompare(String(a.uploadedAt)));}
  function currentByApplication(applicationId){return byApplication(applicationId).filter(x=>x.status!=="SUPERSEDED");}
  function markSuperseded(documentId,replacementId){const row=findById(documentId);if(!row)return null;row.status="SUPERSEDED";row.supersededByDocumentId=replacementId||"";return saveMeta(row);}
  function removeMeta(documentId){TAESF.NTTC.LocalStorage.set(META_KEY,metaAll().filter(x=>x.documentId!==documentId));}
  function openDb(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,DB_VERSION);req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:"documentId"});};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
  async function saveFile(documentId,file){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,"readwrite");tx.objectStore(STORE).put({documentId,blob:file});tx.oncomplete=()=>{db.close();resolve(true);};tx.onerror=()=>{db.close();reject(tx.error);};});}
  async function deleteFile(documentId){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,"readwrite");tx.objectStore(STORE).delete(documentId);tx.oncomplete=()=>{db.close();resolve(true);};tx.onerror=()=>{db.close();reject(tx.error);};});}
  async function getFile(documentId){const db=await openDb();return new Promise((resolve,reject)=>{const req=db.transaction(STORE,"readonly").objectStore(STORE).get(documentId);req.onsuccess=()=>{db.close();resolve(req.result?req.result.blob:null);};req.onerror=()=>{db.close();reject(req.error);};});}
  return Object.freeze({metaAll,saveMeta,findById,byApplication,currentByApplication,markSuperseded,removeMeta,saveFile,deleteFile,getFile});
})();
