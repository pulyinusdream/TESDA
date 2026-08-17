"use strict";
TAESF.NTTC.CertificateRepository=(()=>{
  const META_KEY="nttc.block9.certificates.meta";
  const DB_NAME="nttc-block9-certificate-files"; const STORE="certificateFiles"; const DB_VERSION=1;
  function all(){return TAESF.NTTC.LocalStorage.get(META_KEY)||[];}
  function byApplication(applicationId){return all().find(x=>x.applicationId===applicationId)||null;}
  function save(record){const rows=all(),i=rows.findIndex(x=>x.applicationId===record.applicationId);record.updatedAt=new Date().toISOString();if(i>=0)rows[i]=record;else rows.push(record);TAESF.NTTC.LocalStorage.set(META_KEY,rows);return record;}
  function openDb(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,DB_VERSION);req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:"applicationId"});};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
  async function saveScan(applicationId,file){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,"readwrite");tx.objectStore(STORE).put({applicationId,blob:file,fileName:file.name||"NTTC Certificate",mimeType:file.type||"application/pdf",savedAt:new Date().toISOString()});tx.oncomplete=()=>{db.close();resolve(true);};tx.onerror=()=>{db.close();reject(tx.error);};});}
  async function getScan(applicationId){const db=await openDb();return new Promise((resolve,reject)=>{const req=db.transaction(STORE,"readonly").objectStore(STORE).get(applicationId);req.onsuccess=()=>{db.close();resolve(req.result||null);};req.onerror=()=>{db.close();reject(req.error);};});}
  return Object.freeze({all,byApplication,save,saveScan,getScan});
})();
