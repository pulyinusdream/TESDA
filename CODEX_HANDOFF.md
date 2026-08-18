# NEXUS — CODEX DEVELOPMENT HANDOFF

**Project:** TESDA Albay Integrated Digital Systems Program — NEXUS
**Organization:** TESDA Provincial Office – Albay
**Frontend:** HTML / CSS / JavaScript
**Frontend Hosting:** Firebase Hosting
**Backend:** Google Apps Script + TAESF Architecture
**Operational Data Storage:** Google Sheets and related Google Workspace services
**Repository Scope:** Deployed frontend only
**Last Handoff Update:** August 2026

---

# 1. PURPOSE

This document is the authoritative development handoff for Codex.

Codex must read this document before analyzing, recommending, editing, creating, deleting, renaming, or refactoring NEXUS project files.

This document consolidates the important architectural decisions, business rules, migration history, security requirements, integration rules, development practices, and module status established during prior development work.

Its purpose is to prevent Codex from:

* rebuilding functionality that already exists;
* inventing missing backend components;
* assuming filenames or functions;
* introducing a second architecture beside TAESF;
* modifying backup or obsolete files;
* removing working legacy behavior prematurely;
* bypassing NEXUS authentication and authorization;
* creating conflicting sources of truth;
* treating this project as a new/greenfield application.

The **actual current repository remains the source of truth for frontend implementation details**.

For backend changes, the **actual Google Apps Script / TAESF source must be inspected separately** before implementation.

---

# 2. MANDATORY CODEX OPERATING RULE

## INSPECT FIRST. NEVER ASSUME THE CODE.

Before recommending or implementing any change:

1. Inspect the actual repository.
2. Locate the actual target file.
3. Locate the exact existing function, class, HTML block, event handler, CSS rule, API wrapper, or configuration involved.
4. Trace how it is currently used.
5. Search for dependencies and callers.
6. Determine whether the functionality already exists elsewhere.
7. Identify the authoritative data source.
8. Make the smallest safe change.
9. Test the change.
10. Preserve working behavior until its replacement has been verified.

Codex must not use speculative instructions such as:

* "probably"
* "likely"
* "wherever this exists"
* "you may have"
* "find something similar"
* "your function might look like"

when the repository can be inspected.

Never invent:

* filenames;
* functions;
* DOM IDs;
* classes;
* API commands;
* Apps Script services;
* Google Sheet names;
* permissions;
* roles;
* backend methods;
* database fields;
* endpoints.

---

# 3. REPOSITORY SCOPE

This GitHub repository currently contains the **deployed NEXUS frontend files only**.

The repository corresponds to the files that were previously maintained inside the Firebase Hosting:

```text
public/
```

directory.

For the current GitHub repository:

```text
REPOSITORY ROOT = FIREBASE PUBLIC FRONTEND
```

The repository may therefore look similar to:

```text
/
├── index.html
├── AIMS.html
├── apps/
├── TALDMS/
├── RRMS/
├── assets/
├── concepts/
└── CODEX_HANDOFF.md
```

There may **NOT** be a nested:

```text
public/
```

directory.

Codex must inspect the repository root to determine the actual current structure.

Do not recreate a `public/` directory unless the user explicitly changes the repository structure.

---

# 4. FIREBASE CONFIGURATION SCOPE

Because only the former Firebase `public/` contents were uploaded to GitHub, files such as:

```text
firebase.json
.firebaserc
```

may exist only in the user's local deployment workspace and may not be included in this repository.

Their absence from GitHub must **NOT** be interpreted as evidence that Firebase Hosting is not being used.

The live deployment architecture historically uses Firebase Hosting for the frontend.

If deployment configuration must be changed, request or inspect the actual configuration before making recommendations.

---

# 5. TAESF / GOOGLE APPS SCRIPT BACKEND SCOPE

The **TAESF backend and Google Apps Script backend source are maintained separately** and are currently not necessarily part of this GitHub repository.

This includes backend components such as:

* ApplicationService;
* command dispatcher;
* BaseRepository;
* InventoryRepository;
* SettingsRepository;
* AuditRepository;
* InventoryLedgerRepository;
* ReservationRepository;
* InventoryService;
* InventoryMovementService;
* InventoryEngine;
* NEXUS identity/session services;
* ATLAS Apps Script backend;
* AIMS Apps Script backend;
* RRRO/RRMS backend services;
* TALDMS backend services;
* other Google Apps Script modules and repositories.

Codex MUST NOT assume these components are missing simply because they do not appear in GitHub.

Codex MUST NOT recreate, replace, or invent these components without inspecting the actual backend source first.

When a task requires backend modification and the backend is unavailable, Codex must state:

> Backend source is not present in this repository. The actual Google Apps Script / TAESF backend must be inspected before backend changes are proposed.

Frontend changes may proceed only when they can safely be implemented using a verified existing frontend/backend contract.

---

# 6. HIGH-LEVEL SYSTEM ARCHITECTURE

The intended system architecture is:

```text
Users
  │
  ▼
NEXUS Portal / Identity / Application Launcher
  │
  ├── AIMS
  ├── ATLAS
  ├── RRRO / RRMS
  ├── TALDMS
  ├── TITAN
  ├── AMS
  ├── ARMMS
  ├── ITSM
  ├── ORACLE
  ├── PSP-PRTS
  └── Other current/future modules
  │
  ▼
Frontend API / Command Calls
  │
  ▼
Google Apps Script / TAESF
  │
  ▼
ApplicationService / Dispatcher
  │
  ▼
Business / Domain Services
  │
  ▼
Repositories
  │
  ▼
Google Sheets / Google Workspace / Persistent Storage
```

NEXUS is not simply a landing page.

It is intended to provide shared:

* identity;
* session management;
* authorization;
* role-based access;
* application launch;
* governance;
* integration;
* auditability;
* common conventions.

---

# 7. TAESF ARCHITECTURAL PRINCIPLE

TAESF is the reusable backend/service architecture used for NEXUS-related systems.

Preferred flow:

```text
Frontend / UI
      ↓
API / Command
      ↓
ApplicationService
      ↓
Domain / Business Service
      ↓
Repository
      ↓
Google Sheets / Storage
```

Business logic should not be unnecessarily duplicated across frontend JavaScript and Apps Script endpoint handlers.

The frontend should normally request an operation.

The backend service layer should:

* validate;
* authorize;
* apply business rules;
* update persistent state;
* generate audit information;
* return a structured response.

---

# 8. APPLICATION SERVICE / COMMAND DISPATCH

NEXUS/TAESF backend development uses a command-dispatch pattern.

Historical commands include concepts such as:

```text
inventory.receive
inventory.issue
inventory.reserve
inventory.adjust

settings.get
settings.save
```

Codex must inspect the actual dispatcher before adding a command.

Do not create a parallel command dispatcher simply because the backend source is unavailable in GitHub.

Do not bypass the service layer with direct Google Sheet manipulation from unrelated handlers.

---

# 9. BACKEND RESPONSE CONTRACT

Historical NEXUS / TAESF responses have followed a structured contract similar to:

```json
{
  "success": true,
  "code": 200,
  "status": "success",
  "framework": "TAESF Backend",
  "version": "...",
  "api": "v1",
  "build": "...",
  "timestamp": "...",
  "message": "...",
  "data": {}
}
```

The actual current response builder must be inspected before modifying this format.

Do not casually change shared API response structures because multiple applications may rely on them.

---

# 10. NEXUS AUTHENTICATION AND SESSION PRINCIPLE

NEXUS provides integrated identity/session handling.

Conceptual flow:

```text
User Login
    ↓
NEXUS Identity
    ↓
NEXUS Session
    ↓
Portal Authorization
    ↓
Application Launch
    ↓
Application Session Validation
    ↓
Permission Validation
    ↓
Application Bootstrap
```

An application page existing publicly on Firebase does not mean protected application operations are public.

Protected backend operations must enforce authorization independently of UI visibility.

---

# 11. SECURITY RULE — FRONTEND IS NOT AUTHORIZATION

The following are NOT sufficient security controls by themselves:

* hiding a menu;
* hiding a button;
* redirecting from a page;
* checking a JavaScript variable;
* checking localStorage;
* checking only `index.html`.

Sensitive backend operations must verify trusted session and permission information.

Never weaken backend authorization merely to make frontend integration easier.

---

# 12. NEXUS SESSION INTEGRATION HISTORY

NEXUS integration has previously established trusted application sessions.

Session information has historically included concepts such as:

* sessionId;
* accountId;
* employeeId;
* username;
* fullName;
* role;
* status;
* issuedAt;
* expiresAt;
* lastVerifiedAt.

Historical authorization results included:

```text
AUTHORIZED
authenticated = true
authorized = true
```

Do not hard-code individual users as an authorization mechanism.

Use the configured NEXUS session, role, and permission architecture.

---

# 13. SECRET MANAGEMENT

Never commit:

* NEXUS shared secrets;
* Apps Script Script Properties;
* passwords;
* private API keys;
* access tokens;
* Firebase administrative credentials;
* private keys;
* privileged service credentials.

Shared secrets have historically been stored in Google Apps Script Script Properties.

If Codex encounters credentials in repository files:

1. flag them;
2. do not duplicate them;
3. do not expose them in responses;
4. recommend appropriate secret handling.

---

# 14. SCRIPT INITIALIZATION / BOOTSTRAP

A previous NEXUS integration issue occurred because application initialization happened before the required identity/session integration was installed.

The conceptual order should be:

```text
NEXUS identity/session bootstrap
        ↓
Application authorization
        ↓
Application initialization
```

When investigating bootstrap issues, inspect:

* script ordering;
* `defer`;
* `async`;
* DOMContentLoaded handlers;
* initialization functions;
* bootstrap promises;
* API readiness;
* session registration;
* authorization completion;
* legacy startup code.

Do not fix initialization races by inserting arbitrary `setTimeout()` delays.

Fix dependency ordering.

---

# 15. AIMS — ALBAY INVENTORY MANAGEMENT SYSTEM

AIMS supports TESDA property, supply, inventory, and asset-management processes.

Historical/current scope includes concepts such as:

* Receiving;
* Inventory;
* Issuance;
* RIS;
* RSMI;
* Stock Cards;
* Supplies Ledger;
* RPCSP;
* ICS;
* PAR;
* PPE;
* WMR;
* inventory monitoring;
* inventory reports;
* reservations;
* audit history.

AIMS Version 2 was deployed during the modernization effort.

Codex must inspect the repository to determine the actual current implementation.

---

# 16. AIMS INVENTORY ENGINE

Established AIMS modernization introduced inventory operations including concepts such as:

```text
receiveStock()
issueStock()
adjustStock()
```

and reservation handling.

Inventory quantities include concepts such as:

```text
qtyOnHand
qtyReserved
qtyAvailable
```

Conceptually:

```text
qtyAvailable = qtyOnHand - qtyReserved
```

but Codex must not independently implement this formula if the backend service already provides the authoritative value.

Inventory mutation belongs in the authoritative backend/service layer.

---

# 17. AIMS RIS WORKFLOW

The established RIS workflow uses states conceptually similar to:

```text
Draft
  ↓
Submitted
  ↓
Verified
  ↓
Reserved
  ↓
Approved
  ↓
Issued
  ↓
Completed
```

Do not bypass workflow rules by directly assigning a status.

Transitions should validate:

* current state;
* intended transition;
* actor;
* permission;
* inventory state;
* required approvals;
* business rules.

---

# 18. AIMS NUMBERING

Historical numbering conventions include:

```text
PREFIX-YYYY-MM-######
```

with monthly sequence handling.

Do not create frontend-only numbering logic.

Document numbers must be generated using the authoritative backend numbering implementation to prevent duplicates and concurrency problems.

---

# 19. AIMS / NEXUS INTEGRATION HISTORY

A previous AIMS authorization bug occurred when a NEXUS authorization request unexpectedly returned inventory data.

Root behavior involved:

```text
Authorization request
      ↓
TAESF dispatcher not reached correctly
      ↓
legacy GET fallback executed
      ↓
inventory array returned
      ↓
frontend rejected authorization response
```

Important rule:

> Command dispatch and identity handling must occur before inappropriate legacy fallback behavior.

When modifying AIMS startup or API logic, inspect both the modern NEXUS integration and legacy compatibility path.

---

# 20. ATLAS — ALBAY TRAVEL AND LEAVE ADMINISTRATION SYSTEM

ATLAS includes administrative workflows such as:

* Official Business;
* Activity / Meeting;
* To Do / Reminder;
* Request to Render Overtime;
* Accomplishment Report;
* calendar-related functions;
* travel-related functions;
* reporting;
* related administrative monitoring.

ATLAS has undergone many incremental frontend patches.

Do not infer the current version from historical version-log messages.

Inspect the actual current file.

---

# 21. ATLAS LEAVE POLICY

Established business decision:

### Leave monitoring applies to permanent personnel only.

Job Order personnel are not included in official leave balance monitoring.

Official leave/CTO-related reference balances are intended to use the Regional Office authoritative source where applicable rather than maintain a competing independent PO balance.

Do not reintroduce a standalone authoritative leave balance source into ATLAS without an explicit business decision.

---

# 22. ATLAS NEXUS INTEGRATION

ATLAS has already undergone NEXUS shared-session integration.

Historical implementation included:

* NEXUS launch context;
* trusted session registration;
* backend validation;
* shared-secret validation;
* role authorization.

A previous:

```text
SIGNATURE_INVALID
```

problem was resolved by aligning the NEXUS and ATLAS shared-secret configuration.

Direct opening of ATLAS without NEXUS launch context historically produced:

```text
No NEXUS launch session received
```

Do not remove integrated launch/session checks without understanding the intended access model.

---

# 23. ATLAS DATA MIGRATION

ATLAS Block 1 records were migrated into a new Google Sheet/backend environment.

Historical migration baseline:

```text
Source records: approximately 1,670
```

Migration processes included:

* preview;
* insert detection;
* update detection;
* unchanged detection;
* duplicate source-ID identification;
* source-record mapping;
* authoritative-row selection.

A known historical configuration included:

```text
ATLAS_CONFIG.sheets.migrationRecordMap = "MigrationRecordMap"
```

This is historical context only.

Verify the current Apps Script code before relying on this setting.

---

# 24. RRRO / RRMS

The Registry of Relevant Risks and Opportunities is being developed as a NEXUS module.

The technical implementation may use the name:

```text
RRMS
```

while the business process is referred to as:

```text
RRRO
```

Do not rename paths or modules solely to make these names identical.

Inspect current implementation.

---

# 25. RRRO PERMANENT REGISTRY PRINCIPLE

A risk should not automatically become an entirely new master record merely because a new calendar year starts.

Intended design:

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

The permanent registry preserves historical continuity.

---

# 26. RRRO FUNCTIONAL AREAS

Historical/current RRRO design contains areas such as:

* Dashboard;
* Monitoring Center;
* Risk Registry;
* Reports;
* Audit Room.

Risk-record functionality has included:

* Open Record;
* Action Plans;
* Quarterly Monitoring;
* Annual Residual Review;
* Risk History;
* Approvals.

Do not assume every feature is complete.

Inspect current code and current UI behavior.

---

# 27. RRRO APPROVAL / GOVERNANCE PRINCIPLE

RRRO should preserve strong traceability and segregation of duties.

Important concepts include:

* maker;
* checker/reviewer;
* approver;
* action-plan responsibility;
* quarterly monitoring;
* approval history;
* audit history;
* report generation;
* source lineage.

Frontend buttons must not be the only protection around approval transitions.

---

# 28. RRRO MIGRATION RULE

Existing RRRO information from historical annual worksheets must be migrated conservatively.

Rules:

* preserve source lineage;
* retain original IDs where possible;
* identify duplicates;
* do not silently merge uncertain records;
* do not silently correct questionable source data;
* flag uncertain matching for human validation;
* maintain an auditable migration mapping;
* require validation before accepting migrated records as authoritative.

---

# 29. TALDMS

TALDMS is the Training and Learning Development Management System.

Development scope has included:

### Phase 1

* Login
* Role
* Employee
* Settings
* Dashboard

### Phase 2

* Training
* Workforce
* Annual planning
* TREAP
* TDOR

### Phase 3

* Analytics
* Email
* Drive integration
* Audit Dashboard

Additional design concepts include:

* Learning Intervention;
* Knowledge Transfer;
* Outcomes;
* Audit Room;
* Organization Capability Index;
* Config-Driven Workflow;
* Dynamic Permission;
* Policy Engine;
* Executive Storyboard.

---

# 30. TALDMS ARCHITECTURAL CAUTION

TALDMS historically uses a more modular frontend layout than some older NEXUS applications.

It has included concepts such as:

```text
TALDMS/
├── index.html
├── CSS/
├── JS/
└── Modules/
```

Earlier development reviews identified some modules that were incomplete or not yet fully wired, including areas related to:

* routing;
* workflow;
* notifications;
* authentication;
* authorization.

Do not rebuild an apparently incomplete component until the current repository confirms its actual status and intended purpose.

---

# 31. TITAN AND OTHER NEXUS MODULES

Other modules historically represented in NEXUS include:

* TITAN — Toolkit Inventory and Tracking Allocation Network;
* AMS;
* ARMMS;
* ITSM;
* ORACLE;
* PSP-PRTS;
* PROSPER;
* AFLOW;
* other active or conceptual modules.

A filename or portal card does not automatically establish whether a system is:

* operational;
* experimental;
* conceptual;
* archived;
* planned.

Codex must inspect:

* actual page;
* NEXUS application registry;
* route;
* metadata;
* frontend code;
* authentication behavior.

---

# 32. ROLE-BASED ACCESS CONTROL

NEXUS modules must use RBAC.

Historical ATLAS permission concepts included:

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

This is historical architectural context.

Codex must inspect the current role/permission implementation before modifying permissions.

Do not create an independent second permission system inside a module if NEXUS already provides one.

---

# 33. DATA AUTHORITY

Before changing any feature, determine its source of truth.

Examples:

```text
NEXUS identity/session
→ NEXUS authentication backend

Inventory quantities
→ AIMS authoritative backend

Official leave balances
→ designated Regional Office source

RRRO records/history
→ RRRO authoritative backend

Settings
→ designated settings/configuration source
```

Do not create a competing data authority.

---

# 34. GOOGLE SHEETS BACKEND RULES

Several NEXUS systems use Google Sheets as operational data stores.

When modifying backend code:

* inspect actual headers;
* preserve existing schema compatibility;
* centralize header/column mappings where possible;
* use batch reads;
* use batch writes;
* avoid repeated `getRange()` calls in large loops;
* avoid repeated `setValue()` inside large loops;
* avoid unnecessary full-sheet scans;
* validate expected schema;
* preserve IDs;
* preserve migration lineage;
* use locking where concurrency matters.

Do not casually rename Google Sheet headers.

---

# 35. CONCURRENCY

The following may be concurrency-sensitive:

* inventory receipt;
* inventory issue;
* stock reservation;
* document numbering;
* approval transitions;
* transaction creation.

Inspect whether the backend uses:

```text
LockService
```

or another concurrency mechanism.

Do not introduce document-number or inventory updates that can produce duplicate or inconsistent records when simultaneous transactions occur.

---

# 36. GOVERNMENT RECORDS / AUDITABILITY

NEXUS supports government administrative processes.

Official transactions must preserve auditability.

Where applicable, records should retain information such as:

* record ID;
* transaction ID;
* actor;
* account;
* employee;
* role;
* action;
* previous value;
* new value;
* timestamp;
* related workflow;
* source;
* approval state;
* remarks/reason.

Do not silently overwrite finalized records.

Prefer append-only history or explicit amendment history where business rules require traceability.

---

# 37. BROWSER STORAGE

Search the frontend for:

```text
localStorage
sessionStorage
indexedDB
```

For every stored value, determine whether it is:

* UI preference;
* cache;
* session metadata;
* temporary state;
* sensitive information;
* authoritative business data.

Browser storage should not become the authoritative source for official TESDA administrative records unless explicitly synchronized by the system architecture.

---

# 38. HARDCODED ENDPOINTS

Search for:

```text
script.google.com
firebaseapp.com
web.app
http://
https://
```

Document significant hardcoded endpoints.

Do not automatically replace them.

Determine first whether:

* the URL is active;
* it belongs to Apps Script;
* it belongs to Firebase;
* a central configuration mechanism already exists;
* another module depends on it.

---

# 39. LEGACY PRESERVATION POLICY

A core development rule is:

> Replace one workflow at a time and preserve legacy functionality until the new implementation is verified.

Preferred migration sequence:

```text
Working legacy behavior
        ↓
Map dependencies
        ↓
Implement TAESF replacement
        ↓
Connect one workflow
        ↓
Test
        ↓
Verify parity
        ↓
Retire replaced legacy implementation
```

Do not perform large-scale rewrites merely because legacy code is monolithic or visually untidy.

---

# 40. NO UNREQUESTED REFACTORING

Do not perform unrelated:

* mass renaming;
* broad code formatting;
* folder restructuring;
* framework replacement;
* architectural rewrites;
* cleanup of unrelated functions;
* removal of legacy blocks;
* component conversion.

Keep each diff focused on the current task.

---

# 41. REQUIRED IMPLEMENTATION WORKFLOW

For every implementation task, Codex must provide or internally follow this structure.

## 1. Objective

State exactly what is being changed.

## 2. Files to Modify

List only files actually verified in the repository.

## 3. Exact Existing Function / Block

Identify the exact function, class, HTML block, event handler, or CSS section being changed.

## 4. Replacement Scope

Clearly state:

```text
Replace the entire function.
```

or:

```text
Replace only this block.
```

or:

```text
Insert immediately after [exact verified code].
```

## 5. Complete Implementation

When giving code to the user, provide complete copy/paste-ready code.

Do not use placeholders such as:

```text
// existing code here
```

inside a replacement block.

When Codex has repository write access, it may apply the verified change directly.

## 6. Exact Location

Identify the exact file and code location.

## 7. Testing

Provide concrete testing steps.

## 8. Expected Result

Explain exactly what successful behavior should look like.

---

# 42. CODING WITH REPOSITORY WRITE ACCESS

When Codex can directly edit GitHub/local repository files:

1. inspect first;
2. identify dependencies;
3. edit only verified files;
4. keep changes focused;
5. inspect the diff;
6. run available tests/checks;
7. verify no secrets were introduced;
8. summarize exactly what changed.

Do not modify additional files simply to "clean things up."

---

# 43. TESTING REQUIREMENT

Depending on the workflow, test:

* valid operation;
* invalid input;
* unauthorized access;
* insufficient permission;
* duplicate action;
* direct URL access;
* refresh;
* expired session;
* backend failure;
* API response;
* Google Sheet persistence;
* audit record creation;
* approval transition;
* legacy compatibility;
* production Firebase behavior.

A page rendering successfully does not prove the workflow is operational.

---

# 44. FRONTEND DEBUGGING

For frontend problems inspect:

```text
Browser Console
Network
Application / Storage
DOM
loaded scripts
request payload
response payload
HTTP status
```

Capture the actual error.

Do not infer a backend failure solely from an error message displayed by the UI.

---

# 45. BACKEND DEBUGGING

When actual Apps Script source becomes available, inspect:

```text
request
↓
endpoint
↓
identity/session validation
↓
command dispatcher
↓
application service
↓
domain service
↓
repository
↓
Google Sheet
↓
response builder
```

Also inspect Apps Script execution logs.

Trace the request from frontend to persistence and back.

---

# 46. BACKWARD COMPATIBILITY

Before changing a shared API, function, response, or NEXUS integration:

Search for all consumers.

Determine:

* who calls it;
* what payload is sent;
* which fields are read;
* what errors are expected;
* which applications depend on it.

Do not change a shared contract without checking its consumers.

---

# 47. UI / UX PRINCIPLES

NEXUS applications are operational administrative systems.

Prioritize:

* clear status;
* readable tables;
* visible controls;
* usable modal scrolling;
* actionable errors;
* confirmation for destructive actions;
* useful empty states;
* consistent spacing;
* sensible responsive behavior.

Do not redesign stable UI unless the task requires it.

---

# 48. SOURCE CONTROL

Before substantial changes:

* identify affected files;
* confirm active files;
* avoid backup copies;
* avoid unrelated formatting.

After changes:

```text
git diff
```

or equivalent should be reviewed.

Verify:

* no secrets added;
* no unrelated files modified;
* no accidental deletion;
* no duplicate implementation created.

---

# 49. COMMIT STYLE

Prefer focused commits such as:

```text
fix(atlas): enforce NEXUS bootstrap before initialization
```

```text
fix(aims): route authorization through NEXUS dispatcher
```

```text
feat(rrro): add quarterly monitoring history
```

```text
refactor(taesf): centralize repository error handling
```

Do not combine unrelated modules in one commit unless the change genuinely spans them.

---

# 50. DEPLOYMENT DISTINCTION

Codex must distinguish between:

```text
Source changed
```

```text
Local test passed
```

```text
Committed
```

```text
Pushed to GitHub
```

```text
Firebase deployed
```

```text
Apps Script deployed
```

```text
Production verified
```

These are different stages.

Never claim production is fixed unless production has actually been verified.

---

# 51. DEPLOYMENT REPORT

After implementation, report:

```text
Changed Files:
- ...

Frontend Change:
- Yes / No

Google Apps Script Backend Change:
- Yes / No

Firebase Deployment Required:
- Yes / No

Apps Script Deployment Required:
- Yes / No

Google Sheet Schema/Migration Required:
- Yes / No

Configuration Change Required:
- Yes / No

Testing Performed:
- ...

Expected Production Result:
- ...
```

---

# 52. PROJECT DECISION PRIORITY

If information conflicts, use this priority:

```text
Current explicit user instruction
        ↓
Actual current repository
        ↓
Actual current backend source
        ↓
Current approved business rule
        ↓
CODEX_HANDOFF.md
        ↓
Historical implementation
```

This handoff provides context.

It does not override newer verified code or explicit decisions.

---

# 53. WHAT CODEX MUST NOT ASK THE USER TO RE-EXPLAIN

Do not ask the user to explain from scratch:

* what NEXUS is;
* what TAESF is;
* what AIMS is;
* what ATLAS is;
* what RRRO/RRMS is;
* what TALDMS is;
* why Google Apps Script is used;
* why Google Sheets are used;
* why Firebase hosts the frontend;
* why GitHub currently contains only frontend files;
* the required implementation workflow;
* the legacy-preservation policy.

This document already establishes those fundamentals.

Ask only when a genuinely new business decision or missing source code is required.

---

# 54. FIRST REPOSITORY AUDIT

Before making the first development change, Codex must perform a **read-only repository audit**.

Inspect the repository root.

Determine:

1. actual repository structure;
2. primary NEXUS portal file;
3. actual application/module files;
4. shared JavaScript/CSS/assets;
5. authentication/bootstrap scripts;
6. NEXUS integration scripts;
7. AIMS frontend implementation;
8. ATLAS frontend implementation;
9. RRRO/RRMS frontend implementation;
10. TALDMS frontend implementation;
11. TITAN and other modules;
12. frontend API endpoints;
13. application registry/routing;
14. browser storage use;
15. hardcoded Apps Script/Firebase URLs;
16. duplicate files;
17. backup files;
18. apparently unused files;
19. security concerns;
20. initialization-order concerns.

Do not modify files during this audit.

---

# 55. FIRST AUDIT — BACKEND RULE

If TAESF or `.gs` files are not present:

Do NOT report:

> Backend is missing.

Instead report:

> The Google Apps Script / TAESF backend is maintained separately and is outside the scope of the current frontend repository.

Identify only what can be verified from the frontend:

* endpoint;
* action/command;
* payload;
* expected response;
* session mechanism.

---

# 56. BUILD AN API CONTRACT MAP

During the initial audit, map frontend/backend integration where possible.

Example format:

```text
Application:
AIMS

Frontend File:
[verified path]

Endpoint:
[verified Apps Script endpoint — redact sensitive values if needed]

Method:
POST

Action:
[verified action]

Payload:
[verified payload structure]

Expected Response:
[verified structure]

Backend Source:
External / not available in current repository
```

Repeat for ATLAS, RRRO, TALDMS, and NEXUS where applicable.

---

# 57. BUILD A SCRIPT DEPENDENCY MAP

For each major application, determine what scripts are actually loaded.

Example:

```text
AIMS.html
  ├── [verified shared script]
  ├── [verified NEXUS bootstrap]
  ├── [verified AIMS integration]
  └── [verified application script]
```

Do not use historical filenames without confirming them.

Initialization order is particularly important because previous NEXUS integration failures were caused by bootstrap sequencing.

---

# 58. VERIFY APPLICATION REGISTRY

Locate how NEXUS defines available applications.

Determine whether application metadata is:

* HTML-hardcoded;
* JavaScript configuration;
* JSON;
* backend-provided;
* another registry mechanism.

Document, where available:

```text
Application ID
Display Name
Route
Status
Icon
Permission
Launch Method
```

Do not redesign this registry during the initial audit.

---

# 59. VERIFY DIRECT ACCESS

Inspect what happens when major app routes are opened directly without normal NEXUS launch context.

Examples may include:

```text
/AIMS.html
/apps/ATLAS.html
/TALDMS/
/RRMS/
```

Determine:

* whether page shell loads;
* whether session is required;
* whether protected data loads;
* whether backend requests are blocked;
* whether redirect occurs.

Do not confuse a publicly downloadable HTML shell with unauthorized backend access.

---

# 60. CURRENT DEVELOPMENT PHILOSOPHY

The project follows this priority:

```text
Working operational system
        ↓
Safe integration
        ↓
Verification
        ↓
Controlled modernization
        ↓
Refactoring after stability
```

The system supports real TESDA administrative workflows.

Treat production data and workflow integrity accordingly.

---

# 61. FIRST CODEX TASK AFTER READING THIS FILE

Perform a complete **READ-ONLY NEXUS frontend repository architecture audit**.

Read this `CODEX_HANDOFF.md` completely first.

Then inspect the actual repository root.

Do not modify, create, delete, rename, move, refactor, format, or commit any application file during this first task.

Report:

1. verified repository structure;
2. verified NEXUS portal/entry point;
3. verified application registry;
4. NEXUS authentication/session/bootstrap frontend;
5. AIMS frontend;
6. ATLAS frontend;
7. RRRO/RRMS frontend;
8. TALDMS frontend;
9. TITAN and other modules;
10. shared frontend architecture;
11. script dependency/loading order;
12. Apps Script endpoints/API contracts visible from frontend;
13. localStorage/sessionStorage usage;
14. duplicate/backup/unreferenced files;
15. security concerns;
16. initialization/integration risks;
17. differences between actual repository and this handoff;
18. frontend areas that require actual backend inspection before modification;
19. recommended next development target.

For each important finding, provide:

* exact file path;
* exact function/class/HTML block where possible;
* supporting reason.

Do not guess about unavailable backend code.

---

# 62. EXPECTED FIRST RESPONSE FROM CODEX

The first response should approximately follow:

```text
NEXUS repository audit completed.

Repository Scope:
[verified]

Frontend Root:
[verified]

NEXUS Portal:
[verified file]

Applications Detected:
[...]

Authentication / Session Frontend:
[...]

AIMS:
[...]

ATLAS:
[...]

RRRO / RRMS:
[...]

TALDMS:
[...]

Other Modules:
[...]

API / Apps Script Integrations:
[...]

Backend Source Status:
External / not present in this frontend repository

Important Findings:
[...]

Handoff Discrepancies:
[...]

Recommended Next Step:
[...]

No application files were modified.
```

---

# 63. FUTURE BACKEND ONBOARDING

When the actual TAESF / Apps Script source is later made available to Codex, perform a second **read-only backend audit before implementation**.

Map:

```text
ApplicationService
Command Dispatcher
Identity / Session
Authorization
Services
Repositories
Audit Service
Settings
Inventory Engine
ATLAS Services
AIMS Services
RRRO Services
TALDMS Services
Google Sheet Schemas
API Response Builder
Locks / Concurrency
```

Then connect the verified backend implementation to the frontend API contract already mapped during the first audit.

Do not assume historical backend architecture is identical to the current deployed version.

---

# 64. FUNDAMENTAL DEVELOPMENT RULE

The core rule of NEXUS development is:

> **Inspect the actual implementation first. Understand the existing workflow. Identify the authoritative data source. Change only what is necessary. Test immediately. Preserve working behavior until the replacement is verified.**

NEXUS is an evolving production administrative ecosystem.

It is not a greenfield demonstration project.

---

# END OF CODEX HANDOFF

**Codex instruction:** When project history is unavailable, read this file before beginning NEXUS development. Use the repository as the source of truth for frontend implementation and require the actual external Apps Script / TAESF source before making backend changes.
