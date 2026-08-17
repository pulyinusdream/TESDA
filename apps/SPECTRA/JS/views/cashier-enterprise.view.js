"use strict";
NEXUS_SPECTRA.Views.CashierEnterprise=(()=>{
 const esc=s=>(s??"").toString().replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
 const peso=n=>Number(n||0).toLocaleString("en-PH",{style:"currency",currency:"PHP"});
 const dt=v=>v?new Date(v).toLocaleString("en-PH",{dateStyle:"medium",timeStyle:"short"}):"—";
 function dashboard(){
   const m=NEXUS_SPECTRA.Services.CashierWorkspace.metrics(),alerts=NEXUS_SPECTRA.Services.CashierEnterprise.alerts(),q=NEXUS_SPECTRA.Services.PaymentQueue.today(),now=q.find(x=>x.status==="NOW_SERVING");
   document.getElementById("cashEntKpis").innerHTML=`
     <article><span>Client Queue</span><strong>${m.waiting}</strong><small>waiting today</small></article>
     <article><span>Disbursements</span><strong>${m.scholarshipQueue}</strong><small>for cashier action</small></article>
     <article class="${m.unclaimedChecks?"warn":""}"><span>Unclaimed Checks</span><strong>${m.unclaimedChecks}</strong><small>still in custody</small></article>
     <article class="${m.undepositedAmount>0?"warn":""}"><span>Undeposited</span><strong>${peso(m.undepositedAmount)}</strong><small>all funds</small></article>`;
   document.getElementById("cashEntNowServing").innerHTML=now?`<div class="cash-ent-serving"><span>NOW SERVING</span><strong>${esc(now.queueNo)}</strong><h3>${esc(now.payor)}</h3><p>${esc(now.serviceType.replaceAll("_"," "))} · ${peso(now.amount)}</p><button class="cash-ent-primary" data-role-screen="client-payments">Open Queue</button></div>`:'<div class="cash-ent-empty"><strong>No client is being served.</strong><p>Open Client Queue when a payer arrives.</p><button class="cash-ent-primary" data-role-screen="client-payments">Open Client Queue</button></div>';
   document.getElementById("cashEntAlerts").innerHTML=alerts.length?alerts.map(a=>`<article class="cash-ent-alert ${a.level}"><div><strong>${esc(a.title)}</strong><p>${esc(a.message)}</p></div></article>`).join(""):'<div class="cash-ent-empty"><strong>No critical cashier alerts.</strong><p>Current operational records do not require immediate action.</p></div>';
 }
 function records(mode){NEXUS_SPECTRA.Views.CashierWorkspace.records(mode);}
 function archive(){
   const y=document.getElementById("cashArchiveYear")?.value||"",fund=document.getElementById("cashArchiveFund")?.value||"",status=document.getElementById("cashArchiveStatus")?.value||"",q=document.getElementById("cashArchiveSearch")?.value||"",rows=NEXUS_SPECTRA.Services.CashierEnterprise.reportArchive({year:y,fund,status,q}),host=document.getElementById("cashArchiveResults");
   host.innerHTML=rows.length?`<div class="cash-ent-table"><table><thead><tr><th>Period</th><th>Report</th><th>Fund</th><th>Status</th><th>COA Reference</th><th>Filed Location</th><th>View</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.year}-${String(r.month).padStart(2,"0")}</td><td><strong>${esc(r.label)}</strong><small>${esc(r.reportId)}</small></td><td>${esc(r.fund)}</td><td><span class="cash-ent-status">${esc(r.status)}</span></td><td>${esc(r.coaReceivingRef||"—")}</td><td>${esc(r.fileLocation||"—")}</td><td><button class="cash-ent-secondary" data-ent-archive-preview="${esc(r.reportId)}">Preview</button>${r.scanDocumentId?` <button class="cash-ent-secondary" data-ent-archive-scan="${esc(r.reportId)}">Scan</button>`:""}</td></tr>`).join("")}</tbody></table></div>`:'<div class="cash-ent-empty"><strong>No archived reports found.</strong><p>Adjust the search/filter or save a report preview first.</p></div>';
 }
 return Object.freeze({dashboard,records,archive});
})();