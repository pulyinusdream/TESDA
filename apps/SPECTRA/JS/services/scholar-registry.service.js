"use strict";
NEXUS_SPECTRA.Services.ScholarRegistry=(()=>{
 const norm=s=>String(s||"").trim().toUpperCase().replace(/\s+/g," ");
 function persistent(){const masters=NEXUS_SPECTRA.Repository.SPMOR?.scholars?.()||[],enr=NEXUS_SPECTRA.Repository.SPMOR?.enrollments?.()||[],byId=new Map(masters.map(x=>[x.scholarId,{...x,histories:[]}])) ;for(const e of enr){if(!byId.has(e.scholarId))continue;const rqm=NEXUS_SPECTRA.Repository.RQM?.get?.(e.rqmCode),txs=NEXUS_SPECTRA.Repository.Transactions.all().filter(x=>norm(x.rqmNo||x.rqmCode)===norm(e.rqmCode)),benefits=[];for(const tx of txs){const cash=NEXUS_SPECTRA.Repository.Cashier?.cases?.().find(c=>c.transactionNo===tx.transactionNo),sc=cash?.scholars?.find(s=>norm(s.name).includes(norm(byId.get(e.scholarId).firstName))&&norm(s.name).includes(norm(byId.get(e.scholarId).lastName)));benefits.push({transactionNo:tx.transactionNo,components:tx.claimComponents||[],status:sc?.paymentStatus||tx.status,holder:tx.physicalHolder});}byId.get(e.scholarId).histories.push({...e,rqm,rqmNo:e.rqmCode,program:rqm?.scholarshipProgram||e.scholarshipType,tsfPerPax:Number(rqm?.costProfile?.tsfPerPax||0),trainingCostPerPax:Number(rqm?.costProfile?.trainingCostPerPax||0),assessmentFeePerPax:Number(rqm?.costProfile?.assessmentFeePerPax||0),toolkitApplicable:/STEP/i.test(rqm?.scholarshipProgram||e.scholarshipType||""),toolkitStatus:/STEP/i.test(rqm?.scholarshipProgram||e.scholarshipType||"")?(txs[0]?.toolkitStatus||"PENDING_TITAN_LINK"):"NOT_APPLICABLE",benefits});}return [...byId.values()];}
 function legacySnapshotOnly(){if(NEXUS_SPECTRA.Repository.SPMOR?.scholars?.().length)return [];const out=new Map(),cases=NEXUS_SPECTRA.Repository.Cashier?.cases?.()||[];for(const tx of NEXUS_SPECTRA.Repository.Transactions.all()){const snap=tx.snapshot||{},scholars=snap.allowance?.scholars||[],ulis=snap.reportProfile?.ulis||{},cash=cases.find(c=>c.transactionNo===tx.transactionNo);for(const s of scholars){const uli=String(ulis[s.key]||s.uli||"").trim(),key=uli?`ULI:${norm(uli)}`:`NAME:${norm(s.name)}|${norm(tx.tvi)}`;if(!out.has(key))out.set(key,{scholarId:key,fullName:s.name,name:s.name,uli,histories:[]});const pay=cash?.scholars?.find(x=>x.key===s.key||norm(x.name)===norm(s.name)),initial=Math.min(Number(s.maxTsf||0)/2,Number(s.earned||0)),remaining=Math.max(0,Number(s.earned||0)-initial);out.get(key).histories.push({rqmNo:tx.rqmNo||tx.rqmCode,tvi:tx.tvi,qualification:tx.qualification,program:tx.scholarshipProgram||"",trainingStart:tx.trainingStartDate||"",trainingEnd:tx.trainingEndDate||"",trainingStatus:tx.status,trainingResult:"",assessmentResult:"",employmentBefore:"",tsfInitial:initial,tsfRemaining:remaining,tsfTotal:Number(s.earned||0),allowanceStatus:pay?.paymentStatus||tx.status,toolkitApplicable:/STEP/i.test(tx.scholarshipProgram||""),toolkitStatus:tx.toolkitStatus||(/STEP/i.test(tx.scholarshipProgram||"")?"PENDING_TITAN_LINK":"NOT_APPLICABLE"),benefits:[],physicalHolder:tx.physicalHolder});}}return [...out.values()];}
 function all(){return [...persistent(),...legacySnapshotOnly()].sort((a,b)=>(a.fullName||a.name||"").localeCompare(b.fullName||b.name||""));}
 function filter(input={}){
 const q=norm(input.q),school=norm(input.school),qualification=norm(input.qualification),status=norm(input.status);
 let rows=all();
 if(q)rows=rows.filter(s=>norm(s.fullName||s.name).includes(q)||norm(s.uli).includes(q)||norm(s.t2misUli).includes(q)||s.histories.some(h=>norm(h.rqmCode||h.rqmNo).includes(q)||norm(h.qualification).includes(q)));
 if(school)rows=rows.filter(s=>s.histories.some(h=>norm(h.tvi||h.provider)===school));
 if(qualification)rows=rows.filter(s=>s.histories.some(h=>norm(h.qualification)===qualification));
 if(status)rows=rows.filter(s=>s.histories.some(h=>norm(h.trainingStatus||h.transactionStatus||"")===status));
 return rows.slice(0,250);
}
 function options(){
   const rows=all(),schools=new Set(),qualifications=new Set(),statuses=new Set();
   rows.forEach(s=>s.histories.forEach(h=>{if(h.tvi||h.provider)schools.add(h.tvi||h.provider);if(h.qualification)qualifications.add(h.qualification);if(h.trainingStatus||h.transactionStatus)statuses.add(h.trainingStatus||h.transactionStatus);}));
   return {schools:[...schools].sort(),qualifications:[...qualifications].sort(),statuses:[...statuses].sort()};
 }
 function summary(rows=all()){
   const histories=rows.flatMap(x=>x.histories||[]),is=(h,r)=>r.test(norm(h.trainingStatus||h.trainingResult||h.transactionStatus||""));
   return {scholars:rows.length,enrollments:histories.length,ongoing:histories.filter(h=>is(h,/ONGOING|IN PROGRESS/)).length,completed:histories.filter(h=>is(h,/COMPLETED|GRADUATED|PASS/)).length,assessed:histories.filter(h=>h.assessmentDate||h.assessmentResult).length,certified:histories.filter(h=>/COMPETENT|CERTIFIED/.test(norm(h.assessmentResult||""))).length};
 }
 function search(q){return filter({q});}
 return Object.freeze({all,search,filter,options,summary});})();