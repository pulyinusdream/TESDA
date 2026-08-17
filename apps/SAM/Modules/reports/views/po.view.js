"use strict";
NEXUS_SAM.Modules.Reports.POView = (()=>{
 const esc=s=>(s??"").toString().replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
 function batches(rows){const sel=document.getElementById("poBatchId"),cur=sel.value;sel.innerHTML=`<option value="">Select finalized batch...</option>`+rows.map(r=>`<option value="${esc(r.batchId)}">${esc(r.rqmNo)} · ${esc(r.qualificationTitle)} · ${esc(r.tvi)}</option>`).join("");if(rows.some(r=>r.batchId===cur))sel.value=cur;}
 function profile(p){const saved=document.getElementById("poSaveStatus");if(saved)saved.textContent=p.updatedAt?`✓ Saved ${new Date(p.updatedAt).toLocaleString()}`:"Not yet saved";["poCertifiedBy","poApprovedBy","poAccountingBy","poDisbursingBy"].forEach(id=>document.getElementById(id).value=p[id]||"");}
 function state(d){const el=document.getElementById("poReadyState");el.className=`readiness ${d.ok?"ready":"pending"}`;el.textContent=d.ok?"Batch is finalized. Provincial Office payroll can be generated.":"Payroll is locked until the school attendance/allowance package is fully finalized.";document.getElementById("btnGeneratePoPayroll").disabled=!d.ok;}
 return Object.freeze({batches,profile,state});
})();