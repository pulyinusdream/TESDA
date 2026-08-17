# NEXUS NTTC Block 9 — Certificate Recording, Release & QR Scanner

## Objective
Complete the applicant monitoring lifecycle after Regional Office processing by recording the actual NTTC certificate, retaining a restricted internal scan, marking the certificate ready for release, and recording final release. Add a camera/manual claim-stub QR lookup that opens the matching application directly in the CAC focal workspace.

## QR scanner behavior
The QR code on the claim stub contains only the NTTC application control number. In supported browsers, the CAC focal clicks **Scan Claim Stub QR**, allows camera access, and points the camera at the claim stub. The system decodes the QR, searches `ApplicationRepository` by exact control number, closes the scanner, and opens that application. A manual control-number lookup is provided when the browser does not support the BarcodeDetector API or camera access is unavailable.

## Certificate controls
- Certificate scan is internal-only and stored separately from applicant documents.
- Applicant portal receives only the status `CERTIFICATE_READY_FOR_RELEASE`; it does not expose the certificate scan.
- Release requires claimant, ID reference, and releasing personnel.
- Claim stub presentation is recorded as a yes/no control but valid ID remains supported.

## Status flow
`REGIONAL_OFFICE_PROCESSING` / `TRANSMITTED_TO_REGIONAL_OFFICE` -> `NTTC_RECEIVED_FROM_RO` -> `CERTIFICATE_RECORDED` -> `CERTIFICATE_READY_FOR_RELEASE` -> `RELEASED` -> `CLOSED`.
