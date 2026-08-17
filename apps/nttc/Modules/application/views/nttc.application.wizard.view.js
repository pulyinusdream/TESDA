"use strict";
TAESF.NTTC.ApplicationWizardView = (()=>{
  function esc(s){return String(s??"").replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;"}[c]));}
  function option(value,current){return `<option value="${esc(value)}" ${current===value?"selected":""}>${esc(value)}</option>`;}
  function render(applicant,application){
    const qs=TAESF.NTTC.QualificationService.list();
    const qOptions=qs.map(q=>`<option value="${esc(q.qualificationCode)}" ${application.qualificationCode===q.qualificationCode?"selected":""}>${esc(q.qualificationTitle)}</option>`).join("");
    const nc=application.credentials.nc||{},tmc=application.credentials.tmc||{},d=application.applicationDetails||{};
    const ncExpiry=TAESF.NTTC.PrerequisiteValidator.expectedValidity(nc.issuedOn);
    const tmExpiry=TAESF.NTTC.PrerequisiteValidator.expectedValidity(tmc.issuedOn);
    const employmentOptions=TAESF.NTTC.Constants.EMPLOYMENT_STATUSES.map(v=>option(v,d.employmentStatus)).join("");
    return `<main class="application-shell">
      <header class="application-topbar">
        <div class="app-brand"><img src="../../assets/Logo.png" alt="TESDA Logo"><div><span>NEXUS • NTTC ONLINE PRE-SCREENING</span><strong>TESDA Albay Provincial Office</strong></div></div>
        <div class="applicant-menu"><div class="applicant-meta"><strong>${esc(applicant.fullName||[applicant.firstName,applicant.lastName].join(" "))}</strong><span>${esc(applicant.learnerId||"")}</span></div><button id="myApplications" class="secondary icon-button">My Applications</button><button id="logoutApplicant" class="secondary icon-button">Exit</button></div>
      </header>
      <section class="application-banner"><img class="nexus-watermark" src="../../assets/Logo.png" alt="" aria-hidden="true"><div><span class="eyebrow light">APPLICATION WIZARD</span><h1>Qualification & prerequisite check</h1><p>Verify the basic NTTC requirements before proceeding to documentary uploads.</p></div><span class="status-pill strong">${esc(application.status.replaceAll("_"," "))}</span></section>
      <nav class="modern-stepper" aria-label="Application progress"><div class="step done"><b>1</b><span>Profile</span></div><div class="step active"><b>2</b><span>Prerequisites</span></div><div class="step"><b>3</b><span>Documents</span></div><div class="step"><b>4</b><span>Review</span></div></nav>
      <section class="nexus-form-card wide">
        <form id="applicationWizardForm" class="modern-form">
          <div class="form-section span-2"><span class="section-number">01</span><div><h2>Qualification details</h2><p>Select the qualification for which the NTTC will be applied.</p></div></div>
          <div class="field span-2"><label>Qualification Applying For <b>*</b></label><select name="qualificationCode" required><option value="">Select qualification</option>${qOptions}</select><small>The full TESDA qualification master can be loaded later without changing this application flow.</small></div>
          <div class="field span-2"><label>TVI / Institution <b>*</b></label><input name="tviName" required value="${esc(d.tviName)}" placeholder="Enter complete institution name"></div>
          <div class="field"><label>Employment Status <b>*</b></label><select name="employmentStatus" required><option value="">Select employment status</option>${employmentOptions}</select></div>
          <div class="field"><label>Years of Teaching Experience</label><input name="yearsTeaching" type="number" min="0" step="0.01" value="${esc(d.yearsTeaching)}"></div>

          <div class="form-section span-2"><span class="section-number">02</span><div><h2>National Certificate</h2><p>Enter the certificate details exactly as printed. The CAC focal will still verify the certificate during review.</p></div></div>
          <div class="field"><label>NC Certificate Number <b>*</b></label><input name="ncCertificateNumber" inputmode="numeric" pattern="[0-9]{14}" maxlength="14" required value="${esc(nc.certificateNumber)}" placeholder="26050502006032"><small>Use the complete 14-digit certificate number.</small></div>
          <div class="field"><label>NC Level <b>*</b></label><select name="ncLevel" required><option value="">Select</option>${["NC II","NC III","NC IV"].map(v=>option(v,nc.level)).join("")}</select></div>
          <div class="field"><label>NC Date Issued <b>*</b></label><input id="ncIssuedOn" name="ncIssuedOn" type="date" required value="${esc(nc.issuedOn)}"></div>
          <div class="field"><label>Expected Validity</label><input id="ncExpectedValidity" value="${esc(ncExpiry)}" readonly placeholder="Calculated from date issued"><small>Calculated using the five-year validity rule. Subject to focal verification.</small></div>
          <div class="span-2 inline-info">The system performs an initial certificate-number/date consistency check without exposing TESDA's internal coding rule. If the details do not appear consistent, you will be asked to check the certificate number and date issued.</div>

          <div class="form-section span-2"><span class="section-number">03</span><div><h2>Trainers Methodology Certificate I</h2><p>Provide the current TM Level I certificate details.</p></div></div>
          <div class="field"><label>TMC I Certificate Number <b>*</b></label><input name="tmcCertificateNumber" required value="${esc(tmc.certificateNumber)}"></div>
          <div class="field"><label>TM Level</label><input name="tmcLevel" value="I" readonly></div>
          <div class="field"><label>TMC Date Issued <b>*</b></label><input id="tmcIssuedOn" name="tmcIssuedOn" type="date" required value="${esc(tmc.issuedOn)}"></div>
          <div class="field"><label>Expected Validity</label><input id="tmcExpectedValidity" value="${esc(tmExpiry)}" readonly placeholder="Calculated from date issued"><small>Calculated using the five-year validity rule. Subject to focal verification.</small></div>
          <div class="field span-2"><label>Applicant Notes <span>(optional)</span></label><textarea name="notes" rows="3">${esc(d.notes)}</textarea></div>
          <div class="span-2 form-actions split"><button type="button" id="saveDraft" class="secondary">Save draft</button><button type="submit" class="primary modern-primary">Save & continue to documents <span>→</span></button></div>
        </form>
        <div id="wizardMessage" class="message" hidden></div><div class="policy-note"><strong>Important:</strong> ${TAESF.NTTC.Constants.DISCLAIMER}</div>
      </section>
    </main>`;
  }
  return Object.freeze({render});
})();
