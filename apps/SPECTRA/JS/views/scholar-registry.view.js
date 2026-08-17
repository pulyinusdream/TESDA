"use strict";
NEXUS_SPECTRA.Views.ScholarRegistry=(()=>{
 const esc=s=>(s??"").toString().replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
 const peso=n=>Number(n||0).toLocaleString("en-PH",{style:"currency",currency:"PHP"});
 function ensureFilters(){
   const search=document.getElementById("sharedScholarSearch");if(!search)return;
   const bar=search.closest(".role-filterbar")||search.parentElement;
   if(document.getElementById("sharedScholarSchool"))return;
   const opts=NEXUS_SPECTRA.Services.ScholarRegistry.options();
   const school=document.createElement("select");school.id="sharedScholarSchool";school.innerHTML='<option value="">All Schools</option>'+opts.schools.map(x=>`<option>${esc(x)}</option>`).join("");
   const qual=document.createElement("select");qual.id="sharedScholarQualification";qual.innerHTML='<option value="">All Qualifications</option>'+opts.qualifications.map(x=>`<option>${esc(x)}</option>`).join("");
   const status=document.createElement("select");status.id="sharedScholarStatus";status.innerHTML='<option value="">All Statuses</option>'+opts.statuses.map(x=>`<option>${esc(x)}</option>`).join("");
   bar.append(school,qual,status);
   const summary=document.createElement("div");summary.id="sharedScholarSummary";summary.className="role-kpis scholar-summary";bar.after(summary);
 }
 function render(){
   const host=document.getElementById("sharedScholarResults");if(!host)return;ensureFilters();
   const q=document.getElementById("sharedScholarSearch")?.value||"",school=document.getElementById("sharedScholarSchool")?.value||"",qualification=document.getElementById("sharedScholarQualification")?.value||"",status=document.getElementById("sharedScholarStatus")?.value||"";
   const rows=NEXUS_SPECTRA.Services.ScholarRegistry.filter({q,school,qualification,status}),m=NEXUS_SPECTRA.Services.ScholarRegistry.summary(rows);
   const sh=document.getElementById("sharedScholarSummary");if(sh)sh.innerHTML=`<article><span>Scholars</span><strong>${m.scholars}</strong></article><article><span>RQM Enrollments</span><strong>${m.enrollments}</strong></article><article><span>Ongoing</span><strong>${m.ongoing}</strong></article><article><span>Completed</span><strong>${m.completed}</strong></article><article><span>Assessed</span><strong>${m.assessed}</strong></article><article><span>Certified</span><strong>${m.certified}</strong></article>`;
   if(!q.trim()&&!school&&!qualification&&!status){host.innerHTML='<div class="role-empty"><strong>Use the filters or search a scholar.</strong><p>Filter by school when the scholar cannot be located immediately, then narrow by qualification or status.</p></div>';return;}
   host.innerHTML=rows.length?rows.map(s=>`<article class="scholar-registry-card"><div class="scholar-registry-head"><div><strong>${esc(s.fullName||s.name)}</strong><small>ULI: ${esc(s.uli||"Not recorded")} · T2MIS ULI: ${esc(s.t2misUli||"Not recorded")}</small></div><span>${s.histories.length} RQM enrollment(s)</span></div><div class="table-wrap"><table><thead><tr><th>RQM / School / Qualification</th><th>Training Status</th><th>Assessment</th><th>Cost / Benefit Basis</th><th>Payment / Benefit Status</th><th>Toolkit</th></tr></thead><tbody>${s.histories.map(h=>`<tr><td><strong>${esc(h.rqmCode||h.rqmNo)}</strong><small>${esc(h.tvi||h.provider||"")} · ${esc(h.qualification)}</small></td><td><span class="role-status">${esc(h.trainingStatus||h.transactionStatus||"—")}</span><small>${esc(h.trainingStart||"—")} to ${esc(h.trainingEnd||"—")} · ${esc(h.trainingResult||"")}</small></td><td>${esc(h.assessmentResult||"Not yet assessed")}<small>${esc(h.assessmentDate||h.assessmentSchedule||"No date/schedule")}</small></td><td>TSF ${peso(h.tsfPerPax||h.tsfTotal||0)}<small>Training ${peso(h.trainingCostPerPax||0)} · Assessment ${peso(h.assessmentFeePerPax||0)}</small></td><td>${(h.benefits||[]).length?(h.benefits||[]).map(b=>`<span class="role-status">${esc((b.components||[]).join(" + ")||"Billing")}: ${esc(String(b.status||"").replaceAll("_"," "))}</span>`).join(" "):'<span class="role-status">No billing transaction yet</span>'}</td><td>${h.toolkitApplicable?esc(String(h.toolkitStatus||"PENDING_TITAN_LINK").replaceAll("_"," ")):"Not applicable"}</td></tr>`).join("")}</tbody></table></div></article>`).join(""):'<div class="role-empty"><strong>No scholar found for the selected filters.</strong><p>Try All Schools or another qualification/status.</p></div>';
 }
 return Object.freeze({render,ensureFilters});
})();