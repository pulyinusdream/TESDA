"use strict";
NEXUS_SPECTRA.Services.TVIMonitor=(()=>{
 function build(){
   const rows=NEXUS_SPECTRA.Repository.Transactions.all(),map=new Map(),now=Date.now();
   for(const r of rows){const key=r.tvi||"UNKNOWN TVI";if(!map.has(key))map.set(key,{tvi:key,total:0,amount:0,awaiting:0,review:0,compliance:0,accounting:0,budget:0,cashier:0,paid:0,oldestDays:0,lastUpdated:"",rqms:new Set()});const x=map.get(key);x.total++;x.amount+=Number(r.claimAmount||0);x.rqms.add(r.rqmCode||r.rqmNo);if(r.status==="AWAITING_HARD_COPY")x.awaiting++;if(r.status==="SCHOLARSHIP_REVIEW")x.review++;if(r.status==="FOR_COMPLIANCE")x.compliance++;if(r.status==="ACCOUNTING_REVIEW")x.accounting++;if(r.status==="FOR_BUDGET_OBLIGATION")x.budget++;if(r.status==="FOR_CASHIER")x.cashier++;if(r.status==="PAID"||r.status==="CLOSED")x.paid++;const at=new Date(r.updatedAt||r.createdAt||Date.now()).getTime(),days=Math.floor((now-at)/86400000);x.oldestDays=Math.max(x.oldestDays,days);if(!x.lastUpdated||String(r.updatedAt||r.createdAt)>x.lastUpdated)x.lastUpdated=r.updatedAt||r.createdAt;}
   return [...map.values()].map(x=>({...x,rqmCount:x.rqms.size,rqms:undefined})).sort((a,b)=>b.total-a.total||a.tvi.localeCompare(b.tvi));
 }
 return Object.freeze({build});
})();