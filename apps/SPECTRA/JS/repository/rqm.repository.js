"use strict";
NEXUS_SPECTRA.Repository.RQM=(()=>{
 const KEY="NEXUS:SPECTRA:rqmRegistry";
 const canonical=v=>String(v||"").trim().toUpperCase().replace(/\s+/g," ");
 function all(){try{return JSON.parse(localStorage.getItem(KEY)||"[]");}catch(_){return [];}}
 function saveAll(rows){localStorage.setItem(KEY,JSON.stringify(rows));return rows;}
 function get(rqm){const k=canonical(rqm);return all().find(x=>canonical(x.rqmNo||x.rqmCode)===k)||null;}
 function upsert(row){const rows=all(),key=canonical(row.rqmNo||row.rqmCode),i=rows.findIndex(x=>canonical(x.rqmNo||x.rqmCode)===key);if(i>=0)rows[i]={...rows[i],...row,updatedAt:new Date().toISOString()};else rows.push(row);saveAll(rows);return i>=0?rows[i]:row;}
 function byProvider(name){const n=canonical(name);return all().filter(x=>canonical(x.tvi)===n);}
 return Object.freeze({KEY,canonical,all,saveAll,get,upsert,byProvider});
})();