"use strict";
NEXUS_SPECTRA.Controllers.App=(()=>{
 function filters(){return {search:document.getElementById("searchBox").value.trim(),status:document.getElementById("statusFilter").value,holder:document.getElementById("holderFilter").value};}
 function refresh(){
   NEXUS_SPECTRA.Views.App.summary(NEXUS_SPECTRA.Services.Transactions.summary());
   NEXUS_SPECTRA.Views.App.rows(NEXUS_SPECTRA.Repository.Transactions.query(filters()));
   const no=NEXUS_SPECTRA.State.selectedTransactionNo;NEXUS_SPECTRA.Views.App.detail(no?NEXUS_SPECTRA.Repository.Transactions.get(no):null);NEXUS_SPECTRA.Controllers.Review?.refresh?.();NEXUS_SPECTRA.Views.TVIMonitor?.render?.(NEXUS_SPECTRA.Services.TVIMonitor?.build?.()||[]);NEXUS_SPECTRA.Controllers.Accounting?.refresh?.();NEXUS_SPECTRA.Controllers.Budget?.refresh?.();NEXUS_SPECTRA.Controllers.TIP?.refresh?.();NEXUS_SPECTRA.Controllers.DVJEV?.refresh?.();NEXUS_SPECTRA.Controllers.Cashier?.refresh?.();NEXUS_SPECTRA.Controllers.CashierReports?.refresh?.();
 }
 function open(no){NEXUS_SPECTRA.State.selectedTransactionNo=no;refresh();document.getElementById("detailPanel").scrollIntoView({behavior:"smooth",block:"start"});}
 function receive(no){
   const r=NEXUS_SPECTRA.Repository.Transactions.get(no);if(!r)return;
   document.getElementById("receiveTransactionNo").value=no;
   document.getElementById("receiveMeta").textContent=`${r.tvi} · ${r.qualification} · ${r.claimLabel}`;
   document.getElementById("receiveModal").hidden=false;
 }
 function closeReceive(){document.getElementById("receiveModal").hidden=true;document.getElementById("receiveForm").reset();}
 function submitReceive(e){
   e.preventDefault();const no=document.getElementById("receiveTransactionNo").value;
   const result=NEXUS_SPECTRA.Services.Transactions.receive(no,{receivedBy:document.getElementById("receivedBy").value,documentSets:document.getElementById("documentSets").value,completenessStatus:document.getElementById("completenessStatus").value,deficiencyNote:document.getElementById("deficiencyNote").value,remarks:document.getElementById("receivingRemarks").value});
   if(!result.ok){NEXUS_SPECTRA.Views.App.notify(result.errors[0],"error");return;}
   closeReceive();NEXUS_SPECTRA.State.selectedTransactionNo=no;refresh();NEXUS_SPECTRA.Views.App.notify(`Received. ${result.row.controlNo} assigned.`,"success");NEXUS_SPECTRA.Services.Print.routingSheet(result.row);
 }
 function click(e){
   const o=e.target.closest("[data-open]");if(o)return open(o.dataset.open);
   const r=e.target.closest("[data-receive]");if(r)return receive(r.dataset.receive);
   const p=e.target.closest("[data-print]");if(p){const row=NEXUS_SPECTRA.Repository.Transactions.get(p.dataset.print);if(row)NEXUS_SPECTRA.Services.Print.routingSheet(row);}
 }
 function initialize(){
   ["searchBox","statusFilter","holderFilter"].forEach(id=>document.getElementById(id).addEventListener(id==="searchBox"?"input":"change",refresh));
   document.getElementById("transactionTableBody").addEventListener("click",click);
   document.getElementById("transactionDetail").addEventListener("click",click);
   document.getElementById("receiveForm").addEventListener("submit",submitReceive);
   document.getElementById("btnCloseReceive").addEventListener("click",closeReceive);
   const params=new URLSearchParams(location.search),tx=params.get("transaction");if(tx)NEXUS_SPECTRA.State.selectedTransactionNo=tx;
   refresh();
 }
 return Object.freeze({initialize,refresh,open});
})();