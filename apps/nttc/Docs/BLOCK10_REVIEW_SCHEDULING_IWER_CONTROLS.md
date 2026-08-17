# NTTC Block 10 — Review UX, Schedule Negotiation, IWER Computation & Closure Controls

## Approved scope

1. CAC document cards show a visible saved state after review and visually flag unsaved changes.
2. Deficiency entry and confirmation dialogs use the NEXUS modal component; browser prompt/alert popups were removed from the review/hard-copy flows.
3. Applicants may confirm the CAC schedule or request another date/time and must state a reason. The CAC focal may accept the applicant's preferred schedule or offer a different schedule.
4. The scanned NTTC certificate remains required for final application closure. Closing checks the internal certificate file repository before status can move from RELEASED to CLOSED.
5. IWER hours are system-estimated from inclusive dates using the prescribed Form A note: 1 day = 8 hours and 22 days per month. The selected modality factor is then applied. Equivalent years use the approved 2,312-hour annual divisor.
6. CAC must confirm the system-proposed IWER hours or encode verified actual raw hours with a reason. Approval for hard-copy submission is blocked until every IWER evidence has a confirmed hours decision.
7. Applicant-selected IWER modalities are validated against the controlled system list. Teaching/Credit Equivalency requires at least three years teaching experience plus another qualifying modality. International Industry Immersion and International Training are included under Circular No. 51 treatment.
8. Generated Form A uses the CAC-confirmed equivalent hours when available.

## Authoritative deployed path

`public/apps/nttc/`

## Main files changed

- `JS/core/ui/modal.service.js` (new)
- `JS/config/nttc.constants.js`
- `Modules/computation/services/nttc.computation.service.js`
- `Modules/documents/models/document.model.js`
- `Modules/documents/services/document.service.js`
- `Modules/documents/views/document.upload.view.js`
- `Modules/documents/controllers/document.controller.js`
- `Modules/review/services/focal.review.service.js`
- `Modules/review/views/focal.application.review.view.js`
- `Modules/review/controllers/focal.review.controller.js`
- `Modules/hardcopy/services/hardcopy.service.js`
- `Modules/hardcopy/views/applicant.appointment.view.js`
- `Modules/hardcopy/views/focal.hardcopy.view.js`
- `Modules/hardcopy/controllers/hardcopy.controller.js`
- `Modules/certificate/services/certificate.service.js`
- `Modules/certificate/views/focal.certificate.view.js`
- `Modules/certificate/controllers/certificate.controller.js`
- `Modules/forms/services/cocie.form.service.js`
- `CSS/app.css`
- `index.html`, `focal.html`, `form-a.html`

## Important computation rule

The system distinguishes a *proposed Form A hour estimate* from the CAC-approved hour value. This is intentional because the source forms contain different conversion conventions. The applicant does not approve the hours; the CAC focal confirms the proposal or records verified actual hours with a reason.
