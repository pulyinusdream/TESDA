"use strict";
NEXUS_SPECTRA.Views.Admin=(()=>{
 const esc=s=>(s??"").toString().replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
 function render(){
   const tx=NEXUS_SPECTRA.Repository.Transactions.all(),pending=NEXUS_SPECTRA.Services.AdminOverride.pending(),recent=NEXUS_SPECTRA.Services.AdminOverride.recent();
   document.getElementById("adminMetrics").innerHTML=`
   <article><span>All Active Transactions</span><strong>${tx.filter(x=>!["PAID","CLOSED"].includes(x.status)).length}</strong></article>
   <article><span>Receiving</span><strong>${tx.filter(x=>x.physicalHolder==="RECEIVING").length}</strong></article>
   <article><span>Scholarship</span><strong>${tx.filter(x=>x.physicalHolder==="SCHOLARSHIP").length}</strong></article>
   <article><span>Accounting</span><strong>${tx.filter(x=>String(x.physicalHolder).startsWith("ACCOUNTING")).length}</strong></article>
   <article><span>Budget</span><strong>${tx.filter(x=>x.physicalHolder==="BUDGET").length}</strong></article>
   <article><span>Cashier</span><strong>${tx.filter(x=>x.physicalHolder==="CASHIER").length}</strong></article>
   <article class="${pending.length?'attention':''}"><span>Override Requests</span><strong>${pending.length}</strong></article>`;
   document.getElementById("adminOverrideQueue").innerHTML=pending.length?pending.map(x=>`<article class="override-card"><div><span>${esc(x.module)} · ${esc(x.requestType.replaceAll("_"," "))}</span><strong>${esc(x.referenceNo||"No reference")}</strong><p>${esc(x.reason)}</p><small>Requested by ${esc(x.requestedBy)}</small></div><div><button class="btn primary" data-admin-approve="${esc(x.requestId)}">Approve</button><button class="btn danger" data-admin-reject="${esc(x.requestId)}">Reject</button></div></article>`).join(""):'<div class="empty">No pending override/adjustment requests.</div>';
   document.getElementById("adminRecentActions").innerHTML=recent.length?recent.map(x=>`<div class="admin-action-row"><b>${esc(x.status)}</b><span>${esc(x.module)} · ${esc(x.referenceNo||x.requestId)}<small>${esc(x.reason)}</small></span></div>`).join(""):'<div class="empty">No override history yet.</div>';
 }
 return Object.freeze({render});
})();