# NEXUS Scholarship Allowance Module (SAM)

## Version
0.3.0-block3

## Block 3 scope
This package includes Blocks 1–3:

1. Qualification Cost Master and Scholarship Batch Setup
2. BSRS Attendance PDF Import
3. Attendance Validation Center

## Block 2 corrective patch included
- Attendance summary counters now only calculate against the selected scholarship batch.
- Imported report cards no longer appear while no batch is selected.
- `View Attendance` is an explicit `type="button"` action.
- Clicking `View Attendance` renders the selected report immediately, highlights the active report card, unhides the extracted attendance panel, and scrolls to it.
- Imported attendance details now also show the final validated attendance once Block 3 validation exists.

## Block 3 validation behavior
The original BSRS source fields are never overwritten. Manual resolution is stored separately in `attendanceValidations`.

Supported resolution:
- Present — complete the missing BSRS log using supporting attendance evidence
- Absent

Supporting sources:
- Manual Daily Attendance Sheet
- Approved BSRS Attendance Exemption
- Biometric Machine Record

Every validation stores:
- source BSRS report / scholar reference
- manual Time In / Time Out where needed
- final Time In / Time Out
- final attendance status
- validation reason / remarks
- supporting document reference
- validated by
- validation timestamp

## Test flow
1. Open `/apps/SAM/index.html`.
2. In BSRS Attendance Import, select the Driving NC II batch.
3. Upload `Sample Attendance.pdf`.
4. Expected import summary for that sample: Reports 1; Attendance Records 25; Complete BSRS 15; For Validation 10.
5. Click `View Attendance`; the extracted attendance table must open and scroll into view.
6. Open Attendance Validation and select the same batch.
7. Resolve a Missing Time In / Missing Time Out record using Manual Daily Attendance Sheet.
8. Save validation and confirm Pending decreases while Manual Validated increases.
9. Return to the extracted attendance report and confirm Final Attendance reflects the validated value while original BSRS Time In / Time Out remain unchanged.


## Block 4
- Visual BSRS import health cards and attendance coverage timeline.
- Critical report warnings for missing date/report no., batch period mismatch, TVI/qualification mismatch, duplicate scholar rows, and count mismatch.
- Allowance computation consolidates present/absent/pending/review/missing days.
- Payroll Preview only includes fully resolved scholars when no critical report issue remains.
- TSF remains qualification-master driven; partial/time anomalies are held for review rather than auto-prorated.


## Block 5 - Final Report Generation
- A4 Summary of Attendance (landscape), three copies.
- A4 Billing Statement (portrait), three copies.
- A4 Payroll (landscape), three copies.
- Generation is locked until the attendance/allowance engine reports the batch as payroll-ready.
- ULI is maintained separately because it is not present in the BSRS attendance PDF; future Scholar Registry/T2MIS integration can replace manual entry.
- Browser print/save-to-PDF is used so the module remains standalone under Public/apps/SAM without adding another PDF library dependency.


## Block 6 - Guided Workflow + Provincial Office Separation
- Replaced crowded one-page workflow with five gated school steps.
- A later step cannot be opened until the immediately preceding step is complete.
- Central notifications now identify success/warning/error actions, including Save Report Details.
- Added saved-time indicators beside School Report and Provincial Office detail actions.
- Time anomalies are now routed through Attendance Validation instead of appearing only during allowance computation.
- Removed Payroll generation from the TVET provider School Reports step.
- Added a separate Provincial Office workspace for payroll generation.
- Rebuilt the Provincial Office payroll to follow the uploaded TWSP Appendix 33 structure: Serial No., split scholar name, Amount subcolumns, ID Presented, Signature of Recipient, certification blocks A/B/C/D, ORS/BURS, JEV and Date.


## Block 7 — SAM Final Handoff
- Final TVET Provider step now creates a SPECTRA billing transaction.
- Finalization freezes attendance reports, validation entries, allowance computation, and school report details in an immutable-version snapshot.
- Transaction status starts as `AWAITING_HARD_COPY` with physical holder `TVET_PROVIDER`.
- The school receives a unique transaction number in the form `SPT-YYYY-######`.
- SAM exposes Submitted Billing Tracking and opens the matching SPECTRA transaction.
- The school-facing navigation no longer exposes the Provincial Office payroll workspace; payroll processing belongs to SPECTRA/Accounting.


## Online Supporting Documents
- Step 5 now supports uploading signed/scanned Billing Statement, Summary of Attendance, BSRS/manual attendance, terminal/MIS reports and other supporting documents.
- Signed Billing Statement and Summary of Attendance are required before `Finalize & Submit for Billing`.
- Files are stored in shared IndexedDB for prototype testing and are viewable by Scholarship and Accounting reviewers in SPECTRA.
- The finalized SPECTRA transaction records document metadata and retags the stored files to the Billing Transaction Number.


## Block 9 — School Billing Monitoring
- Added `My Billing Tracking` to the TVET Provider account.
- NTTC-style journey shows current processing stage, Transaction No., Receiving Control No., current holder, amount, latest events and any deficiency requiring school action.
- Step 5 is explicitly labeled `Reports, Online Documents & Submission` and contains school report generation, signed online document upload, and billing finalization.


## Block 10 — Queue Position + Training Induction Program
- School billing tracking now displays the number of active hard-copy billings received by the Provincial Office and the transaction's current queue position based on receipt order.
- Added TIP request form in the TVET Provider account.
- TVI can request preferred TIP date/time and receives Scholarship scheduling/confirmation notifications.
- School confirms a rescheduled TIP within SAM.
- Notifications from Scholarship, including billing follow-up notices, appear in the school account.


## Block 11 — School Home + Sidebar
- SAM now opens to a TVET Provider Home dashboard with submitted billing KPIs, recent billings and Provincial Office notifications.
- Left sidebar organizes Home, Allowance Module, My Billing Tracking and Qualification Cost Master.
- Detailed billing tracking remains NTTC-style while the home page gives a simpler operational overview.


## Block 17 — SAM Notification Bell
- Added a provider-facing notification bell in the SAM application header.
- Notifications are filtered to the current local TVET Provider's known batch IDs rather than showing all TVI notices in browser storage.
- The bell combines Provincial Office/TIP notices with derived billing reminders such as hard-copy submission pending, compliance action required, and paid/closed milestones.
- Clicking a billing notification opens My Billing Tracking; TIP notices route back to the Allowance/TIP workspace.


## Block 18 — NEXUS TVET Provider Portal
- SAM remains the internal code namespace for compatibility, but the user-facing product is now the TVET Provider Scholarship & Billing Portal.
- The five-step Attendance/Allowance workflow is visible only inside `Allowance & Attendance`; it no longer occupies Home, Billing Center, Tracking, MIS, or Qualification Cost Reference.
- Added Billing Center for TSF Initial 50%, TSF Remaining/Final, combined TSF, Training Fee/Training Cost, Assessment Fee, and applicable Entrepreneurship Fee.
- An RQM may have multiple billing transactions, but the same billing component cannot have two simultaneous active transactions.
- Added Provider MIS 03-02 upload/comparison against the Provincial official registry and retained the upload for Scholarship review.
- Home now shows approved RQMs with scholar status counts, supports qualification filtering, and displays Provincial Office queue position/ahead count on each received billing.
- Provider notifications now derive from each Provincial Office transaction event so process updates become visible in the portal.
- Qualification Cost Master is read-only to schools; updates are maintained by Scholarship Focal in SPECTRA.
