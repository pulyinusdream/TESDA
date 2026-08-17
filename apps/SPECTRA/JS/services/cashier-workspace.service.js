"use strict";
NEXUS_SPECTRA.Services.CashierWorkspace=(()=>{
 function metrics(){
   const q=NEXUS_SPECTRA.Services.PaymentQueue.today(),
         tx=NEXUS_SPECTRA.Repository.Transactions.all(),
         checks=NEXUS_SPECTRA.Repository.Cashier.checks(),
         ca=NEXUS_SPECTRA.Repository.Cashier.cashAdvances(),
         lb=NEXUS_SPECTRA.Repository.Cashier.landbankBatches(),
         reports=NEXUS_SPECTRA.Repository.Cashier.reports(),
         undep=NEXUS_SPECTRA.Services.CashierDaily.undeposited();
   return {
     waiting:q.filter(x=>x.status==="WAITING").length,
     nowServing:q.filter(x=>x.status==="NOW_SERVING").length,
     scholarshipQueue:tx.filter(x=>x.status==="FOR_CASHIER"||x.status==="PAYMENT_PROCESSING").length,
     unclaimedChecks:checks.filter(x=>x.status==="UNCLAIMED").length,
     staleChecks:NEXUS_SPECTRA.Services.Cashier.operationalCheckMonitoring().filter(x=>x.age.stale||x.age.warning).length,
     outstandingCA:ca.filter(x=>x.status!=="LIQUIDATED").length,
     landbankExceptions:lb.reduce((n,b)=>n+b.items.filter(i=>i.status==="FAILED").length,0),
     undepositedAmount:undep.reduce((n,x)=>n+Number(x.undeposited||0),0),
     coaPending:reports.filter(x=>!x.submittedToCOAAt).length
   };
 }
 function paymentRecords(mode){
   const cases=NEXUS_SPECTRA.Repository.Cashier.cases();
   if(mode==="INDIVIDUAL_CHECK")return NEXUS_SPECTRA.Repository.Cashier.checks();
   if(mode==="CASH_ADVANCE")return NEXUS_SPECTRA.Repository.Cashier.cashAdvances();
   if(mode==="LANDBANK_PISO")return NEXUS_SPECTRA.Repository.Cashier.landbankBatches();
   return cases;
 }
 return Object.freeze({metrics,paymentRecords});
})();