"use strict";
TAESF.NTTC.ApplicantRegistrationView = (()=>({
  render(){ return `
  <main class="nexus-public-shell">
    <section class="nexus-hero">
      <img class="nexus-watermark" src="../../assets/Logo.png" alt="" aria-hidden="true">
      <div class="nexus-brandline"><img src="../../assets/Logo.png" alt="TESDA Logo"><div><span>TESDA Albay Provincial Office</span><strong>NEXUS Public Services</strong></div></div>
      <div class="hero-copy">
        <span class="hero-kicker">NTTC ONLINE PRE-SCREENING</span>
        <h1>Start your NTTC application online.</h1>
        <p>Prepare your information and documents before visiting the Provincial Office. The system will guide you through the initial documentary review and application monitoring.</p>
        <div class="hero-points"><span>✓ Guided application</span><span>✓ Status monitoring</span><span>✓ Email notifications</span></div>
      </div>
    </section>

    <section class="nexus-form-card">
      <div class="form-card-head">
        <div><span class="eyebrow">Applicant account</span><h2>Create your profile</h2><p>Use your current TESDA Learner ID and active contact details.</p></div>
        <span class="secure-chip">Secure pre-screening</span>
      </div>
      <form id="applicantRegistrationForm" class="modern-form">
        <div class="field span-2"><label>TESDA Learner ID <b>*</b></label><input name="learnerId" required autocomplete="off" placeholder="AJD-05-096-05005-001" maxlength="22"><small>Enter the Learner ID exactly as reflected in your TESDA record.</small></div>
        <div class="field"><label>Last Name <b>*</b></label><input name="lastName" required autocomplete="family-name"></div>
        <div class="field"><label>First Name <b>*</b></label><input name="firstName" required autocomplete="given-name"></div>
        <div class="field"><label>Middle Name</label><input name="middleName"></div>
        <div class="field"><label>Name Extension</label><input name="extensionName" placeholder="Jr., Sr., III"></div>
        <div class="field"><label>Date of Birth <b>*</b></label><input name="dateOfBirth" type="date" required></div>
        <div class="field"><label>Mobile Number <b>*</b></label><input name="mobile" required placeholder="09XXXXXXXXX" autocomplete="tel"></div>
        <div class="field span-2"><label>Email Address <b>*</b></label><input name="email" type="email" required autocomplete="email" placeholder="name@example.com"><small>Application notices and deficiency notifications will be sent here.</small></div>
        <div class="field span-2"><label>Complete Address <b>*</b></label><textarea name="address" required rows="3"></textarea></div>
        <div class="span-2 consent-note">By continuing, you confirm that the information entered is yours and will be used for NTTC application pre-screening and monitoring.</div>
        <div class="span-2 form-actions"><button class="primary modern-primary" type="submit">Continue to application <span>→</span></button></div>
      </form>
      <div id="registrationMessage" class="message" hidden></div>
      <div class="policy-note"><strong>Important:</strong> ${TAESF.NTTC.Constants.DISCLAIMER}</div>
    </section>
  </main>`; }
}))();
