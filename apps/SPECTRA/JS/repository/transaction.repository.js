"use strict";
NEXUS_SPECTRA.Repository.Transactions=(()=>{
 const KEY="NEXUS:SPECTRA:billingTransactions";
 function all(){try{return JSON.parse(localStorage.getItem(KEY)||"[]");}catch(e){console.error(e);return [];}}
 function save(row){const rows=all(),i=rows.findIndex(x=>x.transactionNo===row.transactionNo);if(i>=0)rows[i]=row;else rows.push(row);localStorage.setItem(KEY,JSON.stringify(rows));return row;}
 function get(no){return all().find(x=>x.transactionNo===no)||null;}
 function query(filters={}){let rows=all();if(filters.status)rows=rows.filter(x=>x.status===filters.status);if(filters.holder)rows=rows.filter(x=>x.physicalHolder===filters.holder);if(filters.search){const q=filters.search.toUpperCase();rows=rows.filter(x=>[x.transactionNo,x.controlNo,x.rqmNo,x.rqmCode,x.tvi,x.qualification].some(v=>String(v||"").toUpperCase().includes(q)));}return rows.sort((a,b)=>(b.updatedAt||b.createdAt||"").localeCompare(a.updatedAt||a.createdAt||""));}
 return Object.freeze({all,save,get,query,KEY});
})();