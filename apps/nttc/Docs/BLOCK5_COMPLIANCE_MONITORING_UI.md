# NTTC Block 5 — Applicant Compliance, CAC Monitoring and UI Refinement

## Scope
- Fixes applicant Review-step card alignment by separating applicant `.review-grid` from focal `.focal-finding-grid` styles.
- Replaces the focal-only pending queue with an all-application monitoring dashboard.
- Adds metrics, search and status-stage filtering.
- Makes approved-for-hard-copy applications remain visible and inspectable to the CAC focal.
- Adds an explicit approved-state banner and read-only review record.
- Adds applicant documentary compliance upload per deficiency.
- Preserves superseded document versions instead of deleting prior uploads.
- Returns applicant compliance to the focal as `COMPLIANCE_SUBMITTED` and then `UNDER_RE_REVIEW`.
- Requires the focal to review the compliance document as COMPLIANT before resolving the deficiency.

## Test
Open `Tests/nttc.block5.test.html` and confirm all PASS lines.

## Manual approval test
1. Submit an applicant application.
2. Open `focal.html`.
3. Open the application; mark every current document COMPLIANT.
4. Click `Approve for Hard-Copy Submission`.
5. The same application detail should remain open with a green approved banner.
6. Return to Application Monitoring. The record must remain visible under `Approved / hard-copy stage` and the metric must increase.
7. Open the applicant portal using the same applicant session. The monitoring page must show `APPROVED FOR HARD-COPY SUBMISSION` and explicitly state that this is not NTTC issuance.

## Manual deficiency/compliance test
1. Put one document in DEFICIENT status and create a deficiency.
2. Return the application with deficiencies.
3. Applicant opens the portal and uploads a corrected/additional file against the finding.
4. Applicant clicks `Submit Compliance for Re-Review`.
5. Focal monitoring shows the application in Needs Review.
6. Open it. The compliance file is marked `Compliance • v2`.
7. Mark the new file COMPLIANT.
8. Click Resolve on the related deficiency.
9. When every current document is COMPLIANT and all deficiencies are closed, approve for hard-copy submission.
