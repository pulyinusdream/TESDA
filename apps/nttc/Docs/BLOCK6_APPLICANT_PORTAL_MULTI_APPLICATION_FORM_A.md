# NTTC Block 6 — Applicant Portal, Multi-Application Records, Process Mapping and Form A Generation

## Deployment root
`public/apps/nttc/`

## Objectives
1. Provide a separate applicant monitoring dashboard showing the whole NTTC journey and present stage.
2. Preserve all applications under one applicant account and allow applications for multiple NTTC qualifications.
3. Keep a complete application history instead of treating the portal as a one-time form.
4. Generate the CoCIE Application Form (Form A) only after CAC approval for hard-copy submission.
5. Capture inclusive dates and estimated equivalent hours for IWER evidence so the generated Form A evidence inventory can be populated.

## New files
- `Modules/portal/views/applicant.portal.view.js`
- `Modules/portal/controllers/applicant.portal.controller.js`
- `Modules/forms/services/cocie.form.service.js`
- `Modules/forms/views/cocie.form.view.js`
- `Modules/forms/controllers/cocie.form.controller.js`
- `form-a.html`
- `Tests/nttc.block6.test.html`
- `References/ApplicationFormCoCIE-JUNE20.docx`

## Applicant process map
Online Application → CAC Initial Review → Hard-Copy Submission → Provincial Processing → Regional Office → Certificate Ready → Released.

Deficiency/re-review states are shown inside the CAC Initial Review stage. The map does not imply that Provincial Office acceptance or Regional Office transmission constitutes NTTC approval or issuance.

## Form A rule
The generated CoCIE Application Form becomes available from `APPROVED_FOR_HARDCOPY_SUBMISSION` onward. Before that point the portal explains that the form is locked pending CAC documentary review.

The applicant may complete Form A-only profile details (place of birth, sex, civil status, educational attainment, height, weight, telephone, institution address) on the generator page. These details are stored on the applicant profile and reused in later applications.

Use **Print / Save as PDF** to obtain a printable copy. Formal notarization and hard-copy submission remain required.

## Important prototype boundary
This block still uses the isolated browser persistence used by prior blocks. Production multi-application records, Form A generation, control numbers, file metadata and status history must later be connected to the secured NEXUS backend/Google Sheets/Drive implementation.
