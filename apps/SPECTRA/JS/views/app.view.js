"use strict";
NEXUS_SPECTRA.Views.App=(()=>{
 const esc=s=>(s??"").toString().replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
 const peso=n=>new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP"}).format(Number(n||0));
 const dt=v=>v?new Date(v).toLocaleString("en-PH",{dateStyle:"medium",timeStyle:"short"}):"";
 function summary(s){for(const [k,v] of Object.entries(s))document.querySelectorAll(`[data-summary="${k}"]`).forEach(el=>el.textContent=v);}
 function rows(items){
   const body=document.getElementById("transactionTableBody");
   body.innerHTML=items.length?items.map(r=>`<tr><td><button class="link-btn" data-open="${esc(r.transactionNo)}"><strong>${esc(r.transactionNo)}</strong></button><br><small>${esc(r.controlNo||"Awaiting control no.")}</small></td><td>${esc(r.rqmCode||r.rqmNo)}</td><td>${esc(r.tvi)}<br><small>${esc(r.qualification)}</small></td><td>${esc(r.claimLabel)}<br><strong>${peso(r.claimAmount)}</strong></td><td><span class="status-pill">${esc((r.status||"").replaceAll("_"," "))}</span></td><td>${esc((r.physicalHolder||"").replaceAll("_"," "))}</td><td>${esc(dt(r.updatedAt||r.createdAt))}</td></tr>`).join(""):'<tr><td colspan="7" class="empty">No billing transactions found.</td></tr>';
 }
 function detail(r){
   const host=document.getElementById("transactionDetail");if(!r){host.innerHTML='<div class="empty">Select a transaction to see its complete tracking history.</div>';return;}
   const events=[...(r.events||[])].reverse().map(e=>`<div class="event"><span class="dot"></span><div><strong>${esc(e.type.replaceAll("_"," "))}</strong><small>${esc(dt(e.at))} · ${esc(e.by||"")}</small><p>${esc(e.remarks||"")}</p></div></div>`).join("");
   host.innerHTML=`<div class="detail-head"><div><h2>${esc(r.transactionNo)}</h2><p>${esc(r.rqmCode||r.rqmNo)} · ${esc(r.tvi)} · ${esc(r.qualification)}</p></div><div><span class="status-pill">${esc(r.status.replaceAll("_"," "))}</span><small>Holder: ${esc(r.physicalHolder.replaceAll("_"," "))}</small></div></div><div class="detail-grid"><div><b>Control No.</b><span>${esc(r.controlNo||"Not yet assigned")}</span></div><div><b>Claim</b><span>${esc(r.claimLabel)}</span></div><div><b>Amount</b><span>${peso(r.claimAmount)}</span></div><div><b>Hard Copy</b><span>${esc(r.hardCopyStatus.replaceAll("_"," "))}</span></div><div><b>Completeness</b><span>${esc(r.completenessStatus.replaceAll("_"," "))}</span></div><div><b>Snapshot</b><span>v${r.snapshotVersion} · ${esc(r.snapshotHash)}</span></div><div><b>Action Required By</b><span>${esc((r.actionRequiredBy||r.physicalHolder||"").replaceAll("_"," "))}</span></div></div><div class="detail-actions">${r.status==="AWAITING_HARD_COPY"?'<button class="btn primary" data-receive="'+esc(r.transactionNo)+'">Receive Hard Copy</button>':""}${r.controlNo?'<button class="btn" data-print="'+esc(r.transactionNo)+'">Print Routing Sheet</button>':""}</div><h3>Transaction Timeline</h3><div class="timeline">${events}</div>`;
 }
 function notify(message,type="success"){const el=document.getElementById("toast");el.textContent=message;el.className=`toast show ${type}`;setTimeout(()=>el.classList.remove("show"),3500);}
 return Object.freeze({summary,rows,detail,notify});
})();