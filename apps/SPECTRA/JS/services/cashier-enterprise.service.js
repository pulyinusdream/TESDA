"use strict";
NEXUS_SPECTRA.Services.CashierEnterprise=(()=>{
 function alerts(){
   const m=NEXUS_SPECTRA.Services.CashierWorkspace.metrics(),items=[];
   if(m.waiting)items.push({level:"info",title:`${m.waiting} client${m.waiting===1?"":"s"} waiting`,message:"Use Client Queue to call the next client."});
   if(m.unclaimedChecks)items.push({level:"warning",title:`${m.unclaimedChecks} unclaimed check${m.unclaimedChecks===1?"":"s"}`,message:"These remain in Cashier custody and continue aging until released/cancelled/replaced."});
   if(m.staleChecks)items.push({level:"critical",title:`${m.staleChecks} check${m.staleChecks===1?"":"s"} near/stale`,message:"Review check custody and required action before the stale-date threshold."});
   if(m.outstandingCA)items.push({level:"warning",title:`${m.outstandingCA} outstanding cash advance${m.outstandingCA===1?"":"s"}`,message:"Complete scholar payout/refund reconciliation and liquidation."});
   if(m.landbankExceptions)items.push({level:"critical",title:`${m.landbankExceptions} LANDBANK exception${m.landbankExceptions===1?"":"s"}`,message:"Resolve failed scholar transfers before payment closure."});
   if(m.undepositedAmount>0)items.push({level:"warning",title:`${new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP"}).format(m.undepositedAmount)} undeposited`,message:"Review collections by fund and prepare the applicable deposit batch."});
   if(m.coaPending)items.push({level:"info",title:`${m.coaPending} COA report record${m.coaPending===1?"":"s"} pending`,message:"Check preview, scan, submission and filing status."});
   return items;
 }
 function reportArchive(filter={}){
   let rows=NEXUS_SPECTRA.Repository.Cashier.reports().sort((a,b)=>(b.year*100+b.month)-(a.year*100+a.month));
   if(filter.year)rows=rows.filter(x=>Number(x.year)===Number(filter.year));
   if(filter.fund)rows=rows.filter(x=>x.fund===filter.fund);
   if(filter.status)rows=rows.filter(x=>x.status===filter.status);
   if(filter.q){const q=filter.q.toLowerCase();rows=rows.filter(x=>[x.label,x.reportId,x.fund,x.coaReceivingRef,x.fileLocation].some(v=>String(v||"").toLowerCase().includes(q)));}
   return rows;
 }
 function quickCounts(){const m=NEXUS_SPECTRA.Services.CashierWorkspace.metrics();return {daily:m.waiting,disbursements:m.scholarshipQueue,records:m.unclaimedChecks+m.outstandingCA+m.landbankExceptions,controls:m.staleChecks,reporting:m.coaPending};}
 return Object.freeze({alerts,reportArchive,quickCounts});
})();