# NTTC Block 2 — Applicant Registration and Prerequisite Gate

## Objective
Add the public applicant profile, qualification selection, NC/TMC I prerequisite validation, and browser draft-saving layer on top of the approved Block 1 workflow/computation foundation.

## Replace existing Block 1 files
- `NTTC/index.html`
- `NTTC/CSS/app.css`
- `NTTC/JS/config/nttc.constants.js`
- `NTTC/JS/core/application/app.js`
- `NTTC/Modules/application/models/nttc.application.model.js`
- `NTTC/Modules/application/repository/nttc.application.repository.js`
- `NTTC/Modules/application/services/nttc.application.service.js`

## Add new files
- `NTTC/Modules/applicant/models/applicant.model.js`
- `NTTC/Modules/applicant/validation/applicant.validator.js`
- `NTTC/Modules/applicant/repository/applicant.repository.js`
- `NTTC/Modules/applicant/services/applicant.service.js`
- `NTTC/Modules/applicant/views/applicant.registration.view.js`
- `NTTC/Modules/applicant/controllers/applicant.controller.js`
- `NTTC/Modules/qualification/repository/qualification.repository.js`
- `NTTC/Modules/qualification/services/qualification.service.js`
- `NTTC/Modules/application/validation/nttc.prerequisite.validator.js`
- `NTTC/Modules/application/views/nttc.application.wizard.view.js`
- `NTTC/Modules/application/controllers/nttc.application.controller.js`
- `NTTC/Tests/nttc.block2.test.html`

## Important implementation boundary
Block 2 intentionally keeps applicant drafts behind the existing storage abstraction. It does not yet connect the public page directly to the shared Google Sheets backend or email service. This avoids inventing or bypassing NEXUS backend authentication/dispatcher behavior. Shared persistence and upload integration are a controlled subsequent block.

## Test
Open `/NTTC/Tests/nttc.block2.test.html` and confirm all PASS results.
Then open `/NTTC/index.html`, register a test applicant, select a qualification, enter valid NC II+ and TMC I details with future validity dates, and use `Save & Check Prerequisites`.
Expected status: `READY FOR ONLINE SUBMISSION` and a success message stating the prerequisite check passed.
