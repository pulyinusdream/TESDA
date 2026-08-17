"use strict";
NEXUS_SPECTRA.Services.QualificationCostAdmin=(()=>{
 const KEY="nexus_sam:cost_master";
 function all(){try{return JSON.parse(localStorage.getItem(KEY)||"[]");}catch(_){return [];}}
 function saveAll(rows){localStorage.setItem(KEY,JSON.stringify(rows));return rows;}
 function save(input){
   const rows=all(),now=new Date().toISOString(),errors=[];
   if(!String(input.qualificationTitle||"").trim())errors.push("Qualification title is required.");
   if(!String(input.socCode||"").trim())errors.push("SOC code is required.");
   if(!String(input.circularNo||"").trim())errors.push("Circular/amendment reference is required.");
   if(Number(input.trainingHours||0)<=0)errors.push("Training hours must be greater than zero.");
   if(errors.length)return {ok:false,errors};
   const id=input.id||`${input.costScheduleId||"TESDA-COST"}|${input.implementationType||"REGULAR"}|${input.qualificationCode||input.socCode}|${input.socCode}`;
   const row={...input,id,trainingHours:Number(input.trainingHours||0),trainingDays:Number(input.trainingDays||0),tsfRate:Number(input.tsfRate||0),maximumTsf:Number(input.maximumTsf||0),trainingCost:Number(input.trainingCost||0),assessmentFee:Number(input.assessmentFee||0),entrepreneurshipFee:Number(input.entrepreneurshipFee||0),bookAllowance:Number(input.bookAllowance||0),scholarshipPrograms:Array.isArray(input.scholarshipPrograms)?input.scholarshipPrograms:String(input.scholarshipPrograms||"").split(",").map(x=>x.trim()).filter(Boolean),updatedAt:now};
   const i=rows.findIndex(x=>x.id===id);if(i>=0)rows[i]={...rows[i],...row};else rows.push(row);saveAll(rows);return {ok:true,row};
 }
 function archive(id){const rows=all(),r=rows.find(x=>x.id===id);if(!r)return {ok:false,errors:["Cost record not found."]};r.status="ARCHIVED";r.updatedAt=new Date().toISOString();saveAll(rows);return {ok:true,row:r};}
 return Object.freeze({KEY,all,save,archive});
})();