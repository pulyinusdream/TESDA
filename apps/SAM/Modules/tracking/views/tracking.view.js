"use strict";
NEXUS_SAM.Modules.Tracking.View=(()=>{
 const esc=s=>(s??"").toString().replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
 const peso=n=>new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP"}).format(Number(n||0));
 const dt=v=>v?new Date(v).toLocaleString("en-PH",{dateStyle:"medium",timeStyle:"short"}):"";
 function list(rows,selected=""){
   const host=document.getElementById("schoolTrackingList");if(!host)return;
   host.innerHTML=rows.length?rows.map(r=>`<button type="button" class="school-case ${r.transactionNo===selected?"selected":""}" data-track-open="${esc(r.transactionNo)}"><span><strong>${esc(r.transactionNo)}</strong><small>${esc(r.rqmCode||r.rqmNo)} · ${esc(r.qualification)}</small></span><span><b>${esc((r.status||"").replaceAll("_"," "))}</b><small>${peso(r.claimAmount)}</small></span></button>`).join(""):'<div class="empty-state">No billing transaction has been finalized yet.</div>';
 }
 function detail(tx){
   const host=document.getElementById("schoolTrackingDetail");if(!host)return;
   if(!tx){host.innerHTML='<div class="empty-state">Select a billing transaction to view its journey.</div>';return;}
   const idx=NEXUS_SAM.Modules.Tracking.Service.stageIndex(tx),stages=NEXUS_SAM.Modules.Tracking.Service.stages;
   const journey=stages.map((s,i)=>`<div class="journey-stage ${i<idx?"complete":i===idx?"current":"future"}"><div class="journey-dot">${i<idx?"✓":i+1}</div><div><strong>${esc(s.label)}</strong><small>${esc(s.desc)}</small>${i===idx?`<b class="current-label">Current: ${esc((tx.status||"").replaceAll("_"," "))}</b>`:""}</div></div>`).join("");
   const events=[...(tx.events||[])].reverse().slice(0,8).map(e=>`<li><strong>${esc((e.type||"").replaceAll("_"," "))}</strong><span>${esc(dt(e.at))} · ${esc(e.by||"")}</span><small>${esc(e.remarks||"")}</small></li>`).join("");
   const action=NEXUS_SAM.Modules.Tracking.Service.actionMessage(tx),queue=NEXUS_SAM.Modules.Tracking.Service.queueInfo(tx);
   host.innerHTML=`<section class="tracking-hero ${tx.status==="FOR_COMPLIANCE"?"needs-action":""}"><span class="eyebrow">${tx.status==="FOR_COMPLIANCE"?"SCHOOL ACTION REQUIRED":"BILLING STATUS"}</span><h2>${esc((tx.status||"").replaceAll("_"," "))}</h2><p>${esc(action)}</p><div class="tracking-control"><span>Billing Transaction Number</span><strong>${esc(tx.transactionNo)}</strong><small>Receiving Control No.: ${esc(tx.controlNo||"Not yet assigned")}</small></div></section>
   <section class="tracking-journey-card"><div class="section-title"><span>APPLICATION JOURNEY</span><h3>Your Scholarship Billing Process</h3><p>The highlighted stage shows where this billing is now.</p></div><div class="journey">${journey}</div></section>
   ${queue.position?`<section class="queue-card"><div><span>PROVINCIAL OFFICE BILLING QUEUE</span><h3>You are currently Queue No. ${queue.position}</h3><p>${queue.ahead} received billing case(s) are ahead of this transaction. ${queue.receivedCount} active received billing case(s) are currently in the Provincial Office processing queue.</p></div><div class="queue-number">${queue.position}</div></section>`:`<section class="queue-card pending"><div><span>BILLING QUEUE</span><h3>Queue number will be assigned after hard-copy receipt</h3><p>The transaction is not yet part of the Provincial Office received-billing queue.</p></div></section>`}<section class="tracking-info-grid"><article><span>RQM</span><strong>${esc(tx.rqmCode||tx.rqmNo)}</strong></article><article><span>Qualification</span><strong>${esc(tx.qualification)}</strong></article><article><span>Claim</span><strong>${esc(tx.claimLabel)}</strong></article><article><span>Amount</span><strong>${peso(tx.claimAmount)}</strong></article><article><span>Current Holder</span><strong>${esc((tx.physicalHolder||"").replaceAll("_"," "))}</strong></article><article><span>Last Updated</span><strong>${esc(dt(tx.updatedAt||tx.createdAt))}</strong></article></section>
   ${tx.status==="FOR_COMPLIANCE"?`<section class="compliance-alert"><strong>Deficiency / Required Compliance</strong><p>${esc(tx.deficiencyNote||"Please contact the Scholarship Section for the noted deficiency.")}</p></section>`:""}
   <section class="tracking-events"><h3>Recent Updates</h3><ul>${events||"<li>No events recorded.</li>"}</ul></section>`;
 }
 return Object.freeze({list,detail});
})();