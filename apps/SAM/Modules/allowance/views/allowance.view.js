"use strict";
NEXUS_SAM.Modules.Allowance.View = (()=>{
 const esc=s=>(s??"").toString().replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
 const peso=n=>new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP"}).format(Number(n||0));
 function batches(rows){const sel=document.getElementById("allowanceBatchId"),cur=sel.value;sel.innerHTML=`<option value="">Select batch...</option>`+rows.map(r=>`<option value="${esc(r.batchId)}">${esc(r.rqmNo)} · ${esc(r.qualificationTitle)} · ${esc(r.tvi)}</option>`).join("");if(rows.some(r=>r.batchId===cur))sel.value=cur;}
 function summary(result){
   const s=result.summary||{},set=(k,v)=>document.querySelectorAll(`[data-allow-summary="${k}"]`).forEach(el=>el.textContent=v);
   set("scholars",s.scholars||0);set("reports",`${s.reports||0}/${s.expectedDays||0}`);set("pending",s.pending||0);set("review",s.review||0);set("projected",peso(s.projected||0));
   const state=document.getElementById("allowanceReadyState");if(state){state.className=`readiness ${s.ready?"ready":"pending"}`;state.textContent=s.ready?"Allowance computation is complete and payroll preview is ready.":"Allowance is provisional. Resolve pending attendance, time anomalies, missing report days, and critical import issues first.";}
   const issue=document.getElementById("allowanceIssues");const items=result.issues||[];issue.hidden=!items.length;issue.innerHTML=items.length?`<strong>Batch issues:</strong><ul>${items.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:"";
 }
 function table(result){
   const body=document.getElementById("allowanceTableBody"),rows=result.rows||[];
   if(!rows.length){body.innerHTML=`<tr><td colspan="11" class="empty-state">Select a batch with imported attendance.</td></tr>`;return;}
   body.innerHTML=rows.map(r=>`<tr class="${r.isReady?"":"row-exception"}"><td><strong>${esc(r.name)}</strong><br><small>${esc(r.email)}</small></td><td>${r.presentDays}</td><td>${r.absentDays}</td><td>${r.pendingDays}</td><td>${r.reviewDays}</td><td>${r.missingDays}</td><td>${r.dayProgress.toFixed(1)}%</td><td>${peso(r.maxTsf)}</td><td>${peso(r.earned)}</td><td>${peso(r.unresolvedAmount)}</td><td><span class="badge ${r.isReady?"badge-success":"badge-warning"}">${esc(r.isReady?"PAYROLL READY":"PROVISIONAL")}</span><br><small>${esc(r.tranche)}</small></td></tr>`).join("");
 }
 function payroll(result){
   const body=document.getElementById("payrollPreviewBody"),rows=(result.rows||[]).filter(r=>r.isReady);
   body.innerHTML=rows.length?rows.map((r,i)=>`<tr><td>${i+1}</td><td><strong>${esc(r.name)}</strong></td><td>${r.presentDays}</td><td>${r.absentDays}</td><td>${peso(r.rate)}</td><td><strong>${peso(r.earned)}</strong></td></tr>`).join(""):`<tr><td colspan="6" class="empty-state">No scholar is payroll-ready yet.</td></tr>`;
 }
 return Object.freeze({batches,summary,table,payroll});
})();