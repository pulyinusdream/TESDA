# NTTC Block 2.1 — NEXUS UI & Identifier Controls

Deployment root: `public/apps/nttc/`

Changes:
- Modern NEXUS public-service visual design.
- TESDA logo reused from `public/assets/Logo.png` as a low-opacity watermark; no duplicate logo file is required.
- Applicant registration now requires TESDA Learner ID.
- Learner ID format: three uppercase characters (letters or dot accepted), then `-NN-NNN-NNNNN-NNN`.
- NC certificate number accepts 14 digits only.
- Internal consistency check compares certificate coding with date issued; applicant receives only the generic message to check the certificate number and date issued.
- Final documentary verification remains with the CAC focal.

Replace the existing contents of `public/apps/nttc/` with this package.
Do not place it at `public/NTTC/`.
