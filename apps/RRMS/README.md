# NEXUS-RRMS

Risk and Opportunity Registry, Monitoring and Archiving System for TESDA Albay.

## Implementation Block 1

This block provides:

- Independent application shell under `public/apps/RRMS/`
- Permanent Risk/Opportunity master record
- Automatic permanent Risk ID generation
- Client-side validation
- TESDA RRRO 4x4 rating calculation
- Local storage repository abstraction
- Create, edit, search, and remove-unsubmitted-draft actions
- Initial dashboard summary
- Audit events for create, update, and draft removal
- Browser-based rating test page

## Direct test

Open `public/apps/RRMS/index.html` through a local web server or Firebase Hosting emulator.

Open `public/apps/RRMS/Tests/risk.rating.test.html` and confirm `16/16 rating tests passed`.

## Important limitation

This first block uses browser local storage. Authentication, authorization, annual assessments, quarterly monitoring, evidence, approvals, notifications, reports, and migration are scheduled for later implementation blocks.


## Implementation Block 2 update
Affected Objective Type now supports one or more selections. Existing Block 1 records using the legacy single `objectiveType` field are normalized automatically to the new `objectiveTypes` array when loaded.
