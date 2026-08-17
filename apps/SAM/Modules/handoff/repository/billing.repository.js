"use strict";
NEXUS_SAM.Modules.Handoff = NEXUS_SAM.Modules.Handoff || {};
NEXUS_SAM.Modules.Handoff.Repository = (()=>{
  const KEY="NEXUS:SPECTRA:billingTransactions";
  function all(){
    try{return JSON.parse(localStorage.getItem(KEY)||"[]");}
    catch(e){console.error("Billing transaction registry parse failed",e);return [];}
  }
  function save(row){
    const rows=all(), idx=rows.findIndex(x=>x.transactionNo===row.transactionNo);
    if(idx>=0) rows[idx]=row; else rows.push(row);
    localStorage.setItem(KEY,JSON.stringify(rows));
    return row;
  }
  function byBatch(batchId){return all().filter(x=>x.sourceBatchId===batchId).sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||""));}
  function get(transactionNo){return all().find(x=>x.transactionNo===transactionNo)||null;}
  return Object.freeze({all,save,byBatch,get,KEY});
})();