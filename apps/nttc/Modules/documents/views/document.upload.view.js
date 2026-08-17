"use strict";
TAESF.NTTC.DocumentUploadView=(()=>{
  function esc(s){return String(s??"").replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;"}[c]));}
  function size(n){const x=Number(n||0);if(x<1024)return x+" B";if(x<1048576)return(x/1024).toFixed(1)+" KB";return(x/1048576).toFixed(1)+" MB";}
  function firstDoc(docs,type){return docs.find(x=>x.documentType===type)||null;}
  function fileBadge(doc,label){
    if(!doc)return `<div class="credential-file empty"><span>Not yet uploaded</span></div>`;
    return `<div class="credential-file"><div><strong>${esc(label)}</strong><span>${esc(doc.fileName)} • ${size(doc.sizeBytes)}</span></div><button class="doc-delete tertiary" data-document-id="${esc(doc.documentId)}" type="button">Remove</button></div>`;
  }
  function renderModalityOptions(){
    const rows=TAESF.NTTC.Constants.IWER_MODALITIES;
    return Object.entries(rows).map(([code,x])=>`<option value="${code}">${esc(x.label)}</option>`).join("");
  }
  function render(applicant,application,documents){
    const D=TAESF.NTTC.Constants.DOCUMENT_TYPES;
    const c=TAESF.NTTC.DocumentService.completeness(application.applicationId);
    const nc=firstDoc(documents,D.NC_CERTIFICATE),tmc=firstDoc(documents,D.TMC_CERTIFICATE);
    const iwer=documents.filter(d=>d.documentType===D.IWER_EVIDENCE);
    const others=documents.filter(d=>![D.NC_CERTIFICATE,D.TMC_CERTIFICATE,D.IWER_EVIDENCE].includes(d.documentType));
    const iwerRows=iwer.length?iwer.map(d=>`<div class="doc-row"><div class="doc-icon">${d.mimeType==="application/pdf"?"PDF":"IMG"}</div><div class="doc-main"><strong>${esc(d.title||"IWER Evidence")}</strong><span>${esc(TAESF.NTTC.DocumentService.modalityGuide(d.modality)?.label||d.modality)}</span><small>${esc(d.fileName)} • ${size(d.sizeBytes)}</small><small class="doc-period">${d.fromDate||d.toDate?`${esc(d.fromDate||"?")} to ${esc(d.toDate||"?")}`:"Dates not encoded"}${d.systemEquivalentHours?` • ${esc(d.systemEquivalentHours.toLocaleString())} system-estimated equivalent hour(s)`:""}</small></div><button class="doc-delete secondary" data-document-id="${esc(d.documentId)}" type="button">Remove</button></div>`).join(""):`<div class="empty-state compact"><strong>No IWER evidence uploaded yet.</strong><span>Select the category that best describes your experience below. The system will explain each choice before you upload.</span></div>`;
    const otherRows=others.length?others.map(d=>`<div class="doc-row"><div class="doc-icon">${d.mimeType==="application/pdf"?"PDF":"IMG"}</div><div class="doc-main"><strong>${esc(d.title||TAESF.NTTC.DocumentService.label(d.documentType))}</strong><span>${esc(TAESF.NTTC.DocumentService.label(d.documentType))}</span><small>${esc(d.fileName)} • ${size(d.sizeBytes)}</small></div><button class="doc-delete secondary" data-document-id="${esc(d.documentId)}" type="button">Remove</button></div>`).join(""):"";
    return `<main class="application-shell">
      <header class="application-topbar"><div class="app-brand"><img src="../../assets/Logo.png" alt="TESDA Logo"><div><span>NEXUS • NTTC ONLINE PRE-SCREENING</span><strong>TESDA Albay Provincial Office</strong></div></div><div class="applicant-menu"><div class="applicant-meta"><strong>${esc(applicant.fullName||[applicant.firstName,applicant.lastName].join(" "))}</strong><span>${esc(applicant.learnerId||"")}</span></div><button id="myApplications" class="secondary icon-button">My Applications</button><button id="logoutApplicant" class="secondary icon-button">Exit</button></div></header>
      <section class="application-banner"><img class="nexus-watermark" src="../../assets/Logo.png" alt="" aria-hidden="true"><div><span class="eyebrow light">APPLICATION WIZARD</span><h1>Prepare your supporting documents</h1><p>We will guide you one requirement at a time. You do not need to decide a document category before uploading your NC or TMC I.</p></div><span class="status-pill strong">${c.total} FILE${c.total===1?"":"S"} UPLOADED</span></section>
      <nav class="modern-stepper"><div class="step done"><b>1</b><span>Profile</span></div><div class="step done"><b>2</b><span>Prerequisites</span></div><div class="step active"><b>3</b><span>Documents</span></div><div class="step"><b>4</b><span>Review</span></div></nav>

      <section class="guided-upload-shell">
        <div class="upload-help-banner"><div class="help-icon">i</div><div><strong>Before you upload</strong><p>Use clear, complete and readable copies. This online submission is for initial review only. The CAC focal will still verify the documents and the originals/hard copies later. Accepted files: PDF, JPG/JPEG and PNG, up to 10 MB each.</p></div></div>

        <div class="upload-progress-card"><div class="req ${nc?"ok":""}"><b>${nc?"✓":"1"}</b><span><strong>National Certificate</strong><small>${nc?"Uploaded":"Required"}</small></span></div><div class="progress-line"></div><div class="req ${tmc?"ok":""}"><b>${tmc?"✓":"2"}</b><span><strong>TMC I</strong><small>${tmc?"Uploaded":"Required"}</small></span></div><div class="progress-line"></div><div class="req ${iwer.length?"ok":""}"><b>${iwer.length?"✓":"3"}</b><span><strong>IWER Evidence</strong><small>${iwer.length?iwer.length+" uploaded":"At least one required"}</small></span></div></div>

        <section class="upload-section credential-section">
          <div class="section-title"><span class="section-kicker">STEP A • CREDENTIALS</span><h2>Upload your National Certificate and TMC I</h2><p>These are your NTTC prerequisites. They are <strong>not</strong> IWER evidence, so you do not need to select an IWER modality for either document.</p></div>
          <div class="credential-grid">
            <form id="ncUploadForm" class="credential-upload-card ${nc?"complete":""}">
              <div class="credential-card-head"><span class="credential-number">01</span><div><h3>National Certificate (NC)</h3><p>Upload the same NC whose certificate number and date you entered in Step 2.</p></div></div>
              <div class="upload-note"><strong>Check before uploading:</strong> The qualification, certificate number, name and dates should be readable.</div>
              <label class="file-drop"><input name="file" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" required><span><strong>${nc?"Choose a replacement file":"Choose your NC file"}</strong><small>PDF, JPG/JPEG or PNG • maximum 10 MB</small></span></label>
              <button class="primary modern-primary" type="submit">${nc?"Replace NC upload":"Upload National Certificate"} <span>↑</span></button>
              ${fileBadge(nc,"Current NC upload")}
            </form>

            <form id="tmcUploadForm" class="credential-upload-card ${tmc?"complete":""}">
              <div class="credential-card-head"><span class="credential-number">02</span><div><h3>Trainers Methodology Certificate I</h3><p>Upload your TMC I supporting the prerequisite information entered in Step 2.</p></div></div>
              <div class="upload-note"><strong>Check before uploading:</strong> Your name, TMC I certificate number and dates should be complete and readable.</div>
              <label class="file-drop"><input name="file" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" required><span><strong>${tmc?"Choose a replacement file":"Choose your TMC I file"}</strong><small>PDF, JPG/JPEG or PNG • maximum 10 MB</small></span></label>
              <button class="primary modern-primary" type="submit">${tmc?"Replace TMC I upload":"Upload TMC I"} <span>↑</span></button>
              ${fileBadge(tmc,"Current TMC I upload")}
            </form>
          </div>
        </section>

        <section class="upload-section iwer-section">
          <div class="section-title"><span class="section-kicker">STEP B • INDUSTRY WORK EXPERIENCE</span><h2>Upload proof of your Industry Work Experience (IWER)</h2><p>IWER is separate from your NC and TMC I. First tell us <strong>how you gained the relevant industry experience</strong>. After you choose, NEXUS will explain what the category means and what kind of supporting evidence may apply.</p></div>
          <div class="iwer-explainer"><div class="iwer-question"><strong>Not sure which one to choose?</strong><p>Select the description closest to your actual experience. This choice only helps organize your initial submission. The CAC focal/PTAG will still review the documents and determine the proper credit.</p></div></div>
          <aside class="iwer-reference-panel" aria-label="IWER reference materials">
            <div class="reference-panel-copy"><span class="section-kicker">REFERENCE MATERIALS</span><h3>Want to read the official TESDA guidelines?</h3><p>You may open the implementing guidelines used by this application. You do not need to read the circulars before applying—the guides on this page are written to help you—but the official references are available if you want more detail.</p></div>
            <div class="reference-links">
              <a class="reference-link primary-reference" href="References/TESDA_Circular_033_s2017_IWER.pdf" target="_blank" rel="noopener"><span><strong>TESDA Circular No. 33, s. 2017</strong><small>Primary guideline on the Credit Equivalency System for Industry Work Experience Required (IWER) of TVET Trainers</small></span><b>Open PDF ↗</b></a>
              <a class="reference-link" href="References/TESDA_Circular_050_s2017_RPIIT.pdf" target="_blank" rel="noopener"><span><strong>TESDA Circular No. 50, s. 2017</strong><small>Regional Program on Industry Immersion of Trainers (RPIIT)</small></span><b>Open PDF ↗</b></a>
              <a class="reference-link" href="References/TESDA_Circular_051_s2017_Equivalent_IWER.pdf" target="_blank" rel="noopener"><span><strong>TESDA Circular No. 51, s. 2017</strong><small>Equivalent IWER credits for teaching experience and other recognized modalities</small></span><b>Open PDF ↗</b></a>
              <details class="reference-more"><summary>NTTC Level I supporting guideline</summary><a class="reference-link compact-reference" href="References/TESDA_Circular_020_s2014_NTTC_Level_I.pdf" target="_blank" rel="noopener"><span><strong>TESDA Circular No. 20, s. 2014</strong><small>Amended Guidelines on Competency Assessment and Certification of TVET Trainers for TM Level I</small></span><b>Open PDF ↗</b></a></details>
            </div>
          </aside>
          <form id="iwerUploadForm" class="iwer-upload-form">
            <div class="field span-2"><label>How did you gain this Industry Work Experience? <b>*</b></label><select name="modality" id="iwerModality" required><option value="">Select the option that best describes your experience</option>${renderModalityOptions()}</select><small>You can upload more than one evidence and use different categories when applicable.</small></div>
            <div id="modalityGuide" class="modality-guide span-2" hidden></div>
            <div class="field span-2"><label>Evidence Title <span>(recommended)</span></label><input name="title" placeholder="Example: Certificate of Employment - ABC Manufacturing"><small>Use a short title that will help the focal recognize the document.</small></div>
            <div class="field"><label>Inclusive Date — From <b>*</b></label><input name="fromDate" type="date" required><small>Use the starting date supported by this evidence.</small></div>
            <div class="field"><label>Inclusive Date — To <b>*</b></label><input name="toDate" type="date" required><small>Use the ending date supported by this evidence.</small></div>
            <div class="field span-2"><label>System Estimated Equivalent Hours</label><div id="iwerComputationPreview" class="iwer-computation-preview"><strong>Enter the inclusive dates and select the modality.</strong><span>NEXUS will calculate the proposed hours using the prescribed Form A conversion (1 day = 8 hours; 22 days per month) and apply the selected modality factor. The CAC focal will confirm or replace the proposed hours after reviewing your evidence.</span></div></div>
            <div class="field span-2"><label>Upload supporting evidence <b>*</b></label><label class="file-drop compact-drop"><input name="file" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" required><span><strong>Choose IWER supporting file</strong><small>Upload one document at a time. You can add more after each upload.</small></span></label></div>
            <div class="span-2 form-actions"><button class="primary modern-primary" type="submit">Add IWER evidence <span>↑</span></button></div>
          </form>
          <div class="evidence-list"><div class="side-head"><div><span class="eyebrow">Your IWER uploads</span><h3>Industry experience supporting documents</h3></div><span class="count-badge">${iwer.length}</span></div><div class="document-rows">${iwerRows}</div></div>
        </section>

        <details class="optional-upload-panel">
          <summary><span><strong>Optional supporting documents</strong><small>Government-issued ID or another document you want the focal to see during initial review.</small></span><b>+</b></summary>
          <form id="optionalUploadForm" class="modern-form compact-form">
            <div class="field"><label>Supporting Document Type</label><select name="documentType"><option value="${D.GOVERNMENT_ID}">Government-issued ID</option><option value="${D.OTHER_SUPPORTING}">Other Supporting Document</option></select></div>
            <div class="field"><label>Document Title</label><input name="title" placeholder="Example: Government ID"></div>
            <div class="field span-2"><label>Select File</label><input name="file" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" required></div>
            <div class="span-2 form-actions"><button class="secondary" type="submit">Upload optional document</button></div>
          </form>${otherRows?`<div class="document-rows optional-rows">${otherRows}</div>`:""}
        </details>

        <div id="documentMessage" class="message" hidden></div>
      </section>

      <section class="wizard-footer"><button id="backPrerequisites" class="secondary" type="button">← Back to prerequisites</button><div><span class="mini-status ${c.complete?"complete":""}">${c.complete?"Required uploads complete":"Complete NC, TMC I and at least one IWER evidence"}</span><button id="continueReview" class="primary modern-primary" type="button" ${c.complete?"":"disabled"}>Continue to review <span>→</span></button></div></section>
    </main>`;
  }
  function guideHtml(code){
    const x=TAESF.NTTC.DocumentService.modalityGuide(code);if(!x)return "";
    return `<div class="guide-head"><span class="guide-icon">?</span><div><span class="eyebrow">What this means</span><h3>${esc(x.label)}</h3><p>${esc(x.short)}</p></div></div><div class="guide-body"><p>${esc(x.explanation)}</p><div class="guide-example"><strong>What you may upload</strong><span>${esc(x.examples)}</span></div><div class="guide-credit"><strong>How TESDA treats this category</strong><span>${esc(x.credit)}</span></div></div><small class="guide-foot">This guide helps you prepare your initial online submission. Final acceptance and credit are determined during official documentary review/assessment.</small>`;
  }
  return Object.freeze({render,guideHtml});
})();
