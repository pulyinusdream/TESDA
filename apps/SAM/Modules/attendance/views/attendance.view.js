"use strict";
NEXUS_SAM.Modules.Attendance.View = (()=>{
 const esc=s=>(s??"").toString().replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
 function renderBatchOptions(rows){const sel=document.getElementById("attendanceBatchId"),current=sel.value;sel.innerHTML=`<option value="">Select batch...</option>`+rows.map(r=>`<option value="${esc(r.batchId)}">${esc(r.rqmNo)} · ${esc(r.qualificationTitle)} · ${esc(r.tvi)}</option>`).join("");if(rows.some(r=>r.batchId===current))sel.value=current;}
 function setProgress(text="",busy=false){const el=document.getElementById("importProgress");el.hidden=!text;el.textContent=text;document.getElementById("btnImportBsrs").disabled=busy;}
 function errors(items=[]){const box=document.getElementById("attendanceErrors");box.hidden=!items.length;box.innerHTML=items.length?`<strong>Import notice:</strong><ul>${items.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:"";}
 function badgeText(text,kind="neutral"){return `<span class="badge badge-${kind}">${esc(text)}</span>`;}
 function reportCards(rows,selectedId=""){
   const host=document.getElementById("attendanceReportList");
   host.innerHTML=rows.length?rows.map(r=>{
     const state=NEXUS_SAM.Modules.Attendance.Service.reportState(r),total=r.scholars.length,validated=total-state.pending,pct=total?Math.round(validated/total*100):0;
     const notices=(r.warnings||[]).slice(0,2).map(w=>`<li class="${w.severity}">${esc(w.message)}</li>`).join("");
     return `<article class="attendance-report-card visual ${r.attendanceImportId===selectedId?"selected":""} state-${state.kind}" data-report-card="${esc(r.attendanceImportId)}">
       <div class="report-state-icon" aria-hidden="true">${state.kind==="success"?"✓":state.kind==="danger"?"!":"⚠"}</div>
       <div class="report-card-main"><div class="report-title-row"><strong>${esc(r.attendanceDate||"DATE NOT READ")}</strong>${badgeText(state.label,state.kind)}</div>
       <small>Report ${esc(r.reportNumber||"NOT READ")} · ${total} scholars · ${state.pending} pending validation</small>
       <div class="mini-progress"><span style="width:${pct}%"></span></div><small>${validated}/${total} records resolved (${pct}%) · ${esc(r.fileName)}</small>
       ${notices?`<ul class="report-notices">${notices}</ul>`:""}</div>
       <div class="actions"><button type="button" class="btn btn-primary btn-sm" data-att-action="view" data-id="${esc(r.attendanceImportId)}">Review Attendance</button> <button type="button" class="btn btn-danger btn-sm" data-att-action="remove" data-id="${esc(r.attendanceImportId)}">Remove</button></div>
     </article>`;
   }).join(""):`<div class="empty-state">${document.getElementById("attendanceBatchId")?.value?"No BSRS attendance reports imported for this batch.":"Select a scholarship batch to view or import BSRS attendance."}</div>`;}
 function badge(s){const map={COMPLETE_BSRS:"badge-success",MISSING_TIME_IN:"badge-warning",MISSING_TIME_OUT:"badge-warning",NO_BSRS_LOG:"badge-danger"};return `<span class="badge ${map[s]||"badge-neutral"}">${esc((s||"").replaceAll("_"," "))}</span>`;}
 function detail(r){const section=document.getElementById("attendanceDetail"),meta=document.getElementById("attendanceDetailMeta"),body=document.getElementById("attendanceDetailBody");if(!r){section.hidden=true;meta.textContent="Select an imported report to view extracted attendance.";body.innerHTML=`<tr><td colspan="8" class="empty-state">No report selected.</td></tr>`;return;}
 section.hidden=false;const state=NEXUS_SAM.Modules.Attendance.Service.reportState(r);meta.innerHTML=`<strong>${esc(r.qualification||"Qualification not read")}</strong> · ${esc(r.attendanceDate||"Date not read")} · Report ${esc(r.reportNumber||"—")} ${badgeText(state.label,state.kind)}<br><small>${esc(r.tvi||"")} ${r.sessionStart||r.sessionEnd?`· Session ${esc(r.sessionStart||"—")}–${esc(r.sessionEnd||"—")}`:""}</small>`;
 body.innerHTML=r.scholars.map(s=>{const val=NEXUS_SAM.Modules.Validation?.Repository?.find(r.attendanceImportId,s.no);const vstatus=val?'<span class="badge badge-success">VALIDATED</span>':(s.attendanceStatus==="COMPLETE_BSRS"?'<span class="badge badge-success">VALIDATED</span>':'<span class="badge badge-warning">FOR VALIDATION</span>');const finalIn=val?.finalTimeIn||s.bsrsTimeIn||"—",finalOut=val?.finalTimeOut||s.bsrsTimeOut||"—";return `<tr class="${s.attendanceStatus!=="COMPLETE_BSRS"&&!val?"row-exception":""}"><td>${s.no}</td><td><strong>${esc(s.name)}</strong><br><small>${esc(s.email)}</small></td><td>${esc(s.bsrsTimeIn||"—")}</td><td>${esc(s.bsrsTimeOut||"—")}</td><td>${esc(s.bsrsDuration||"—")}</td><td>${badge(s.attendanceStatus)}</td><td>${esc(finalIn)} – ${esc(finalOut)}</td><td>${vstatus}</td></tr>`;}).join("");}
 function summary(s){const set=(key,val)=>document.querySelectorAll(`[data-att-summary="${key}"]`).forEach(el=>el.textContent=val);set("reports",s.reports);set("records",s.attendanceRecords);set("complete",s.complete);set("exceptions",s.exceptions);set("critical",s.criticalReports||0);set("ready",s.readyReports||0);}
 function timeline(batch,rows){
   const host=document.getElementById("attendanceTimeline");if(!host)return;
   if(!batch){host.innerHTML=`<div class="empty-state compact">Select a batch to show attendance coverage.</div>`;return;}
   const expected=Number(batch.approvedTrainingDays||0),uniqueDates=new Set(rows.map(r=>r.attendanceDate).filter(Boolean));
   host.innerHTML=`<div class="coverage-head"><div><strong>Attendance Coverage</strong><small>${uniqueDates.size} dated report(s) imported against ${expected} approved training day(s)</small></div><div class="coverage-count ${uniqueDates.size>=expected?"ok":"warn"}">${uniqueDates.size}/${expected}</div></div>
   <div class="timeline-pills">${rows.map(r=>{const st=NEXUS_SAM.Modules.Attendance.Service.reportState(r);return `<button type="button" class="timeline-pill ${st.kind}" data-att-action="view" data-id="${esc(r.attendanceImportId)}" title="${esc(st.label)}">${esc(r.attendanceDate||"?")}</button>`;}).join("")||'<span class="muted">No reports yet.</span>'}</div>`;
 }
 return Object.freeze({renderBatchOptions,setProgress,errors,reportCards,detail,summary,timeline});
})();