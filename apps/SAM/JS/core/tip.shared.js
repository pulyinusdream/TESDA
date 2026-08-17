"use strict";
window.NEXUS_TIP_SHARED=window.NEXUS_TIP_SHARED||(()=>{
 const REQ="NEXUS:SPECTRA:tipRequests",NOTIF="NEXUS:SPECTRA:notifications",OUTBOX="NEXUS:SPECTRA:emailOutbox",CFG="NEXUS:SPECTRA:tipConfig";
 const load=(k,d=[])=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d));}catch(_){return d;}};
 const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
 function requests(){return load(REQ,[]);} function saveRequest(r){const rows=requests(),i=rows.findIndex(x=>x.tipRequestNo===r.tipRequestNo);if(i>=0)rows[i]=r;else rows.push(r);save(REQ,rows);return r;}
 function notifications(){return load(NOTIF,[]);} function addNotification(n){const rows=notifications();rows.push({notificationId:`NTF-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,createdAt:new Date().toISOString(),read:false,...n});save(NOTIF,rows);return rows.at(-1);}
 function markRead(id){save(NOTIF,notifications().map(x=>x.notificationId===id?{...x,read:true,readAt:new Date().toISOString()}:x));}
 function outbox(){return load(OUTBOX,[]);} function queueEmail(e){const rows=outbox();rows.push({emailId:`MAIL-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,queuedAt:new Date().toISOString(),status:"QUEUED",...e});save(OUTBOX,rows);return rows.at(-1);}
 function config(){return load(CFG,{slotMinutes:90,maxConcurrentTIP:1,officeEmail:"",internalFollowupTargetDays:null});}
 function saveConfig(c){save(CFG,{...config(),...c});return config();}
 return Object.freeze({requests,saveRequest,notifications,addNotification,markRead,outbox,queueEmail,config,saveConfig,keys:{REQ,NOTIF,OUTBOX,CFG}});
})();