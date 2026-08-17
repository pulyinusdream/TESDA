"use strict";
TAESF.NTTC.ApplicantPortalView=(()=>{
  function esc(s){return String(s??"").replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;"}[c]));}
  function fmtDate(v){if(!v)return "Not yet";const d=new Date(v);return Number.isNaN(d.getTime())?esc(v):d.toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"});}
  function process(application){
    const S=TAESF.NTTC.Constants.STATUS;
    const groups=[
      {key:"online",label:"Online Application",desc:"Profile, prerequisites and document upload",statuses:[S.DRAFT,S.READY_FOR_ONLINE_SUBMISSION]},
      {key:"review",label:"CAC Initial Review",desc:"Initial documentary review and compliance",statuses:[S.SUBMITTED_FOR_INITIAL_REVIEW,S.UNDER_INITIAL_REVIEW,S.WITH_DEFICIENCY,S.COMPLIANCE_SUBMITTED,S.UNDER_RE_REVIEW]},
      {key:"hardcopy",label:"Hard-Copy Submission",desc:"Notarization, scheduled visit and document verification",statuses:[S.APPROVED_FOR_HARDCOPY_SUBMISSION,S.SUBMISSION_SCHEDULED,S.APPOINTMENT_CONFIRMED,S.APPLICANT_ARRIVED,S.HARDCOPY_UNDER_VERIFICATION,S.HARDCOPY_RECEIVED,S.ORIGINALS_VERIFIED]},
      {key:"po",label:"Provincial Processing",desc:"Provincial processing and endorsement for transmittal",statuses:[S.FOR_PO_PROCESSING,S.FOR_PD_ENDORSEMENT,S.READY_FOR_RO_TRANSMITTAL]},
      {key:"ro",label:"Regional Office",desc:"Regional Office review, processing and issuance",statuses:[S.TRANSMITTED_TO_REGIONAL_OFFICE,S.REGIONAL_OFFICE_PROCESSING,S.RETURNED_BY_REGIONAL_OFFICE,S.FOR_COMPLIANCE_WITH_RO_FINDING,S.RETRANSMITTED_TO_REGIONAL_OFFICE]},
      {key:"ready",label:"Certificate Ready",desc:"Certificate received by the Provincial Office",statuses:[S.NTTC_RECEIVED_FROM_RO,S.CERTIFICATE_RECORDED,S.CERTIFICATE_READY_FOR_RELEASE]},
      {key:"released",label:"Released",desc:"Certificate released and application completed",statuses:[S.RELEASED,S.CLOSED]}
    ];
    let idx=groups.findIndex(g=>g.statuses.includes(application.status));if(idx<0)idx=0;
    return groups.map((g,i)=>({...g,state:i<idx?"done":i===idx?"current":"upcoming"}));
  }
  function processHtml(application){
    return `<div class="app-process-map">${process(application).map((g,i)=>`<div class="process-stage ${g.state}"><div class="process-marker">${g.state==="done"?"✓":i+1}</div><div class="process-copy"><strong>${esc(g.label)}</strong><span>${esc(g.desc)}</span>${g.state==="current"?`<small>Current: ${esc(TAESF.NTTC.Workflow.applicantStage(application.status))}</small>`:""}</div></div>`).join("")}</div>`;
  }
  function appCard(app){
    const stage=TAESF.NTTC.Workflow.applicantStage(app.status);
    const control=app.controlNumber||"Draft — no control number yet";
    return `<article class="application-history-card" data-app-id="${esc(app.applicationId)}"><div class="application-history-main"><span class="history-status">${esc(stage)}</span><h3>${esc(app.qualificationTitle||"NTTC Application Draft")}</h3><p>${esc(control)}</p><div class="history-meta"><span>Created ${fmtDate(app.createdAt)}</span><span>Updated ${fmtDate(app.updatedAt)}</span></div></div><div class="application-history-actions"><button class="secondary open-application" data-app-id="${esc(app.applicationId)}" type="button">Open application</button></div></article>`;
  }
  function render(applicant,applications){
    const apps=[...applications].sort((a,b)=>String(b.updatedAt||"").localeCompare(String(a.updatedAt||"")));
    const latest=apps[0]||null;
    const completed=apps.filter(a=>[TAESF.NTTC.Constants.STATUS.RELEASED,TAESF.NTTC.Constants.STATUS.CLOSED].includes(a.status)).length;
    const active=apps.length-completed;
    return `<main class="application-shell portal-shell"><header class="application-topbar"><div class="app-brand"><img src="../../assets/Logo.png" alt="TESDA Logo"><div><span>NEXUS • NTTC APPLICANT PORTAL</span><strong>TESDA Albay Provincial Office</strong></div></div><div class="applicant-menu"><div class="applicant-meta"><strong>${esc(applicant.fullName||[applicant.firstName,applicant.middleName,applicant.lastName,applicant.extensionName].filter(Boolean).join(" "))}</strong><span>${esc(applicant.learnerId||"")}</span></div><button id="logoutApplicant" class="secondary icon-button">Exit</button></div></header>
    <section class="portal-hero"><img class="nexus-watermark" src="../../assets/Logo.png" alt="" aria-hidden="true"><div><span class="eyebrow light">MY NTTC APPLICATIONS</span><h1>Track every application in one place.</h1><p>Start a new application for another qualification, continue an existing application, or monitor applications already transmitted for processing.</p></div><button id="newApplication" class="portal-new-button" type="button"><span>＋</span> Start New NTTC Application</button></section>
    <section class="portal-summary"><article><span>Total Applications</span><strong>${apps.length}</strong></article><article><span>Active / Processing</span><strong>${active}</strong></article><article><span>Completed</span><strong>${completed}</strong></article></section>
    ${latest?`<section class="portal-panel current-progress-panel"><div class="portal-panel-head"><div><span class="eyebrow">CURRENT / MOST RECENT APPLICATION</span><h2>${esc(latest.qualificationTitle||"Application Draft")}</h2><p>${esc(latest.controlNumber||"Draft application")}</p></div><button class="primary modern-primary open-application" data-app-id="${esc(latest.applicationId)}" type="button">View application <span>→</span></button></div>${processHtml(latest)}</section>`:`<section class="portal-panel empty-portal"><h2>No NTTC applications yet</h2><p>Select <strong>Start New NTTC Application</strong> to begin your first application.</p></section>`}
    <section class="portal-panel"><div class="portal-panel-head"><div><span class="eyebrow">APPLICATION HISTORY</span><h2>All applications</h2><p>Each qualification has its own application record and control number after online submission.</p></div></div><div class="application-history-list">${apps.length?apps.map(appCard).join(""):`<div class="empty-state">No application records yet.</div>`}</div></section>
    <div class="policy-note portal-policy"><strong>Important:</strong> ${esc(TAESF.NTTC.Constants.DISCLAIMER)}</div></main>`;
  }
  return Object.freeze({render,processHtml,process});
})();
