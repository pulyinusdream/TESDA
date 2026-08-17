"use strict";
NEXUS_SPECTRA.Services.RQMRegistry=(()=>{
 const aliases={
   rqmNo:["RQM","RQM NO","RQM NUMBER","RQM NO.","RQM CODE"],
   tvi:["TVI","TVET PROVIDER","TVET INSTITUTION","INSTITUTION","SCHOOL","NAME OF TVI"],
   qualification:["QUALIFICATION","QUALIFICATION TITLE","PROGRAM/QUALIFICATION","QUALIFICATION/PROGRAM","TRAINING PROGRAM"],
   program:["SCHOLARSHIP PROGRAM","PROGRAM","SCHOLARSHIP TYPE"],
   slots:["SLOTS","NO. OF SLOTS","NUMBER OF SLOTS","ALLOCATED SLOTS"],
   allocationCode:["ALLOCATION CODE","RQM ALLOCATION CODE"],
   district:["DISTRICT"],
   municipality:["MUNICIPALITY","CITY/MUNICIPALITY"]
 };
 const norm=s=>String(s||"").trim().toUpperCase().replace(/\s+/g," ").replace(/[\n\r]+/g," ");
 function findHeader(headers,list){const hs=headers.map(h=>norm(h));for(const a of list){const i=hs.indexOf(norm(a));if(i>=0)return headers[i];}for(const a of list){const i=hs.findIndex(h=>h.includes(norm(a)));if(i>=0)return headers[i];}return "";}
 function mapRows(rawRows,source={}){if(!rawRows.length)return {rows:[],errors:["No SPMOR rows found."]};const headers=Object.keys(rawRows.find(r=>Object.values(r).some(v=>String(v||"").trim()))||{}),map={};for(const [k,a] of Object.entries(aliases))map[k]=findHeader(headers,a);if(!map.rqmNo)return {rows:[],errors:["RQM column was not detected. Review the SPMOR header row/worksheet."]};if(!map.tvi)return {rows:[],errors:["TVET Provider/Institution column was not detected."]};const now=new Date().toISOString(),seen=new Set(),duplicates=[],rows=[];for(const r of rawRows){const rqmNo=String(r[map.rqmNo]||"").trim();if(!rqmNo)continue;const key=norm(rqmNo);if(seen.has(key)){duplicates.push(rqmNo);continue;}seen.add(key);rows.push({rqmId:`RQM-${key.replace(/[^A-Z0-9]+/g,"-")}`,rqmNo,rqmCode:rqmNo,allocationCode:map.allocationCode?String(r[map.allocationCode]||"").trim():"",tvi:String(r[map.tvi]||"").trim(),qualification:map.qualification?String(r[map.qualification]||"").trim():"",scholarshipProgram:map.program?String(r[map.program]||"").trim():"",slots:map.slots?Number(r[map.slots]||0):0,district:map.district?String(r[map.district]||"").trim():"",municipality:map.municipality?String(r[map.municipality]||"").trim():"",sourceFile:source.fileName||"SPMOR",sourceSheet:source.sheetName||"Albay",sourceHeaders:map,status:"APPROVED",importedAt:now,updatedAt:now});}return {rows,duplicates,errors:[]};}
 function publish(mapped,source={}){const existing=NEXUS_SPECTRA.Repository.RQM.all(),byKey=new Map(existing.map(x=>[NEXUS_SPECTRA.Repository.RQM.canonical(x.rqmNo||x.rqmCode),x])),inserted=[],updated=[],unchanged=[];for(const row of mapped.rows){const k=NEXUS_SPECTRA.Repository.RQM.canonical(row.rqmNo);const old=byKey.get(k);if(!old){NEXUS_SPECTRA.Repository.RQM.upsert(row);inserted.push(row);}else{const merged={...old,...row,rqmId:old.rqmId||row.rqmId,importedAt:old.importedAt||row.importedAt,updatedAt:new Date().toISOString()};const comparable=a=>JSON.stringify({rqmNo:a.rqmNo,tvi:a.tvi,qualification:a.qualification,scholarshipProgram:a.scholarshipProgram,slots:Number(a.slots||0),allocationCode:a.allocationCode||""});if(comparable(old)===comparable(merged))unchanged.push(old);else{NEXUS_SPECTRA.Repository.RQM.upsert(merged);updated.push(merged);}}}return {inserted,updated,unchanged,duplicates:mapped.duplicates||[],total:NEXUS_SPECTRA.Repository.RQM.all().length,source};}
 function byProvider(name){return NEXUS_SPECTRA.Repository.RQM.byProvider(name);}
 function details(rqm){const row=NEXUS_SPECTRA.Repository.RQM.get(rqm),tx=NEXUS_SPECTRA.Repository.Transactions.all().filter(x=>NEXUS_SPECTRA.Repository.RQM.canonical(x.rqmNo||x.rqmCode)===NEXUS_SPECTRA.Repository.RQM.canonical(rqm));return {row,transactions:tx};}
 return Object.freeze({mapRows,publish,byProvider,details,aliases});
})();