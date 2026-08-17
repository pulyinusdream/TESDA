# NTTC Block 4 — CAC Focal Initial Review and Deficiency Management

## Objective
Create the isolated CAC focal workspace for the online pre-screening stage. The focal can open submitted applications, inspect NC/TMC/IWER uploads separately, record a finding per document, create applicant-facing deficiencies, return an application for compliance, or approve a fully compliant application for hard-copy submission.

## Entry pages
- Applicant: `public/apps/nttc/index.html`
- CAC focal prototype: `public/apps/nttc/focal.html`

## Block boundary
This remains an isolated browser-storage prototype. It does not yet implement NEXUS staff authentication, email sending, Google Drive upload, or Google Sheets API persistence. Those must be integrated through the verified NEXUS backend rather than by direct public-browser writes.
