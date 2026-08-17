"use strict";
NEXUS_SPECTRA.Views.CashierWorkspace=(()=>{
 const esc=s=>(s??"").toString().replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
 const peso=n=>Number(n||0).toLocaleString("en-PH",{style:"currency",currency:"PHP"});
 function dashboard(){
   const m=NEXUS_SPECTRA.Services.CashierWorkspace.metrics(),q=NEXUS_SPECTRA.Services.PaymentQueue.today();
   document.getElementById("cashierHomeMetrics").innerHTML=`
   <article><span>Clients Waiting</span><strong>${m.waiting}</strong></article>
   <article><span>Scholarship Payments</span><strong>${m.scholarshipQueue}</strong></article>
   <article class="${m.unclaimedChecks?'attention':''}"><span>Unclaimed Checks</span><strong>${m.unclaimedChecks}</strong></article>
   <article class="${m.staleChecks?'attention':''}"><span>Near/Stale Checks</span><strong>${m.staleChecks}</strong></article>
   <article><span>Outstanding Cash Advances</span><strong>${m.outstandingCA}</strong></article>
   <article class="${m.landbankExceptions?'attention':''}"><span>LANDBANK Exceptions</span><strong>${m.landbankExceptions}</strong></article>
   <article><span>Undeposited Collections</span><strong>${peso(m.undepositedAmount)}</strong></article>
   <article class="${m.coaPending?'attention':''}"><span>COA Reports Pending</span><strong>${m.coaPending}</strong></article>`;
   const now=q.find(x=>x.status==="NOW_SERVING");
   document.getElementById("cashierNowServing").innerHTML=now?`<div class="now-serving-card"><span>NOW SERVING</span><strong>${esc(now.queueNo)}</strong><h3>${esc(now.payor)}</h3><p>${esc(now.serviceType.replaceAll("_"," "))} · ${peso(now.amount)}</p></div>`:'<div class="empty">No client is currently being served.</div>';
   document.getElementById("cashierQueueMini").innerHTML=q.filter(x=>["WAITING","NOW_SERVING","PAYMENT_IN_PROGRESS"].includes(x.status)).slice(0,8).map(x=>`<div class="queue-mini-row"><b>${esc(x.queueNo)}</b><span>${esc(x.payor)}<small>${esc(x.serviceType.replaceAll("_"," "))}</small></span><em>${esc(x.status.replaceAll("_"," "))}</em></div>`).join("")||'<div class="empty">No clients in today’s queue.</div>';
 }
 function queue(){
   const rows=NEXUS_SPECTRA.Services.PaymentQueue.today(),host=document.getElementById("clientPaymentQueue");
   host.innerHTML=rows.length?`<div class="table-wrap"><table><thead><tr><th>Queue</th><th>OP No.</th><th>Client</th><th>Service</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody>${rows.map(x=>`<tr><td><strong>${esc(x.queueNo)}</strong></td><td>${esc(x.orderPaymentNo)}</td><td>${esc(x.payor)}</td><td>${esc(x.serviceType.replaceAll("_"," "))}</td><td>${peso(x.amount)}</td><td>${esc(x.status.replaceAll("_"," "))}</td><td>${x.status==="WAITING"?`<button class="btn" data-client-call="${esc(x.queueId)}">Call</button>`:""}${x.status==="NOW_SERVING"?`<button class="btn primary" data-client-start="${esc(x.queueId)}">Start Payment</button> <button class="btn" data-client-skip="${esc(x.queueId)}">Did Not Proceed</button>`:""}${x.status==="PAYMENT_IN_PROGRESS"?`<button class="btn primary" data-client-complete="${esc(x.queueId)}">Record Payment</button>`:""}</td></tr>`).join("")}</tbody></table></div>`:'<div class="empty">No client payment queue for today.</div>';
 }
 function records(mode){
   const host=document.getElementById("cashierPaymentRecords"),rows=NEXUS_SPECTRA.Services.CashierWorkspace.paymentRecords(mode);
   if(mode==="INDIVIDUAL_CHECK")host.innerHTML=`<div class="table-wrap"><table><thead><tr><th>Check</th><th>Payee</th><th>Amount</th><th>Fund</th><th>Status</th><th>Transaction</th></tr></thead><tbody>${rows.map(x=>`<tr><td>${esc(x.checkNo)}</td><td>${esc(x.payee)}</td><td>${peso(x.amount)}</td><td>${esc(x.fund)}</td><td>${esc(x.status)}</td><td>${esc(x.transactionNo)}</td></tr>`).join("")||'<tr><td colspan="6">No check records.</td></tr>'}</tbody></table></div>`;
   else if(mode==="CASH_ADVANCE")host.innerHTML=`<div class="table-wrap"><table><thead><tr><th>CA No.</th><th>Transaction</th><th>Officer</th><th>Amount</th><th>Paid</th><th>Refund</th><th>Status</th></tr></thead><tbody>${rows.map(x=>`<tr><td>${esc(x.cashAdvanceId)}</td><td>${esc(x.transactionNo)}</td><td>${esc(x.payee)}</td><td>${peso(x.amount)}</td><td>${peso(x.scholarPaid)}</td><td>${peso(x.refunded)}</td><td>${esc(x.status)}</td></tr>`).join("")||'<tr><td colspan="7">No cash advance records.</td></tr>'}</tbody></table></div>`;
   else if(mode==="LANDBANK_PISO")host.innerHTML=`<div class="table-wrap"><table><thead><tr><th>Batch</th><th>Transaction</th><th>Date</th><th>Items</th><th>Exceptions</th><th>Status</th></tr></thead><tbody>${rows.map(x=>`<tr><td>${esc(x.batchNo)}</td><td>${esc(x.transactionNo)}</td><td>${esc(x.date)}</td><td>${x.items.length}</td><td>${x.items.filter(i=>i.status==="FAILED").length}</td><td>${esc(x.status)}</td></tr>`).join("")||'<tr><td colspan="6">No LANDBANK batches.</td></tr>'}</tbody></table></div>`;
 }
 return Object.freeze({dashboard,queue,records});
})();