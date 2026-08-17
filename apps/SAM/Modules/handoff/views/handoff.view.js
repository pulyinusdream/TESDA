"use strict";
NEXUS_SAM.Modules.Handoff.View = (()=>{
 const esc=s=>(s??"").toString().replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
 const peso=n=>new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP"}).format(Number(n||0));
 function render(batchId){
   const state=document.getElementById("handoffState"), button=document.getElementById("btnSubmitBilling"), list=document.getElementById("submittedBillingList");
   if(!state||!button||!list)return;
   if(!batchId){
     state.className="readiness pending";state.textContent="Open a scholarship batch first.";button.disabled=true;list.innerHTML='<div class="empty-state compact">No active batch.</div>';return;
   }
   const r=NEXUS_SAM.Modules.Handoff.Service.readiness(batchId);
   state.className=`readiness ${r.ok?"ready":"pending"}`;
   state.innerHTML=r.ok?`<strong>Ready to Finalize & Submit.</strong> The school reports and allowance data will be frozen into an auditable snapshot.`:`<strong>Not ready for submission.</strong><ul>${r.errors.map(e=>`<li>${esc(e)}</li>`).join("")}</ul>`;
   const txs=NEXUS_SAM.Modules.Handoff.Repository.byBatch(batchId);
   const active=txs.find(x=>!["CANCELLED","RETURNED_TO_TVI"].includes(x.status));
   button.disabled=!r.ok||!!active;
   if(active)button.textContent=`Submitted — ${active.transactionNo}`;else button.textContent="Finalize & Submit for Billing";
   list.innerHTML=txs.length?txs.map(t=>`<article class="tracking-card"><div><strong>${esc(t.transactionNo)}</strong><small>${esc(t.claimLabel)} · ${peso(t.claimAmount)}</small></div><div><span class="badge badge-neutral">${esc((t.status||"").replaceAll("_"," "))}</span><small>Current holder: ${esc((t.physicalHolder||"").replaceAll("_"," "))}</small></div><a class="btn btn-secondary btn-sm" href="../SPECTRA/index.html?transaction=${encodeURIComponent(t.transactionNo)}" target="_blank">Open Tracking</a></article>`).join(""):'<div class="empty-state compact">No billing transaction has been submitted for this batch.</div>';
 }
 return Object.freeze({render});
})();