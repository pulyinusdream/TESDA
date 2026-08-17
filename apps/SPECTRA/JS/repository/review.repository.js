"use strict";
NEXUS_SPECTRA.Repository.Reviews=(()=>{
 const KEY="NEXUS:SPECTRA:scholarshipReviews";
 function all(){try{return JSON.parse(localStorage.getItem(KEY)||"[]");}catch(e){console.error(e);return [];}}
 function get(transactionNo){return all().find(x=>x.transactionNo===transactionNo)||null;}
 function save(row){const rows=all(),i=rows.findIndex(x=>x.transactionNo===row.transactionNo);if(i>=0)rows[i]=row;else rows.push(row);localStorage.setItem(KEY,JSON.stringify(rows));return row;}
 return Object.freeze({all,get,save,KEY});
})();