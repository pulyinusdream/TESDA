"use strict";
NEXUS_SPECTRA.Repository.Accounting=(()=>{
 const KEY="NEXUS:SPECTRA:accountingReviews";
 function all(){try{return JSON.parse(localStorage.getItem(KEY)||"[]");}catch(_){return [];}}
 function get(no){return all().find(x=>x.transactionNo===no)||null;}
 function save(row){const rows=all(),i=rows.findIndex(x=>x.transactionNo===row.transactionNo);if(i>=0)rows[i]=row;else rows.push(row);localStorage.setItem(KEY,JSON.stringify(rows));return row;}
 return Object.freeze({all,get,save});
})();