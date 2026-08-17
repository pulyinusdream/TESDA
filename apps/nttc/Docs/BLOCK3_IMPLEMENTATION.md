# NEXUS NTTC Block 3 — Documentary Requirements & Upload Center

## Objective
Implement the applicant documentary upload, review, and first formal online pre-screening submission flow under `public/apps/nttc/`.

## Approved changes carried forward
- `public/apps/nttc/` is the authoritative deployed path.
- TVI / Institution is mandatory.
- Employment Status is a controlled dropdown.
- NC certificate number remains exactly 14 numeric digits with an internal issue-year consistency check.
- Applicant-facing validation never explains the internal NC coding rule.
- Applicant no longer enters a `Valid Until` date for NC or TMC I.
- Expected validity is calculated from Date Issued using a five-year rule and is only an initial screening aid; the CAC focal still verifies the actual certificate.
- Full qualification master will be loaded later.

## Block 3 flow
Profile → Prerequisites → Documents → Review → Submitted for Initial Review.

## Required initial uploads
1. National Certificate copy
2. Trainers Methodology Certificate I copy
3. At least one IWER supporting evidence

Optional upload categories are Government-issued ID and Other Supporting Document. IWER uploads are tagged by modality.

## Test storage boundary
For this isolated frontend block, document blobs are stored in browser IndexedDB and metadata is stored behind the NTTC repository abstraction. This is for functional testing only. Production persistence to Google Drive/Google Sheets will be wired through the NEXUS backend in a later controlled backend block; the public browser must not write directly to the office spreadsheet.

## First formal online submission
When all prerequisites and required uploads pass, the applicant reviews the application and attests to the information. Submission assigns an online control number in the pattern `NTTC-R05-ALB-YYYY-######` and moves the application to `SUBMITTED_FOR_INITIAL_REVIEW`.

The browser-side sequence generator is test-only. Production numbering must be server-side and locked to prevent duplicate control numbers across concurrent applicants.
