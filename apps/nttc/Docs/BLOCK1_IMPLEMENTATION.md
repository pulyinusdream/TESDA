# NEXUS NTTC — Block 1 Implementation

## Objective
Establish an isolated NTTC module foundation under the verified deployed `public/` tree without changing the NEXUS portfolio page. Block 1 implements status/state rules, applicant-visible status mapping, prerequisite and IWER computation rules, application model/repository contracts, and the Google Sheets registry schema.

## Live files changed
None. `public/index.html` is intentionally NOT modified in Block 1.

## New deployed folder
`public/NTTC/`

## Direct smoke-test URLs after copying to the deployed public folder
- `/NTTC/index.html`
- `/NTTC/Tests/nttc.block1.test.html`

## Google Sheets foundation
`Backend/NTTC_Block1_Setup.gs` is a standalone, prefix-safe bootstrap. Run `NTTC_setupDataStore()` only in the intended NTTC spreadsheet or after setting Script Property `NTTC_SPREADSHEET_ID`.

## Expected test results
Eight PASS lines; zero FAIL lines.
