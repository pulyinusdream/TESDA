# NEXUS–SPECTRA — Block 1

**SPECTRA** = Scholarship Processing, Expenditure, Compliance, Tracking, Reporting and Administration.

Block 1 implements the transaction backbone approved for the larger NEXUS scholarship-financial workflow.

## Implemented
- Reads finalized billing transactions created by NEXUS-SAM through a shared browser registry.
- Unique school transaction numbers: `SPT-YYYY-######`.
- Hard-copy Receiving workflow.
- Receiving control numbers: `RCV-YYYY-######`.
- Records complete/incomplete submission while still stamping/recording receipt.
- Automatically routes complete submissions to Scholarship Review.
- Incomplete submissions move to `FOR_COMPLIANCE`.
- Transaction event history and physical-holder tracking.
- Search by transaction, control number, RQM, TVET Provider and qualification.
- A4 Scholarship Billing Routing & Tracking Sheet.
- QR is generated locally and contains only a short transaction token; no scholar/bank/financial data is embedded in the QR.
- Shared local-storage contract is a prototype; production NEXUS will move this to the backend/session-authorized repository.

## Next SPECTRA Blocks
1. Scholarship Review + due diligence/checklist/deficiency workflow.
2. Accounting Review against immutable SAM snapshot and system-computed attendance/allowance.
3. Budget/Obligation (BURS/ORS/OBR).
4. Accounting DV/JEV.
5. Cashiering and payment modes (individual checks, cash advance, LANDBANK PISO).
6. RQM 360 view and SPMOR reporting/export.
7. TITAN integration for toolkit status.


## Block 2 — Scholarship Review
- Scholarship Review queue for cases routed from Receiving.
- Immutable SAM snapshot system-review panel.
- Documentary/technical checklist for RQM, billing statement, attendance summary, attendance support, scholar roster/ULI, benefit computation, signatures, duplicate-payment review and available ceiling.
- Deterministic 20% scholar due-diligence sampling for repeatable review.
- Verification methods: call, private message, or face-to-face.
- Deficiency workflow with school action required (`FOR_COMPLIANCE`) and compliance-resubmission history.
- Scholarship Review cannot be forwarded until system exceptions, checklist items and sampled scholar verifications are cleared.
- Verified cases transition to `ACCOUNTING_REVIEW` with physical holder `ACCOUNTING_REVIEW`.
- Review snapshot is stored separately for audit and the A4 Scholarship Billing Review Sheet can be printed.


## Block 3 — Provincial Monitoring + Accounting Review
- Added Provincial Office TVI Billing Monitoring grouped by TVET Provider.
- Shows transaction counts, total claim value, Awaiting Hard Copy, Scholarship Review, For Compliance, Accounting Review, Budget, Cashier, Paid/Closed and oldest active-case aging.
- SAM now allows the TVET Provider to upload signed/scanned online supporting files before finalization.
- Files are stored in shared IndexedDB (prototype) rather than localStorage, so PDFs/images are not embedded into the transaction JSON.
- Signed Billing Statement and Summary of Attendance are required online before SAM finalization.
- Scholarship and Accounting reviewers can open the school-submitted online files.
- Added Accounting Review queue after Scholarship verification.
- Accounting compares the immutable SAM snapshot, claim amount, prior payment/duplicate risk and current RQM/batch ceiling.
- Appendix 33 Payroll is generated only in Accounting/Provincial Office, not by the TVET Provider.
- Accounting cannot forward until checklist/system checks are passed and payroll has been generated/reviewed.
- Verified Accounting cases transition to `FOR_BUDGET_OBLIGATION` with physical holder `BUDGET`.


## Block 4 — Reviewer Attendance Drill-Down + Budget/Obligation
- Scholarship and Accounting reviewers can see the same finalized SAM allowance/payroll preview.
- Reviewers can select an individual scholar and inspect every daily BSRS Time In/Out, validated final Time In/Out, attendance status and validation source.
- Scholarship and Accounting can save separate findings/remarks against a specific scholar/date without modifying the school-submitted attendance.
- Added Budget / Obligation queue after Accounting Review.
- Budget records BURS/ORS/OBR number, date, fund source, obligation amount and certification remarks.
- Certified cases transition to `ACCOUNTING_DV_JEV` and return to Accounting for the next processing block.


## Block 5 — TIP Scheduling, Billing Follow-up, and Accounting DV/JEV
- Scholarship Focal receives TIP requests from TVET Providers.
- TIP scheduler detects same-slot conflicts using configurable duration/concurrency; the focal may reschedule or document an override.
- TVI receives a schedule confirmation notification and email-outbox item.
- Scholarship marks actual TIP conduct; this becomes the start of internal billing-submission aging monitoring.
- Generates system follow-up letter text, TVI account notification and an email-outbox item.
- The Omnibus Guidelines explicitly require TIP before training and allow up to 15% training-cost billing once TIP is conducted; the system does not invent a fixed statutory TSF/allowance billing deadline where the guideline source does not provide one. Internal reminder target days remain configurable.
- Added Accounting DV/JEV queue after Budget/Obligation.
- DV/JEV records gross amount, deductions and net amount, then routes completed transactions to Cashier.


## Block 6 — Cashier Foundation + Modular UI
- SPECTRA now uses a TESDA-blue left sidebar and separates Receiving, Scholarship, Accounting, Budget, Cashier and Cashier Reports into cleaner workspaces.
- Cashier queue accepts cases after DV/JEV.
- Payment-mode foundation: Individual Check per Scholar, Cash Advance and LANDBANK PISO (data model; bank batch processing is a later block).
- Check printing is calibrated from the uploaded `Check Template.xlsm`: print area A1:I4, A4 portrait, with payee, amount, date/check no. and amount-in-words positions; printer X/Y calibration remains configurable for actual check stock.
- Check stock/accountable-form register supports sequential check assignment, cancellation and release.
- Appendix 67 RAAF generator follows the uploaded RAAF structure and adds a supplemental cancelled-check detail because the source Appendix 67 table itself does not expose a separate cancelled column.
- Report of Cash Disbursements generator follows the uploaded monthly layout (Date, DV/Payroll, Check, ORS/BURS, payee, nature, amount, refunded and net amount).
- Appendix 29 Cash Receipts Record and Appendix 26 Report of Collections and Deposits are generated from one collection register.
- Appendix 28 Order of Payment generator uses the fields recovered from the uploaded legacy XLS: payor/address, purpose, Bill No./date, amount in words/figures, fund cluster, bank/account, and authorized official.
- Cash Advance Refund records reduce outstanding cash advance and will later feed deposit/collection reconciliation.


## Block 7 — Cashier Reconciliation & Scalable Submenus
- Cashier transaction workspace now uses internal process tabs: Setup, Individual Checks, Cash Advance, LANDBANK PISO, and Payment Closure.
- Cashier Reports now uses report-level tabs instead of one long scrolling page; this pattern is intended to scale to additional COA/cashier reports.
- Individual check monitoring now supports Prepared, Released, Unclaimed, Cancelled and Replacement Check states.
- Unclaimed scholar checks remain visible until released/replaced and do not silently disappear from payment monitoring.
- Cash Advance now tracks scholar-level payouts, unpaid scholars, refunds/bank returns and automatic reconciliation: Cash Advance = Scholar Payouts + Refunds + Remaining Balance.
- Cash Advance may only close when fully liquidated/reconciled.
- LANDBANK PISO foundation now supports scholar account entry, payment-batch creation, CSV export, per-scholar Success/Failed reconciliation, reference numbers and payment exceptions.
- Transaction can only be marked Paid after the selected payment mode meets its reconciliation rules.


## Block 8 — Cashier Control & COA Submission
- Cashier sub-tab selection is preserved after actions such as Release, Unclaimed, Cancel, Replace, Cash Advance payout, and LANDBANK reconciliation.
- Unclaimed checks stay on hand and keep the billing payment open; COA monthly reports can still be generated and submitted with released/unclaimed/cancelled status reflected in the accountable-form records.
- Added 150-day warning and 180-day operational stale-check monitoring. The 180-day value is treated as an operational bank/check warning, not an automatic accounting write-off rule.
- Accountable Form Control Number and serial ranges are mandatory before checks or Official Receipt numbers may be used.
- Added separate accountable-form types for CHECKS and OFFICIAL_RECEIPT, by fund/account (SSP, 101, PESFA).
- Added Order of Payment workflow for NC Renewal, Certification, Assessment Center Accreditation, Assessor Accreditation, Program Registration, CAV and Other. Amounts are not hard-coded until the approved fee schedule is supplied.
- Daily client collection must be saved with a valid controlled Official Receipt number before proceeding to the next client.
- Collections are tagged by the TESDA Albay 1:00 PM operational deposit cutoff and can be grouped into deposit batches by fund with bank/deposit reference.
- Monthly COA report lifecycle is now tracked: Saved Preview → Printed/Signed → Scanned Copy → Submitted to COA → Filed.
- Scanned signed report is mandatory before marking a report submitted to COA.
- COA receiving/reference number and file location are retained.
- Monthly submission due date is monitored as the 5th day of the following month based on the process requirement supplied for this system.
- Saved previews preserve source totals plus any controlled manual adjustment, requiring an override reason and authorized-by name when adjustment is non-zero.


## Block 9 — RCI + Cash Advance Liquidation JEV
- Added Report of Checks Issued (RCI) register and report generator based on the uploaded TESDA Albay `2021 RCI - PESFA` workbook.
- Core RCI fields mirror the working sheet: Check Date/Serial No., DV/Payroll No., Date Released, ORS/BURS No., Responsibility Center, Payee, UACS Object Code, Nature of Payment, Amount, Tax and Total; optional RQM/scholarship classification fields are preserved for SPMOR/RQM monitoring.
- Scholarship individual checks are synchronized automatically to RCI. Manual RCI entries support procurement/supplier, payroll, cash advance and other check payments not yet originating from another SPECTRA module.
- RCI check numbers must belong to a registered Check accountable-form control.
- Added monthly RCI preview/print by fund while retaining individual released/unreleased/cancelled check status.
- Added Cash Advance Liquidation JEV workflow. The original DV/JEV records the grant/payment of the cash advance; after liquidation, Accounting prepares a separate JEV to recognize the actual expense and clear `Advances to Special Disbursing Officer`.
- Liquidation JEV is only available after a Cash Advance is fully reconciled/liquidated.


## Block 10 — Cashier Workspace V2 + Head of Admin Oversight
- Cashier now has a functional workspace instead of nested operational tabs.
- Cashier Workspace areas: Home, Client Payment Queue, Payments & Disbursements, Payment Records, Accountable Forms, Reports Center, COA Submission, Report Archive.
- Order of Payment automatically creates a cashier queue item with a daily queue number (`C-001`, `C-002`, ...).
- Queue states: WAITING → NOW_SERVING → PAYMENT_IN_PROGRESS → PAID, with DID_NOT_PROCEED support.
- Completing a queued client payment records the Official Receipt through the existing accountable-form controlled collection logic.
- Payments & Disbursements opens the existing scholarship payment processor; only the selected payment mode remains relevant inside that transaction.
- Payment Records are grouped by Individual Checks, Cash Advances and LANDBANK PISO batches.
- Reports Center groups reports by Accountable Forms, Disbursement and Collections instead of presenting one long list.
- COA Submission and Report Archive are separated conceptually from report generation.
- Added Head of Administrative Unit workspace with cross-process counts for Receiving, Scholarship, Accounting, Budget and Cashier.
- Added generic override/adjustment request model. Report adjustments now create a pending Admin approval request rather than being treated as silently authorized.
- Head of Admin can approve/reject requested overrides with approver, timestamp and decision remarks.
- This approval architecture is intentionally generic so Accounting, Receiving, Budget and Scholarship can later adopt the same request/approval pattern.


## Block 11 — Cashier Enterprise UX V3
- Replaced the nested-tab Cashier interface with a two-column enterprise workspace: persistent Cashier submenu + one focused work screen.
- Cashier submenu is grouped by Daily Operations, Disbursements, and Control & Reporting.
- Opening a function displays only that function; legacy report tabs are hidden and individual report panels are mounted into the focused screen.
- Daily Operations: Overview, Client Queue, Order of Payment, Collections and Deposits.
- Disbursements: Payment Queue and Payment Records.
- Control & Reporting: Accountable Forms, Reports Center, COA Submission and Report Archive.
- Reports Center uses three clear groups (Accountable Forms, Disbursement, Collections) and opens one report at a time with a Back to Reports Center action.
- Report Archive is a separate searchable view by year, fund, status and text, with saved preview and scanned-copy access.
- Increased Cashier typography, form controls, buttons and table text for readability and older users; primary interaction controls are approximately 42–54 px high.
- Added contextual operational alerts for client queue, unclaimed/stale checks, outstanding cash advances, LANDBANK exceptions, undeposited collections and pending COA reports.
- Preserved all Block 10 transaction, report, control, override and Head of Admin data models underneath the redesigned workspace.


## Block 11 Patch 1 — Cashier Workspace Visibility Fix
- Fixed Cashier Enterprise Workspace leaking into Home, Accounting, Receiving, Scholarship, Budget and other SPECTRA top-level workspaces.
- Global SPECTRA navigation now controls only direct top-level workspace panels under `<main>`.
- Cashier internal legacy processing/report panels no longer carry top-level `data-module-panel` attributes.
- Added a defensive workspace visibility guard and `[hidden]` CSS enforcement so only the selected SPECTRA workspace can render.


## Block 12 — Cash Advance Compliance Clock + DV/JEV/COA Package Tracking
- Fixed the legacy `Cashier Registers, Collections & COA Reports` container so it remains hidden outside the focused Cashier Enterprise workspace. Legacy Cashier queue/detail/report containers now act only as mount sources for the enterprise screens.
- Added Cash Advance Compliance monitoring based on COA Circular No. 97-002.
- Cash Advance milestones: Purpose Served / Distribution Completed → Liquidation Submitted to Accounting → Accounting Received → JEV/Books Recording → COA Package Submitted.
- Added configurable compliance types. The 5-day allowance-related monitor is labeled as a monitoring target because COA Circular 97-002 §5.1.1 formally states five days after each 15-day/end-of-month pay period; the correct basis date must be recorded for the specific cash advance.
- Accounting receipt automatically starts the 10-day verification/recording deadline under §5.3.
- Cash Advance becomes `ACCOUNTING_LIQUIDATED_RECORDED` when the liquidation JEV/book recording is completed; COA submission remains a separate later status.
- Added Cashier CA Compliance screen with due/overdue aging.
- Added Accounting Cash Advance Liquidation Compliance panel and Head of Admin aging visibility.
- Added DV/JEV/COA Submission Package Tracker with DV, JEV, RCI/period, documentary checklist, physical holder, Accounting/COA transmission dates, scanned package metadata, COA reference, deficiency and audit-status fields.
- Submission package cannot be marked submitted to COA until its required checklist is complete and a scanned complete package is attached.


## Block 13 — SPECTRA Workspace Architecture V2: Cashier Reference Workspace
- Cashier is now a standalone role workspace at `workspaces/cashier/index.html`.
- The Provincial SPECTRA shell routes to Cashier instead of rendering Cashier inside the all-role `index.html`.
- Removed the Cashier Enterprise shell, legacy Cashier queue, payment panel and Cashier report container from the Provincial shell. This eliminates DOM-moving/mounting and cross-role visibility leakage.
- Shared repositories and business services remain under `SPECTRA/JS/`; only Cashier UI/controller files are role-specific. There is still one transaction/data backbone.
- New Cashier role menu groups Daily Transactions, Disbursements, and Control & Reporting. The outer all-role SPECTRA menu is no longer shown while a Cashier is working.
- Opening a Cashier function displays one focused screen only. Reports open one at a time and return to Reports Center.
- Payment Queue now shows only the selected payment mode. Individual Check, Cash Advance and LANDBANK PISO forms are no longer presented together.
- Fixed the Starting Check No./Check Date refresh bug by capturing values before any re-render.
- Payment method cannot be changed after payment records exist, protecting the audit trail from cross-mode contamination.
- Cash Advance creation starts the COA compliance monitoring record automatically.
- Improved typography, spacing, button sizing, tables, empty states and navigation for older users and counter-based daily work.
- This Cashier role workspace is the reference implementation for later `workspaces/accounting`, `workspaces/receiving`, `workspaces/scholarship`, `workspaces/budget`, and `workspaces/admin`.


## Block 13 Patch 1 — Cashier Workspace Density Improvement
- Reduced outer workspace margins and vertical card spacing while preserving readable text sizes.
- Reduced Cashier sidebar width from 275px to 255px to return more usable space to transaction work.
- Removed the Cashier workspace max-width cap so the payment queue and transaction detail can use the full available screen.
- Tightened card padding, KPI spacing, form-grid spacing, report-group spacing and table padding.
- Kept form controls and action buttons large enough for comfortable use while reducing unnecessary empty space.
- Improved common 1366px–1920px desktop utilization without changing Cashier business logic.


## Block 14 — All Role Workspaces + Admin Enterprise UI
- Extended the standalone role-workspace architecture to Receiving, Scholarship, Accounting, Budget, and Head of Admin.
- Provincial `SPECTRA/index.html` now routes process owners to dedicated workspaces instead of rendering all operational panels together.
- Shared repositories/services remain centralized; role separation is UI/controller level only.
- Receiving: Overview, Incoming Registry, Transaction Detail/Chain of Custody, Records.
- Scholarship: Overview, TIP Requests/Scheduling/Monitoring, Billing Review Queue/Detail, RQM Monitoring, Records.
- Accounting: Overview, Billing Review Queue/Detail, DV/JEV Queue/Processing, Cash Advance Liquidation Compliance, COA Submission Packages, Records.
- Budget: Overview, Obligation Queue/Detail, Fund Monitoring, Obligation Records.
- Head of Admin: Executive Overview, process drill-down, pending override/report-adjustment approvals, compliance aging, decision history, management reporting.
- Head of Admin has cross-process visibility while normal process records remain read-only; controlled changes continue through override/approval requests.
- Added a shared enterprise role stylesheet and generic role router so all workspaces use the same readable, low-dead-space, one-screen-at-a-time interaction model.


## Block 14 Patch 2 — Enterprise Visual Refinement / Full Content Utilization
- Based on the uploaded Block 14 combined package; no working screens, ids, buttons, repositories, services, or transaction functions were removed.
- Corrected the actual role-page spacing conflict: global `app.css` applies `body{padding-left:218px}` for the Provincial shell. Dedicated role workspaces now explicitly reset this offset while retaining their fixed sidebar.
- Cashier sidebar remains fixed at 255px. The main content starts immediately after it and occupies `calc(100% - 255px)` with only a 10–12px working margin.
- Applied the same offset correction to Receiving, Scholarship, Accounting, Budget, and Head of Admin.
- Refined typography toward a clean modern system UI stack with clearer hierarchy and readable 14–15px operational text.
- Added a consistent lightweight inline SVG icon system for role menus and refresh controls; no external CDN or image dependency is required.
- Refined cards toward flatter modern CRM/dashboard surfaces: subtle borders, minimal shadow, compact radius, cleaner spacing, and more usable content width.
- Tables, forms, embedded report panels, and compact payment forms now expand to the available role workspace width instead of retaining unnecessary internal width restrictions.
- Function-preservation audit compares role workspace ids/buttons before and after the visual patch.


## Block 15 — Review Controls, RQM Registry, Component Receiving & Scholar Lookup
- Fixed Scholarship Review Queue and Accounting Review Queue navigation in standalone role workspaces; clicking an active transaction now opens the corresponding Review Detail screen.
- Initialized the shared Attendance Audit controller in Scholarship and Accounting, restoring `View Daily Time In / Out` and attendance-review Save actions.
- Fixed online-document visibility by falling back from transaction-tagged IndexedDB records to source-batch records and immutable snapshot document metadata. SAM finalization now retags uploaded batch documents to the created SPECTRA transaction.
- Added mandatory Cashier Check Pre-Print Review. Check printing is blocked until transaction/RQM, DV/JEV net payable, accountable-form serial control, payee/amount list, and supporting documents are reviewed and approved by a named Cashier reviewer.
- Receiving now records one or more billing components per hard-copy receipt: TSF Initial 50%, TSF Remaining/Final 50%, Training Fee, Assessment Fee, and Entrepreneurship Fee. Both TSF components may be checked when submitted as one document set.
- Scholarship/Accounting allowance preview now displays TSF Initial 50% and TSF Remaining/Final separately.
- Added Provincial RQM Registry sourced from Scholarship SPMOR upload. RQM numbers are unique in the registry; repeated SPMOR rows are deduplicated/update the existing registry row rather than create a second RQM.
- SAM batch setup now selects an approved RQM assigned to the TVET Provider instead of manually encoding RQM/TVI. A second SAM batch cannot be created for the same RQM.
- Added shared Scholar Search for Receiving, Scholarship, Accounting, Budget, Cashier, and Head of Admin. Search by name or ULI shows all finalized RQM training histories, TSF initial/remaining amounts/statuses, and STEP toolkit applicability/status.
- This scholar repository is derived from finalized SAM snapshots so process owners can answer scholar allowance/toolkit follow-ups without searching separate billing folders.


## Block 16 — Exact FY 2026 Albay SPMOR Mapper + MIS Scholar Migration
- Replaced Block 15 header-guessing with an exact workbook mapper for the verified FY 2026 file structure.
- `Albay` mapping begins at row 17 and uses the actual columns: RQM series O; unique RQM code P; approval Q; status T; provider AN; school ID AO; approved learners BA; qualification BK; training dates BQ/BR/BV/BW; basis BZ; Training Cost CA; TSF CB; Entrepreneurship CC; Assessment Fee CE; approved totals CG:CN.
- Physical accomplishment source columns CP:EM are mapped into structured RQM physical snapshots for enrollment, ongoing, dropout, completion, assessment, certification, employment, and unutilized slots/amount.
- `MIS 03-02` mapping begins at row 6. It imports RQM A, provider F, qualification L, scholar identity Q:AI, training AJ:AO, assessment AP:AQ/BE:BF, employment AR:AX, T2MIS ULI BA, and trainer BB:BD.
- Scholar identity precedence: ULI → T2MIS ULI → provisional normalized name + birth date.
- Published migration persists separate Scholar Master and Scholar-RQM Enrollment records, allowing one scholar to have multiple RQM/training histories without duplicate identities.
- RQM physical accomplishment is recomputed from the individual MIS enrollment registry and compared against the source Albay aggregate values; enrollment/completion/assessment/certification variance is shown in RQM detail.
- Exact import is staged first: the user reviews RQM/scholar/enrollment counts and orphan RQM references before confirming publication.
- Each import creates a migration audit record with file name, exact mapper version, counts and exceptions.
- Shared Scholar Search now uses the migrated MIS registry when available and displays actual training/assessment lifecycle plus linked SPECTRA billing/benefit statuses.


## Block 17 — Modern SPECTRA Landing + Shared Notification Center
- Rebuilt the Provincial SPECTRA landing page as a compact enterprise operations overview instead of a static hero + single monitoring table.
- Home now combines active billing metrics, exceptions, RQM/scholar registry counts, process workload cards, unread attention items, recent transaction activity, financial/aging snapshot, and the existing TVET Provider Billing Monitoring table.
- Added a shared notification bell/center to the Provincial landing and every role workspace (Receiving, Scholarship, Accounting, Budget, Cashier, Head of Admin).
- Notifications are role-aware and are derived from actual transaction state, TIP messages, Cash Advance compliance clocks, Cashier unclaimed-check custody, and Admin approval requests.
- Derived notification read-state is stored separately from transaction state; opening/reading a notification does not mutate workflow status. Existing explicit TIP notifications retain their own read flag.
- Notification actions open the relevant role screen/queue when possible. Provincial Overview notification actions route to the appropriate role workspace.
- Landing page keeps detailed certifications and transaction changes inside each process-owner workspace; Home is monitoring and navigation, not a second transaction editor.


## Block 18 — Provider Portal Multi-Billing + Cashier Fixes
- Notification center panels are viewport-fixed above dashboard/cards across SPECTRA and the Provider Portal.
- Cashier Order of Payment / Collection / Deposit/report actions now use document-level delegated events in the standalone role workspace. Order of Payment validates required fields, creates the cashier queue item, records its queue number, and catches pop-up/print errors.
- Cashier dashboard Open Client Queue uses the current `client-payments` role screen.
- Shared Scholar Search adds School, Qualification and Status filters plus counts for scholars, RQM enrollments, ongoing, completed, assessed and certified.
- Scholarship Focal now owns the editable Qualification Cost Master. Provider Portal sees it as read-only reference.
- Scholarship receives a Provider MIS 03-02 Review workspace. Provider uploads are compared against the current Provincial MIS/SPMOR registry.
