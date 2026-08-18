# NEXUS — CODEX DEVELOPMENT HANDOFF

**Project:** TESDA Albay Network Enterprise Experience for Unified Systems
**Short Name:** NEXUS
**Organization:** TESDA Provincial Office – Albay
**Development Environment:** GitHub + Firebase Hosting + Google Apps Script + Google Sheets
**Primary Live Frontend Directory:** `public/`

---

# 1. PURPOSE OF THIS FILE

This document is the authoritative development handoff for Codex.

Codex must read this document before analyzing, proposing, or modifying NEXUS code.

This file consolidates the established architecture, development conventions, module status, integration rules, migration decisions, security requirements, and coding workflow developed during previous NEXUS development sessions.

The purpose is to prevent Codex from:

* rebuilding already completed work;
* inventing architecture that does not exist;
* assuming filenames, functions, IDs, services, repositories, or HTML structures;
* changing working legacy behavior without verification;
* bypassing established NEXUS and TAESF architecture;
* editing backup or obsolete copies of the system;
* creating parallel implementations of features already present in the codebase.

The repository itself remains the ultimate source of truth for actual current code.

**This document provides architectural and historical context. The actual repository must always be inspected before implementation.**

---

# 2. CRITICAL CODEX OPERATING RULE

## DO NOT ASSUME THE CODE.

Before recommending or implementing any change:

1. Inspect the actual repository.
2. Inspect the exact target file.
3. Locate the actual function, class, HTML block, service, repository, event handler, or CSS rule.
4. Determine how the existing implementation currently works.
5. Trace dependencies before changing the code.
6. Preserve existing working behavior unless the task explicitly requires changing it.
7. Never invent filenames, functions, IDs, APIs, database fields, or file locations.

Do not use statements such as:

* "probably"
* "likely"
* "wherever this exists"
* "you may have"
* "for example, your function might look like"
* "find something similar"

when the repository can be inspected directly.

---
# 2.1 REPOSITORY SCOPE

This GitHub repository currently contains the deployed NEXUS frontend files only.

The repository corresponds to the Firebase Hosting frontend that was previously maintained under the `public/` directory.

Therefore, in this repository:

REPOSITORY ROOT = FIREBASE PUBLIC FRONTEND

Example:

/
├── index.html
├── AIMS.html
├── apps/
├── TALDMS/
├── RRMS/
├── assets/
└── CODEX_HANDOFF.md

There may NOT be a nested `public/` folder.

Codex must inspect the repository root to determine the actual structure.

---

# 2.2 TAESF / GOOGLE APPS SCRIPT BACKEND SCOPE

The TAESF backend and Google Apps Script backend source are currently maintained separately and are NOT necessarily included in this GitHub repository.

This includes backend components such as:

- ApplicationService
- command dispatcher
- InventoryService
- InventoryMovementService
- InventoryEngine
- BaseRepository
- InventoryRepository
- SettingsRepository
- AuditRepository
- InventoryLedgerRepository
- ReservationRepository
- NEXUS identity/session backend
- ATLAS Apps Script backend
- RRRO backend services
- other Google Apps Script services

Codex MUST NOT assume these components are missing merely because they are not present in GitHub.

Codex MUST NOT recreate, replace, or invent backend implementations without first receiving and inspecting the actual Google Apps Script source.

When a task requires backend modification, Codex must identify the frontend/backend contract first and state:

"Backend source is not present in this repository. The actual Google Apps Script/TAESF backend must be inspected before backend changes are proposed."

Frontend changes may proceed only when they can be safely verified against the existing API contract.

---
# 3. AUTHORITATIVE REPOSITORY RULE

The live NEXUS frontend code is under:

```text
public/
```

Firebase Hosting deploys the contents of `public/`.

Therefore:

> `public/` is the authoritative live frontend tree.

Do not make production changes in backup trees or historical copies.

A known historical backup directory is:

```text
public_backup_2026-07-30
```

Do not implement production fixes there.

Do not duplicate changes into unrelated root-level copies of the same application unless repository inspection proves they are part of the active build/deployment process.

Before editing any file, determine whether it is actually loaded or deployed by the live application.

---

# 4. CURRENT HIGH-LEVEL PUBLIC ARCHITECTURE

Historically established frontend structure includes:

```text
public/
│
├── index.html
├── AIMS.html
│
├── apps/
│   ├── ATLAS.html
│   ├── TITAN.html
│   ├── AMS.html
│   ├── ARMMS.html
│   ├── ITSM.html
│   ├── ORACLE.html
│   └── PSP-PRTS.html
│
├── TALDMS/
│   ├── index.html
│   ├── CSS/
│   ├── JS/
│   └── Modules/
│
├── RRMS/
│   └── [RRRO/RRMS implementation files]
│
├── concepts/
│   ├── PROSPER.html
│   └── AFLOW.html
│
└── assets/
    ├── icons/
    └── [shared assets]
```

This structure must be verified against the current GitHub repository before making changes.

Do not recreate these paths merely because they appear in this handoff.

Use the repository as the final authority.

---

# 5. NEXUS ARCHITECTURAL ROLE

NEXUS is not merely a landing page.

NEXUS serves as the integrated TESDA Albay framework for:

* application access;
* identity;
* session handling;
* authorization;
* role-based access;
* application registration;
* shared governance;
* security;
* application integration;
* common conventions;
* shared user experience;
* auditability;
* future inter-system communication.

The intention is for individual TESDA Albay systems to operate as modules within a controlled NEXUS environment instead of completely independent applications.

---

# 6. SYSTEMS UNDER NEXUS

Major systems developed, integrated, planned, or being migrated include:

## 6.1 ATLAS

**Meaning:** Albay Travel And Leave Administration System

Primary areas include:

* Official Business
* Activities / Meetings
* To-Do / Reminders
* Request to Render Overtime
* Accomplishment Reports
* Fare Registry / Reimbursement
* Calendar
* Reports
* Regional balance/reference information
* other administrative travel-related workflows

### Leave Policy Decision

ATLAS is no longer intended to maintain a full independent leave application subsystem.

The established direction is:

* Leave Monitoring is for **permanent employees only**.
* Job Order personnel are excluded from leave monitoring.
* Official leave balances originate from the Regional Office annual Google Sheet.
* PO Albay records are the relevant scope.
* ATLAS should consume/reference the official source instead of independently creating another leave balance authority.

### Existing ATLAS UI

ATLAS has undergone numerous frontend patches and enhancements.

Known historical patch/version messages included versions around:

* V3.9.x
* V4.x
* later patches through approximately V8.x

Codex must not use version numbers alone to determine the actual current implementation.

Inspect the repository.

---

# 7. ATLAS DATA MIGRATION STATUS

A new ATLAS Block 1 Google Sheet/backend environment was established during migration.

Historical migration metrics recorded during development:

* Source records: approximately **1,670**
* migration preview and sync successfully identified inserted, updated, and unchanged records;
* duplicate source IDs were identified and reviewed;
* authoritative source rows were determined;
* previously flagged pending update actions were cleared.

Migration architecture includes mapping/record tracking.

A known configuration requirement from development was:

```text
ATLAS_CONFIG.sheets.migrationRecordMap = "MigrationRecordMap"
```

Do not assume this remains unchanged.

Inspect the current Apps Script backend.

---

# 8. NEXUS ↔ ATLAS AUTHENTICATION

NEXUS and ATLAS have already undergone shared-session integration.

Important historical facts:

* ATLAS receives a NEXUS launch session.
* A trusted NEXUS session is registered with the ATLAS backend.
* Shared-secret validation between NEXUS and ATLAS has been implemented.
* A previous `SIGNATURE_INVALID` problem was resolved by aligning the shared secret.
* ATLAS bootstrap authorization has previously succeeded.
* Opening ATLAS directly without the NEXUS launch context previously produced:

```text
No NEXUS launch session received
```

This was expected for the integrated flow.

A successful session historically included information such as:

* session ID;
* account ID;
* employee ID;
* username;
* full name;
* role;
* status;
* issued time;
* expiration;
* verification time.

Never expose secrets in frontend files or commit secrets to GitHub.

Secrets belong in secure backend configuration such as Apps Script Script Properties or another approved secret store.

---

# 9. NEXUS SESSION / AUTHORIZATION EXPECTATION

NEXUS authorization has previously returned results similar to:

```text
AUTHORIZED
```

with states indicating:

```text
authenticated: true
authorized: true
```

Role information is carried as part of the trusted session.

A historical administrative account used during testing had an `admin` role.

Do not hard-code individual user identities into authorization logic.

Use configured accounts, roles, permissions, or backend session information.

---

# 10. ROLE-BASED ACCESS CONTROL

NEXUS modules must follow RBAC principles.

Historical ATLAS permissions included concepts such as:

```text
portal access
entry view
entry create
entry edit
OB generate
OB approve
activity create
activity edit
todo create
todo edit
OT create
OT recommend
OT approve
trip ticket create
trip ticket generate
trip ticket approve
report view
report export
regional balance view own
regional balance view all
session view
admin audit
```

This is contextual information only.

Codex must inspect the current permission registry before modifying access control.

Do not create a second permission model without reviewing the existing implementation.

---

# 11. AIMS

**Meaning:** Albay Inventory Management System

AIMS is an operational asset/inventory application already deployed and undergoing continuing modernization.

AIMS supports TESDA property and supply processes including functions related to:

* receiving;
* issuance;
* inventory;
* RIS;
* RSMI;
* Stock Cards;
* Supplies Ledger Cards;
* RPCSP;
* ICS;
* PAR;
* PPE;
* WMR;
* inventory reporting;
* reservations;
* audit/history;
* stock monitoring.

A critical stock threshold has historically been set around:

```text
10%
```

but Codex must inspect settings rather than hard-code this value.

---

# 12. AIMS INVENTORY ENGINE

Established AIMS modernization work introduced core inventory concepts including functions such as:

```text
receiveStock()
issueStock()
adjustStock()
```

and reservation handling.

Inventory state historically included concepts such as:

```text
qtyOnHand
qtyReserved
qtyAvailable
```

The intended invariant is broadly:

```text
qtyAvailable = qtyOnHand - qtyReserved
```

but implementation must follow the actual service layer.

Do not manipulate inventory totals directly in UI code if a backend engine/service already exists.

---

# 13. AIMS RIS WORKFLOW

The established RIS workflow has been designed around states similar to:

```text
Draft
→ Submitted
→ Verified
→ Reserved
→ Approved
→ Issued
→ Completed
```

Do not bypass workflow transitions by directly changing a status field.

Workflow transitions should pass through the appropriate domain/application service and validation.

---

# 14. AIMS NUMBERING CONVENTION

Historical transaction numbering convention:

```text
PREFIX-YYYY-MM-######
```

with monthly sequence reset.

Codex must inspect the actual numbering service before creating or modifying numbering logic.

Do not generate document numbers solely in the frontend.

---

# 15. TAESF

TAESF is the backend/application architecture used as the reusable service framework behind NEXUS-related systems.

The preferred direction is:

```text
Frontend / UI
      ↓
ApplicationService / Command Dispatcher
      ↓
Domain / Business Services
      ↓
Repositories
      ↓
Google Sheets / Storage
```

The architecture is designed to prevent business rules from being scattered throughout frontend JavaScript or Apps Script endpoint handlers.

---

# 16. TAESF APPLICATION SERVICE

The backend uses or has used an application-command dispatcher concept similar to:

```text
ApplicationService
```

Commands are dispatched through a central application layer.

Historical AIMS commands included concepts such as:

```text
inventory.receive
inventory.issue
inventory.reserve
inventory.adjust

settings.get
settings.save
```

Codex must inspect the actual current dispatcher and registered commands.

Do not create a parallel dispatcher if an active one already exists.

---

# 17. TAESF REPOSITORY PATTERN

Historical modernization work introduced or planned repositories such as:

```text
BaseRepository
InventoryRepository
SettingsRepository
AuditRepository
InventoryLedgerRepository
ReservationRepository
```

and services including concepts such as:

```text
InventoryService
InventoryMovementService
InventoryEngine
```

The goal is separation of:

* storage access;
* business logic;
* orchestration;
* UI.

Google Sheet access should normally occur through repositories or another defined persistence abstraction rather than being scattered across unrelated functions.

---

# 18. GOOGLE APPS SCRIPT BACKEND

Google Apps Script is a major backend runtime for NEXUS applications.

Google Sheets serve as persistent operational data stores for several modules.

Backend development must consider:

* Apps Script execution limits;
* concurrent access;
* locking where required;
* batch reads/writes;
* minimizing repeated spreadsheet calls;
* stable headers/schema;
* audit trails;
* deterministic IDs;
* configuration;
* authorization;
* data migration;
* deployment versions.

Do not design frontend-only solutions for functionality that requires persistent authoritative data.

---

# 19. APPS SCRIPT DEPLOYMENT

Historical backend deployment procedure has been:

1. Open Apps Script project.
2. Manage deployment.
3. Update the existing Web App deployment.
4. Create/select a **New version**.
5. Deploy.
6. Preserve the production `/exec` endpoint where possible.

Deployment settings historically used a model similar to:

```text
Execute as: Me
Access: Anyone / appropriately configured deployment access
```

Actual deployment settings must be verified before changing them.

Do not create a new endpoint unnecessarily if existing applications depend on the current `/exec` URL.

---

# 20. FIREBASE HOSTING

The frontend is deployed using Firebase Hosting.

Typical established deployment flow:

```bash
firebase deploy --only hosting
```

The deployment source is the repository's configured Firebase public directory, historically:

```text
public/
```

After deployment, testing should include:

* hard refresh;
* incognito/private browsing;
* direct navigation;
* NEXUS launch navigation;
* browser console;
* network requests;
* authorization;
* backend calls.

Do not assume a local file test is equivalent to Firebase-hosted behavior.

---

# 21. AIMS ↔ NEXUS INTEGRATION HISTORY

A previous AIMS authorization issue occurred because an authorization request unexpectedly returned inventory data.

The observed problem was approximately:

* NEXUS authorization command was sent;
* dispatcher was not reached correctly;
* request fell back to legacy GET behavior;
* Inventory array was returned;
* frontend reported that NEXUS authorization was not accepted.

This highlighted an important integration rule:

> NEXUS/TAESF command dispatch must be installed and available before legacy fallback logic executes.

Historical frontend integration files included concepts similar to:

```text
nexus.portal.js
aims.nexus-prebootstrap.js
aims.nexus.js
```

Do not assume these exact names still exist.

Inspect the current repository.

---

# 22. LEGACY PRESERVATION POLICY

A major development rule for NEXUS is:

> Replace or migrate one workflow at a time.

When modernizing an existing module:

1. identify the working legacy workflow;
2. map its dependencies;
3. implement the TAESF replacement;
4. connect only that workflow;
5. test it;
6. verify parity;
7. only then retire the replaced legacy implementation.

Do not perform broad rewrites simply because the current code is old or monolithic.

Working behavior takes priority over architectural purity during migration.

---

# 23. RRRO / RRMS

The Registry of Relevant Risks and Opportunities has been developed as a NEXUS module.

The long-term design replaces multiple yearly worksheet-based registries with a permanent risk registry plus annual/quarterly history.

The design principles include:

* permanent Risk Master;
* year identified;
* quarterly monitoring;
* annual residual review;
* action plans;
* approvals;
* audit history;
* archived/closed risks;
* reporting;
* notifications;
* role separation;
* maker-checker-approver control.

Historical development has also referred to this technical module as:

```text
RRMS
```

Codex must inspect current naming before renaming anything.

---

# 24. RRRO DATA MODEL PRINCIPLE

A risk is not recreated simply because a new calendar year begins.

The intended model is approximately:

```text
Risk Master
   │
   ├── Action Plans
   ├── Quarterly Monitoring
   ├── Annual Residual Reviews
   ├── Approval History
   ├── Risk History
   └── Audit History
```

Year-specific activity is recorded as history/monitoring associated with the permanent risk record.

---

# 25. RRRO GOVERNANCE

RRRO design requires strong traceability.

Important requirements include:

* RBAC;
* maker-checker-approver controls;
* immutable or protected history;
* transaction/audit trail;
* source lineage;
* official report generation;
* conservative migration;
* no silent data merging.

Historical output requirements included official TESDA risk/QMS report formats such as TESDA-QM-F01-related outputs.

Inspect the current specification and code before implementing reports.

---

# 26. RRRO MIGRATION RULE

Historical RRRO migration planning covered multiple existing worksheets spanning approximately 2023–2026.

Migration rules established were:

* preserve source lineage;
* conservatively match records;
* identify duplicates;
* do not silently merge;
* do not auto-correct uncertain data;
* send uncertain matches for human review;
* require business validation/sign-off before accepting the migrated baseline.

Codex must never write a migration routine that destructively normalizes source data without an audit trail.

---

# 27. RRRO CURRENT/FUNCTIONAL UI AREAS

Historical RRRO functionality has included:

* Dashboard
* Monitoring Center
* Risk Registry
* Reports
* Audit Room

Risk modal/tab concepts include:

* Open Record
* Action Plans
* Quarterly Monitoring
* Annual Residual Review
* Risk History
* Approvals

Known historical UI issues included:

* overlapping buttons;
* dropdown clipping;
* modal overflow;
* missing scrollbars;
* annual history loading problems;
* monitoring history rendering problems;
* hidden Add/Edit controls;
* inconsistent margins;
* table readability;
* hidden Open Task controls.

Do not assume these issues are still present.

Verify current behavior first.

---

# 28. RRRO ISOLATION DURING DEVELOPMENT

A prior implementation decision placed RRRO/RRMS development under an isolated path such as:

```text
public/RRMS/
```

The module should be linked into the main NEXUS portal only after smoke testing.

This approach was intended to protect existing production modules while RRRO was being developed.

Inspect the current routing before changing integration.

---

# 29. TALDMS

TALDMS is the Training and Learning Development Management System.

Its planned/implemented scope has included multiple development phases.

## Phase 1

* Login
* Role management
* Employee management
* Settings
* Dashboard

## Phase 2

* Training
* Workforce
* Annual planning
* TREAP
* TDOR

## Phase 3

* Analytics
* Email integration
* Drive integration
* Audit Dashboard

Additional concepts include:

* Learning Intervention
* Knowledge Transfer
* Outcomes
* Audit Room
* Organizational Capability Index
* Config-Driven Workflow
* Dynamic Permission
* Policy Engine
* Executive Storyboard

---

# 30. TALDMS IMPLEMENTATION NOTES

TALDMS uses a more modular frontend structure compared with several older single-HTML applications.

Historically it has included directories such as:

```text
TALDMS/
├── index.html
├── CSS/
├── JS/
└── Modules/
```

Previous codebase review found some architecture/components incomplete or not fully wired.

Examples historically observed included:

* router/workflow/notification files unfinished or empty;
* authentication/authorization files existing but not fully connected to the TALDMS entry flow;
* browser localStorage used through an abstraction.

Do not rebuild these areas before checking whether newer commits have completed them.

---

# 31. TITAN

TITAN is the Toolkit Inventory and Tracking Allocation Network.

It is part of the NEXUS ecosystem.

It previously served as one of the modules used for piloting or validating NEXUS access/security patterns.

Codex must inspect the current implementation rather than extrapolate security behavior from TITAN to other applications.

---

# 32. OTHER NEXUS MODULES

Other modules historically represented in the portal include systems such as:

```text
AMS
ARMMS
ITSM
ORACLE
PSP-PRTS
PROSPER
AFLOW
```

Some may be operational, conceptual, planned, or under development.

Do not assume module status from filename existence alone.

Inspect:

* portal metadata;
* application registry;
* status configuration;
* route;
* actual page implementation.

---

# 33. NEXUS SECURITY PRINCIPLE

The NEXUS landing/login layer alone is not sufficient to secure applications.

A major security principle is:

> Authorization must also be enforced at the application/backend level.

Historical observations showed that protecting only `index.html` could still allow direct navigation to individual app pages.

Therefore:

* UI hiding is not authorization;
* route guarding alone is not authorization;
* frontend session checks alone are not authorization;
* sensitive backend commands must validate trusted sessions and permissions.

Codex must not weaken backend authorization for convenience.

---

# 34. FRONTEND SESSION BOOTSTRAP

Applications integrated into NEXUS may require a defined bootstrap order.

A typical concern is:

```text
Identity/session bootstrap
→ Authorization
→ Application initialization
```

A previous integration bug occurred because application logic initialized before the NEXUS identity layer was properly installed.

When diagnosing startup bugs, Codex must inspect:

* `<script>` ordering;
* defer/async behavior;
* module initialization;
* DOMContentLoaded listeners;
* bootstrap promises;
* session registration;
* authorization completion;
* legacy initialization.

Do not add arbitrary delays with `setTimeout()` as a substitute for correcting initialization order.

---

# 35. SCRIPT LOADING POLICY

Use deterministic script loading.

Avoid race-condition-based initialization.

Where the current architecture uses explicit script tags, maintain predictable dependency order.

Before adding a script, verify:

* where related scripts are loaded;
* whether the namespace already exists;
* whether there is a bootstrap loader;
* whether initialization occurs automatically.

---

# 36. SHARED NAMESPACE / STORAGE CONVENTIONS

TAESF/NEXUS development has previously used shared namespace, workspace, and storage abstractions.

Codex must search the repository for existing TAESF/NEXUS globals or namespaces before defining new global variables.

Avoid polluting `window` with duplicate parallel application state.

Prefer the established abstraction.

---

# 37. DATA AUTHORITY RULE

For each piece of data, determine its authoritative source.

Examples:

* inventory quantities → AIMS backend;
* NEXUS session → NEXUS identity/session backend;
* official ATLAS leave balances → Regional Office source;
* RRRO master/history → RRRO authoritative registry;
* configuration → designated settings/config repository.

Do not create a second competing source of truth.

---

# 38. AUDITABILITY REQUIREMENT

NEXUS systems support government administrative processes.

Changes affecting official transactions should preserve or improve auditability.

Where applicable, transaction records should contain information such as:

* record ID;
* transaction ID;
* actor/account;
* role;
* action;
* previous value;
* new value;
* timestamp;
* source/system;
* approval state;
* related document;
* remarks/reason.

Do not silently mutate finalized government records.

---

# 39. GOVERNMENT RECORDS PRINCIPLE

The system should distinguish between:

* operational data;
* official records;
* temporary UI state;
* audit history;
* reference/configuration data.

Browser storage must not become the authoritative source for official government transactions unless the architecture explicitly provides synchronized persistence.

---

# 40. GOOGLE SHEETS SCHEMA RULE

When Google Sheets are used as backend tables:

* inspect existing headers;
* do not casually rename headers;
* preserve compatibility;
* centralize column mappings where possible;
* perform batch reads/writes;
* validate expected schemas;
* log migration transformations;
* avoid relying on column position if a header mapping already exists.

Schema changes must be intentional and migration-aware.

---

# 41. IDENTITY AND RECORD IDENTIFIERS

Use stable record IDs.

Do not use mutable human-readable fields such as employee name, risk title, or item description as the sole identifier.

Where existing system IDs are present, preserve them.

During migrations:

* preserve original source ID;
* create migration/source mapping if necessary;
* retain lineage.

---

# 42. NO SECRET VALUES IN REPOSITORY

Never commit:

* NEXUS shared secrets;
* passwords;
* access tokens;
* private keys;
* sensitive Apps Script properties;
* privileged credentials.

When code expects configuration, use the established environment/configuration mechanism.

If Codex encounters a secret already committed, flag it before propagating it elsewhere.

---

# 43. DEVELOPMENT WORKFLOW REQUIRED FROM CODEX

For implementation tasks, Codex must use the following workflow.

## Step 1 — Objective

State the exact change being implemented.

## Step 2 — Files to Modify

List only files verified in the repository.

Example:

```text
public/apps/ATLAS.html
backend/ApplicationService.gs
```

Do not list speculative files.

## Step 3 — Exact Existing Function / Block

Identify the exact existing code being changed.

Examples:

```text
function initializeAtlas()
```

or:

```html
<section id="leaveMonitoring">
```

## Step 4 — Replacement Scope

Clearly state one of:

```text
Replace the entire function.
```

or:

```text
Replace only the specified block.
```

or:

```text
Insert the following immediately after [exact verified code].
```

## Step 5 — Complete Code

Provide complete copy/paste-ready code.

Do not use:

```text
// existing code here
```

inside a replacement block unless the task specifically requires a diff instead of replacement code.

## Step 6 — Exact Paste Location

Specify the exact verified paste point.

## Step 7 — Testing Steps

Provide concrete steps for testing.

## Step 8 — Expected Results

State what should happen when the implementation works.

---

# 44. CODEX MAY EDIT DIRECTLY

When Codex is operating with repository write access, it may implement the verified change directly rather than only giving copy/paste instructions.

However, the same discipline still applies.

Before modifying:

1. inspect;
2. map dependencies;
3. make the smallest safe change;
4. review the diff;
5. test;
6. report exactly what changed.

---

# 45. DO NOT PERFORM UNREQUESTED REFACTORING

Do not refactor unrelated code merely because it appears untidy.

Avoid:

* mass renaming;
* broad folder restructuring;
* replacing frameworks;
* formatting entire files;
* deleting legacy code unrelated to the task;
* converting architecture styles without requirement;
* introducing build systems unnecessarily.

Keep diffs focused.

---

# 46. DO NOT DELETE LEGACY CODE UNTIL VERIFIED

When replacing legacy functionality:

```text
Legacy working behavior
        ↓
TAESF replacement
        ↓
Integration
        ↓
Testing
        ↓
Parity verification
        ↓
Legacy retirement
```

Do not reverse the order.

---

# 47. TESTING EXPECTATION

Every implementation must identify appropriate tests.

Depending on the module, test:

* successful workflow;
* invalid input;
* unauthorized user;
* insufficient permission;
* duplicate action;
* refresh;
* direct URL access;
* expired session;
* backend failure;
* Apps Script response;
* Google Sheet update;
* audit entry;
* Firebase production behavior.

Do not report a change as complete merely because code compiles.

---

# 48. BROWSER DEBUGGING

For frontend bugs, inspect:

```text
Browser Console
Network tab
Application / Storage
DOM
Loaded scripts
Request payload
Response payload
HTTP status
```

Capture the actual error.

Do not infer a backend failure solely from a UI message.

---

# 49. APPS SCRIPT DEBUGGING

For backend bugs, inspect:

* Apps Script Executions;
* request payload;
* command/action;
* dispatcher;
* authentication;
* authorization;
* service;
* repository;
* Sheet state;
* returned JSON;
* HTTP status;
* logs.

Trace the request end-to-end.

---

# 50. RESPONSE CONTRACT

Where a shared API response contract exists, preserve it.

Historical NEXUS/TAESF responses have used fields similar to:

```json
{
  "success": true,
  "code": 200,
  "status": "success",
  "framework": "TAESF Backend",
  "api": "v1",
  "timestamp": "...",
  "message": "...",
  "data": {}
}
```

Inspect actual backend response builders before modifying response format.

Do not casually break clients expecting the existing contract.

---

# 51. BACKWARD COMPATIBILITY

Before modifying a shared backend function or response:

Search the repository for all consumers.

Determine:

* which applications call it;
* what payload they send;
* what fields they read;
* what error handling they expect.

Shared service changes require compatibility review.

---

# 52. PERFORMANCE PRINCIPLE

Because Google Apps Script and Google Sheets are involved:

Avoid:

```text
getRange() inside large loops
setValue() repeatedly inside loops
multiple full-sheet scans per request
unnecessary SpreadsheetApp.openById calls
```

Prefer:

* batch reads;
* in-memory maps;
* batch writes;
* indexed/mapped lookups;
* caching only where safe;
* LockService where concurrency requires it.

Correctness and audit integrity remain more important than premature optimization.

---

# 53. CONCURRENCY

Inventory, approvals, numbering, reservations, and similar workflows can be concurrency-sensitive.

Before modifying them, check whether the implementation uses:

```text
LockService
```

or another concurrency strategy.

Do not implement document numbering or stock deduction in a way that can produce collisions during simultaneous transactions.

---

# 54. ERROR HANDLING

Errors should provide useful operational information without leaking sensitive internals.

Frontend:

* give actionable user messages;
* preserve technical details in console/logs when appropriate.

Backend:

* return structured errors;
* log enough information for debugging;
* avoid exposing secrets, stack traces, or privileged data to unauthorized clients.

---

# 55. APPROVAL WORKFLOWS

Government workflow states should be enforced.

A frontend button must not be the only control preventing an unauthorized status transition.

The backend must validate:

* current state;
* intended transition;
* actor;
* role;
* permission;
* required data;
* required approval;
* business rules.

---

# 56. MAKER-CHECKER-APPROVER PRINCIPLE

For workflows requiring segregation of duties, preserve maker/checker/approver concepts.

Do not collapse approval responsibilities simply to simplify the UI.

RRRO and other administrative workflows may require this separation.

---

# 57. USER EXPERIENCE PRINCIPLE

The applications should remain practical for TESDA personnel who are performing government administrative processes.

Prefer:

* clear statuses;
* clear button labels;
* visible progress;
* useful empty states;
* readable tables;
* modal scrolling;
* actionable errors;
* confirmation for destructive actions;
* consistent layouts.

Avoid redesigning stable UI unless the task is specifically UI/UX related.

---

# 58. RESPONSIVE BEHAVIOR

When modifying UI, test at minimum:

* normal desktop;
* smaller desktop/laptop;
* narrow/mobile viewport where supported.

Do not fix one layout by introducing fixed dimensions that break another.

---

# 59. CURRENT DEPLOYMENT CONTEXT

The project repository is already connected to GitHub.

The `public` folder has already been uploaded/deployed as part of the current project.

Codex should therefore begin by inspecting the existing repository rather than asking for the entire source code to be pasted into chat.

The repository is now the working code context.

---

# 60. FIRST ACTION FOR CODEX IN A NEW SESSION

When starting work on NEXUS:

### First

Read this file:

```text
CODEX_HANDOFF.md
```

### Second

Inspect:

```text
public/
```

### Third

Inspect repository configuration relevant to deployment, including where present:

```text
firebase.json
.firebaserc
package.json
```

### Fourth

Determine which backend source files are contained in the repository and which backend components remain external in Google Apps Script.

### Fifth

Before coding, report the verified architecture relevant to the requested task.

---

# 61. CODEX INITIAL REPOSITORY AUDIT

For the first repository audit, produce:

```text
1. Repository structure
2. Active production frontend files
3. NEXUS bootstrap/authentication files
4. Shared TAESF files
5. AIMS files
6. ATLAS files
7. RRRO/RRMS files
8. TALDMS files
9. Firebase configuration
10. Backend/Apps Script files present in GitHub
11. Duplicate or backup trees
12. Dead/unreferenced files
13. Security concerns
14. Current deployment architecture
15. Recommended next implementation target
```

Do not modify code during this audit unless explicitly instructed.

---

# 62. VERIFY SCRIPT DEPENDENCIES

For each primary application, determine exactly which scripts it loads.

Create a map such as:

```text
index.html
  ├── script A
  ├── script B
  └── script C

AIMS.html
  ├── nexus bootstrap
  ├── AIMS integration
  └── legacy/application scripts
```

Use actual repository findings.

This is particularly important because initialization order has previously caused NEXUS authorization failures.

---

# 63. VERIFY NEXUS APPLICATION REGISTRY

Locate how NEXUS knows about applications.

Determine whether application metadata is:

* hard-coded in `index.html`;
* stored in JS;
* fetched from backend;
* configuration-driven.

Map:

```text
Application ID
Display Name
Route
Status
Icon
Required Permission
Launch Method
```

Do not redesign the registry until it has been documented.

---

# 64. VERIFY AUTHENTICATION PATH

Trace the complete current authentication sequence.

Expected conceptual flow:

```text
User
 ↓
NEXUS Login
 ↓
NEXUS Session
 ↓
Portal Authorization
 ↓
Application Launch
 ↓
Application Session Validation
 ↓
Application Permission Validation
 ↓
Application Bootstrap
```

Document actual implementation and differences.

---

# 65. VERIFY DIRECT-ACCESS SECURITY

Test whether application pages can be accessed directly.

Examples:

```text
/apps/ATLAS.html
/AIMS.html
/TALDMS/
/RRMS/
```

Determine:

* whether page loads;
* whether sensitive data loads;
* whether backend commands reject unauthorized requests;
* whether user is redirected;
* whether NEXUS session is required.

A public HTML shell is not automatically a vulnerability if all protected operations remain server-authorized, but sensitive data must not be exposed.

---

# 66. VERIFY FIREBASE CONFIGURATION

Inspect:

```text
firebase.json
```

Determine:

* public directory;
* rewrites;
* redirects;
* headers;
* cache configuration;
* SPA rules if any.

Do not assume Firebase deploys only `public/` until configuration confirms it.

Historical project behavior indicates `public/`, but current config is authoritative.

---

# 67. VERIFY GOOGLE APPS SCRIPT RELATIONSHIP

Determine which applications communicate with Apps Script.

For each endpoint, map:

```text
Application
Endpoint
HTTP Method
Command/Action
Authentication Method
Expected Response
Backend Project
```

Do not expose secret values in documentation.

---

# 68. VERIFY LOCAL STORAGE / SESSION STORAGE

Search for:

```text
localStorage
sessionStorage
indexedDB
```

Determine what each stored value represents.

Classify values as:

* safe UI preference;
* cache;
* session metadata;
* sensitive;
* authoritative application data.

Flag inappropriate browser-side persistence of sensitive or authoritative records.

---

# 69. VERIFY HARDCODED URLs

Search the repository for:

```text
script.google.com
firebaseapp.com
web.app
http://
https://
```

Document important hardcoded endpoints.

Do not automatically replace them.

Determine whether central configuration already exists.

---

# 70. VERIFY DUPLICATE IMPLEMENTATIONS

Search for multiple implementations of:

```text
authentication
authorization
API request wrappers
session handling
audit logging
inventory movement
document numbering
employee lookup
permissions
modal utilities
notifications
```

Where duplication exists, document it first.

Do not immediately consolidate it.

---

# 71. CURRENT PRIORITY PHILOSOPHY

The project emphasizes:

> Working system first, controlled modernization second.

Therefore:

* stabilize operational workflows;
* integrate safely;
* test immediately;
* modernize incrementally;
* preserve government records;
* avoid unnecessary rewrites.

---

# 72. WHEN A BUG IS REPORTED

Codex should not immediately patch the first suspicious line.

Use this sequence:

```text
Reproduce
→ Capture error
→ Trace call
→ Identify root cause
→ Inspect dependencies
→ Implement smallest fix
→ Test
→ Regression check
```

If the repository state prevents reproducing the issue, state what evidence is available rather than guessing.

---

# 73. WHEN A NEW FEATURE IS REQUESTED

Before implementing:

1. determine target module;
2. identify current architecture;
3. identify authoritative data source;
4. determine required roles/permissions;
5. identify workflow/state implications;
6. identify audit requirements;
7. identify backend persistence;
8. identify UI integration;
9. determine compatibility impact;
10. then implement.

---

# 74. WHEN MODIFYING AIMS

Before changing AIMS inventory behavior:

Inspect:

```text
InventoryEngine
InventoryService
InventoryMovementService
InventoryRepository
ReservationRepository
InventoryLedgerRepository
ApplicationService
```

or their current equivalents.

Never perform stock mutation directly from UI-only logic if the service layer exists.

---

# 75. WHEN MODIFYING ATLAS

Before changing ATLAS:

Inspect:

* current single-page HTML structure;
* latest patch blocks;
* NEXUS bootstrap;
* session logic;
* backend command calls;
* migration mappings;
* permanent employee filtering;
* RO balance integration;
* role-based UI.

Avoid restoring deprecated independent leave-application logic.

---

# 76. WHEN MODIFYING RRRO

Before changing RRRO:

Inspect:

* Risk Master schema;
* Action Plan schema;
* Monitoring schema;
* Annual Review schema;
* approval workflow;
* history/audit implementation;
* migration metadata;
* report generation;
* current RRMS directory architecture.

Preserve permanent-registry principles.

---

# 77. WHEN MODIFYING TALDMS

Before implementing TALDMS features:

Determine what has already been completed.

Specifically inspect whether the following are active:

```text
router
workflow engine
notification layer
authentication
authorization
storage abstraction
configuration
module loader
```

Do not rebuild unfinished-looking files until repository references confirm their intended role.

---

# 78. CODING STYLE

Follow the existing project's coding conventions whenever they are clear.

Priorities:

1. consistency with active code;
2. readability;
3. deterministic behavior;
4. maintainability;
5. auditability;
6. minimal global state.

Do not impose an unrelated style guide across the repository.

---

# 79. COMMENTS

Comments should explain:

* business rules;
* unusual architectural decisions;
* compatibility requirements;
* security rationale;
* migration reasoning.

Avoid comments that merely restate obvious code.

---

# 80. SOURCE CONTROL DISCIPLINE

Before implementing a substantial change:

* identify affected files;
* keep the diff focused;
* do not modify generated or backup files;
* avoid formatting unrelated code.

After implementation:

* inspect `git diff`;
* verify no secrets were added;
* verify no unrelated files changed;
* summarize changed files.

---

# 81. COMMIT STRATEGY

Prefer focused commits.

Examples:

```text
fix(atlas): enforce NEXUS bootstrap before module initialization
```

```text
feat(rrro): add quarterly monitoring history loader
```

```text
fix(aims): route inventory authorization through TAESF dispatcher
```

```text
refactor(taesf): centralize repository error handling
```

Do not bundle unrelated module changes into one commit without reason.

---

# 82. PRODUCTION SAFETY

Before recommending deployment:

Verify:

* no console-breaking errors;
* no secret leakage;
* authentication works;
* authorization works;
* backend endpoint works;
* data writes correctly;
* audit/history works where applicable;
* existing workflows still function.

Do not recommend production deployment solely because a static page renders correctly.

---

# 83. DEPLOYMENT REPORT FORMAT

After a deploy-related implementation, report:

```text
Changed Files:
- ...

Backend Deployment Required:
- Yes / No

Firebase Deployment Required:
- Yes / No

Google Sheet Migration Required:
- Yes / No

Configuration Change Required:
- Yes / No

Testing:
- ...

Expected Production Result:
- ...
```

---

# 84. NEVER FABRICATE SUCCESS

Codex must distinguish among:

```text
Code changed
Code compiles
Local test passed
Backend test passed
Production deployment completed
Production verification completed
```

These are not equivalent.

Do not state that production is fixed unless production was actually verified.

---

# 85. PROJECT DECISION HIERARCHY

When conflicts arise, use this priority:

```text
Current explicit user instruction
↓
Actual current repository
↓
Current official business rule
↓
This CODEX_HANDOFF.md
↓
Historical/legacy behavior
```

This document is contextual authority, but it never overrides verified current code or a newer explicit decision.

---

# 86. WHAT CODEX SHOULD NOT ASK THE USER TO RE-EXPLAIN

Do not ask the user to explain from scratch:

* what NEXUS is;
* what AIMS is;
* what ATLAS is;
* what RRRO/RRMS is;
* what TALDMS is;
* what TAESF is;
* why Google Apps Script is used;
* why Google Sheets are used;
* whether the public folder is the frontend deployment;
* the required implementation workflow.

The answers are already documented here.

Ask only when a genuinely new business decision is required and cannot be determined from the repository, this document, or the current task.

---

# 87. FIRST CODEX RESPONSE EXPECTATION

After reading this document and inspecting the repository, Codex should respond approximately in this structure:

```text
NEXUS repository inspected.

Authoritative frontend:
[verified path]

Firebase public directory:
[verified path]

NEXUS portal:
[verified file]

Detected modules:
[verified modules]

NEXUS authentication/bootstrap:
[verified files]

TAESF/shared backend architecture:
[verified files or external backend status]

AIMS:
[current verified structure]

ATLAS:
[current verified structure]

RRRO/RRMS:
[current verified structure]

TALDMS:
[current verified structure]

Important findings:
[...]

No files modified yet.
```

Do not make architectural assumptions before this inspection.

---

# 88. INITIAL TASK AFTER HANDOFF

The recommended first Codex task is:

> Perform a complete read-only repository architecture audit of the current NEXUS GitHub repository. Read `CODEX_HANDOFF.md` first. Inspect the actual `public/` tree and deployment configuration. Map NEXUS, TAESF, AIMS, ATLAS, RRRO/RRMS, TALDMS, authentication, session bootstrap, Firebase configuration, and any Apps Script/backend source included in the repository. Identify duplicate/backup files and current security/integration risks. Do not modify code yet.

The purpose is to synchronize Codex's understanding with the **actual current GitHub repository** before further development.

---

# 89. DEVELOPMENT PRINCIPLE

The central rule for this project is:

> **Inspect first. Understand the existing workflow. Change only what is necessary. Test immediately. Preserve working behavior until the replacement is verified.**

NEXUS is an evolving production administrative ecosystem, not a greenfield demo application.

Treat its operational data, government workflows, authentication, approvals, and audit trail accordingly.

---

# END OF HANDOFF

**Codex: Read this file at the beginning of every new NEXUS development context where project history is unavailable. The current repository remains the source of truth for implementation details.**
