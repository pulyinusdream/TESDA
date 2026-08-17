# NTTC Block 3.1 — Guided Document Upload UX

## Objective
Remove the generic "Document Type" first-step and guide applicants through document uploads in the actual order they understand them: National Certificate, TMC I, then IWER evidence.

## Modified files
- `public/apps/nttc/JS/config/nttc.constants.js` — complete replacement
- `public/apps/nttc/Modules/documents/services/document.service.js` — complete replacement
- `public/apps/nttc/Modules/documents/views/document.upload.view.js` — complete replacement
- `public/apps/nttc/Modules/documents/controllers/document.controller.js` — complete replacement
- `public/apps/nttc/CSS/app.css` — complete replacement by packaged version (contains prior styles plus Block 3.1 styles)

## New test
- `public/apps/nttc/Tests/nttc.block3_1.test.html`

## Approved UX rules implemented
1. Applicant does not choose a generic upload destination/document type first.
2. NC and TMC I have their own required upload cards and never ask for IWER modality.
3. IWER upload is shown as a separate section after credentials.
4. Selecting an IWER category immediately displays an applicant-friendly explanation based on TESDA Circular Nos. 33, 50 and 51, s. 2017.
5. The system explains that the category helps organize the initial submission and does not replace CAC/PTAG review.
6. Teaching Experience is labeled as a credit-equivalency route and explicitly states that teaching experience is not used alone.
7. Optional supporting documents are visually separated from required uploads.
