# TAESF_TALDMS_ENGINEERING_HANDBOOK_v1.0

**Version:** 1.0 (Living Document)\
**Project:** TESDA Albay Enterprise Systems Framework (TAESF)\
**Design System:** TAEDS\
**Application:** TALDMS -- Training and Learning Development Management
System

> This handbook is the authoritative engineering reference for
> continuing the project in any future AI conversation.

------------------------------------------------------------------------

# 1. Project Vision

Build a reusable enterprise framework (TAESF), an enterprise design
system (TAEDS), and business applications (beginning with TALDMS) using
a consistent, documented architecture.

Development philosophy:

> Implement → Verify → Freeze → Continue

------------------------------------------------------------------------

# 2. Architecture Principles

## Framework First

The framework is built before business modules.

## Dashboard Inheritance

Every business module inherits the Dashboard Shell.

Business modules only supply: - Header content - Sidebar content -
Breadcrumb - Main content

No module owns its own application layout.

## Layered Architecture

View → Controller → Service (orchestrator) → Validator / Policy /
Workflow / Numbering → Repository → Storage

Services coordinate; they do not become "God Objects".

------------------------------------------------------------------------

# 3. Approved Standards

## Folder Naming

All folders use lowercase.

## File Naming

Lowercase with dot notation.

Examples: - employee.service.js - employee.validator.js -
employee.list.view.js

## JavaScript Namespaces

PascalCase.

Examples: - TAESF.Loader - TAESF.Modules.Employee

------------------------------------------------------------------------

# 4. Framework Status

Completed:

F1 Enterprise Registry

F2 Application Lifecycle

F3 Bootstrap

F4 Logger

F5 Storage

F6 Test Harness

F7 Authentication

F8.1 Design Tokens

F8.2 Layout

F8.3 Cards

F8.4 Buttons

F8.5 Forms

F8.6 Tables

F8.7 Badges

F8.8 Notifications

F8.9 Dialogs

F8.10 Loading & Empty States

F8.11 Dashboard Shell

Framework v1.0 frozen.

------------------------------------------------------------------------

# 5. Framework Enhancements

Completed:

FE1 Loader Registry

FE2 Dynamic Script Loader

FE3 Loader Configuration & Debug Logging

Planned:

FE4 Manifest-driven Module Loader

Future: Enterprise Resource Loader

------------------------------------------------------------------------

# 6. Employee Module Progress

Completed: - employee.manifest.js - employee.model.js -
employee.repository.js - employee.validator.js - employee.service.js -
employee.controller.js - employee.list.view.js

Current state: Business UI paused pending loader verification.

------------------------------------------------------------------------

# 7. Numbering Standards

Learning Intervention:

LI-YYYY-MM-0001

Example:

LI-2026-07-0001

Monthly sequence reset.

------------------------------------------------------------------------

# 8. Documentation Standards

Maintain after every completed sprint:

-   PROJECT_STATUS.md
-   FRAMEWORK_STATUS.md
-   CHANGELOG.md
-   RELEASE_HISTORY.md
-   Architecture Decision Record (ADR)
-   This Engineering Handbook

------------------------------------------------------------------------

# 9. ADR Standards

Maintain ADRs using categorized identifiers:

-   ADR-FW
-   ADR-UI
-   ADR-BUS
-   ADR-DATA
-   ADR-DOC
-   ADR-OPS
-   ADR-SEC

Approved decisions include:

-   Framework First
-   Dashboard Inheritance
-   Lowercase folders
-   PascalCase namespaces
-   Service orchestration
-   Framework Freeze
-   Loader evolution
-   Documentation standards

------------------------------------------------------------------------

# 10. Loader Architecture

FE1 Registry

↓

FE2 Dynamic Loader

↓

FE3 Configuration

↓

FE4 Manifest-driven Loader

↓

Future Enterprise Resource Loader

------------------------------------------------------------------------

# 11. Testing Philosophy

Permanent verification pages:

sandbox/framework/ - framework-test.html - layout-test.html

sandbox/taeds/ - taeds-showcase.html

sandbox/loader/ - loader-test.html

sandbox/business/ - employee-master.html

Every sprint must be verified before completion.

------------------------------------------------------------------------

# 12. AI Collaboration Agreement

For every implementation:

-   Continue instead of restarting.
-   Do not redesign approved architecture without technical
    justification.
-   Recommendations require approval.
-   Once approved, recommendations become project standards.
-   Provide exact file names.
-   Provide exact folder names.
-   Provide complete code.
-   State whether to replace or append.
-   Provide verification steps.
-   Update project documentation after completed sprints.

------------------------------------------------------------------------

# 13. Roadmap

Framework - FE4 Manifest Loader - Resource Loader

Employee - Views - CRUD - Integration

Learning Module

TREAP

TDOR

Knowledge

Reports

Executive Dashboard

Administration

Production release

------------------------------------------------------------------------

# 14. Resume Development

Current milestone:

Verify FE1--FE3 using loader-test.html.

Then: - FE4 Manifest-driven Loader - Resume Business Sprint B1.6 -
Continue Employee Module

------------------------------------------------------------------------

# 15. Universal Prompt

We are continuing development of the TESDA Albay Enterprise Systems
Framework (TAESF), TAEDS, and TALDMS.

Treat this handbook together with:

-   PROJECT_STATUS.md
-   FRAMEWORK_STATUS.md
-   CHANGELOG.md
-   RELEASE_HISTORY.md
-   ADR.md

as the authoritative project documentation.

Preserve all approved architecture, naming conventions, folder
structure, documentation standards, and sprint methodology.

Do not redesign approved architecture without technical justification.

Continue from the current milestone.

Provide exact implementation instructions, complete code, verification
procedures, and update project documents after every completed sprint.

Treat approved recommendations as permanent project standards unless
superseded by a documented ADR.

------------------------------------------------------------------------

# Final Note

This handbook is intended to be the institutional memory of the project.
Future AI conversations should use it as the primary reference so
development remains consistent regardless of platform (ChatGPT, Claude,
Gemini, or similar capable AI systems).
