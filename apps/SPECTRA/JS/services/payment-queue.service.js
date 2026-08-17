"use strict";
NEXUS_SPECTRA.Services.PaymentQueue=(()=>{
 const KEY="NEXUS:SPECTRA:cashierClientQueue";
 function all(){try{return JSON.parse(localStorage.getItem(KEY)||"[]");}catch(_){return [];}}
 function save(rows){localStorage.setItem(KEY,JSON.stringify(rows));}
 function nextNumber(){const y=new Date().getFullYear(),day=new Date().toISOString().slice(0,10),rows=all().filter(x=>x.queueDate===day),n=rows.length+1;return `C-${String(n).padStart(3,"0")}`;}
 function enqueueOrder(order){
   const existing=all().find(x=>x.orderPaymentNo===order.orderPaymentNo);
   if(existing)return existing;
   const row={
     queueId:`Q-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
     queueNo:nextNumber(),
     queueDate:new Date().toISOString().slice(0,10),
     orderPaymentNo:order.orderPaymentNo,
     payor:order.payor,
     serviceType:order.serviceType||"OTHER",
     purpose:order.purpose||"",
     amount:Number(order.amount||0),
     fundCluster:order.fundCluster||"",
     fund:order.fund||"",
     status:"WAITING",
     queuedAt:new Date().toISOString(),
     nowServingAt:"",
     paymentStartedAt:"",
     completedAt:"",
     skippedAt:"",
     cashier:"",
     orNo:""
   };
   const rows=all();rows.push(row);save(rows);return row;
 }
 function update(id,patch){const rows=all(),i=rows.findIndex(x=>x.queueId===id);if(i<0)return null;rows[i]={...rows[i],...patch,updatedAt:new Date().toISOString()};save(rows);return rows[i];}
 function today(){const d=new Date().toISOString().slice(0,10);return all().filter(x=>x.queueDate===d).sort((a,b)=>(a.queuedAt||"").localeCompare(b.queuedAt||""));}
 function call(id,cashier){for(const r of today().filter(x=>x.status==="NOW_SERVING"))update(r.queueId,{status:"WAITING",nowServingAt:""});return update(id,{status:"NOW_SERVING",nowServingAt:new Date().toISOString(),cashier:cashier||""});}
 function start(id,cashier){return update(id,{status:"PAYMENT_IN_PROGRESS",paymentStartedAt:new Date().toISOString(),cashier:cashier||""});}
 function complete(id,orNo){return update(id,{status:"PAID",completedAt:new Date().toISOString(),orNo});}
 function skip(id){return update(id,{status:"DID_NOT_PROCEED",skippedAt:new Date().toISOString()});}
 return Object.freeze({all,enqueueOrder,update,today,call,start,complete,skip});
})();