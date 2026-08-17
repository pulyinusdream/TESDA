"use strict";
NEXUS_SPECTRA.Views.TVIMonitor=(()=>{
 const esc=s=>(s??"").toString().replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
 const peso=n=>new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP",maximumFractionDigits:0}).format(Number(n||0));
 function render(rows){const body=document.getElementById("tviMonitorBody");body.innerHTML=rows.length?rows.map(r=>`<tr><td><strong>${esc(r.tvi)}</strong><br><small>${r.rqmCount} RQM allocation(s)</small></td><td>${r.total}</td><td>${peso(r.amount)}</td><td>${r.awaiting}</td><td>${r.review}</td><td>${r.compliance}</td><td>${r.accounting}</td><td>${r.budget}</td><td>${r.cashier}</td><td>${r.paid}</td><td><span class="${r.oldestDays>=7?"aging red":r.oldestDays>=3?"aging amber":"aging"}">${r.oldestDays} day(s)</span></td></tr>`).join(""):'<tr><td colspan="11" class="empty">No TVI billing data yet.</td></tr>'; }
 return Object.freeze({render});
})();