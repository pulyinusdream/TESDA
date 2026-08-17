"use strict";
TAESF.NTTC.Constants = Object.freeze({
  APP_CODE: "NTTC",
  VERSION: "2.0.0-block10-review-scheduling-computation",
  CONTROL_PREFIX: "NTTC-R05-ALB",
  CLAIM_PREFIX: "CS-NTTC",
  HOURS_PER_WORK_YEAR: 2312,
  HOURS_PER_CREDIT_UNIT: 40,
  MIN_NC_LEVEL: 2,
  NC_NUMBER_LENGTH: 14,
  CREDENTIAL_VALIDITY_YEARS: 5,
  MAX_UPLOAD_BYTES: 10 * 1024 * 1024,
  LEARNER_ID_PATTERN: "^[A-Z.]{3}-\\d{2}-\\d{3}-\\d{5}-\\d{3}$",
  ACCEPTED_UPLOAD_MIME: Object.freeze(["application/pdf","image/jpeg","image/png"]),
  EMPLOYMENT_STATUSES: Object.freeze([
    "Permanent / Regular",
    "Contractual",
    "Job Order / Contract of Service",
    "Part-time",
    "Self-employed / Industry Practitioner",
    "Not currently employed",
    "Other"
  ]),
  DOCUMENT_TYPES: Object.freeze({
    NC_CERTIFICATE:"NC_CERTIFICATE",
    TMC_CERTIFICATE:"TMC_CERTIFICATE",
    IWER_EVIDENCE:"IWER_EVIDENCE",
    GOVERNMENT_ID:"GOVERNMENT_ID",
    OTHER_SUPPORTING:"OTHER_SUPPORTING"
  }),
  IWER_MODALITIES: Object.freeze({
    PRE_SERVICE:Object.freeze({
      label:"Pre-Service Industry Work Experience",
      short:"Work experience gained before you became a TVET trainer.",
      explanation:"Choose this when your relevant industry experience was gained before your employment as a TVET trainer. This may include permanent or contractual industry work and relevant in-plant OJT, DTP/DTS, or apprenticeship experience before becoming a trainer.",
      examples:"Examples of evidence: Certificate of Employment from the appropriate industry; or Certificate of Training from an accredited/registered DTP/DTS, OJT, or apprenticeship provider.",
      credit:"TESDA Circular No. 33, s. 2017 provides a 1:1 equivalency for qualifying pre-service industry work experience."
    }),
    INDUSTRY_IMMERSION:Object.freeze({
      label:"Industry Immersion",
      short:"Industry exposure undertaken as a TVET trainer to update industry skills and practices.",
      explanation:"Choose this when, while already serving as a TVET trainer, you were deployed to an industry/company to enhance skills, knowledge, and attitudes in your area of specialization for application in training delivery.",
      examples:"Examples of evidence: Training Certificate on Industry Immersion and/or the applicable Trainer/Trainee Record Book or supporting industry records.",
      credit:"TESDA Circular No. 33, s. 2017 recognizes qualifying industry immersion on a 1:1 hour basis."
    }),
    DTP_DTS:Object.freeze({
      label:"DTP/DTS (In-Plant Program)",
      short:"Participation in the in-plant component of a Dualized Training Program or Dual Training System.",
      explanation:"Choose this when you were an in-center/school trainer involved in a registered DTP/DTS program and gained relevant exposure through its in-plant component.",
      examples:"Examples of evidence may include the DTP/DTS accreditation, notarized Memorandum of Agreement, and other records required under the applicable circular/evidence guide.",
      credit:"TESDA Circular No. 33, s. 2017 applies a reduced equivalency to the duration of the DTP/DTS in-plant program. Final credit remains subject to focal/PTAG review."
    }),
    TECHNICAL_CONSULTING:Object.freeze({
      label:"Technical Consulting",
      short:"Technical service you provided to an enterprise in your area of specialization.",
      explanation:"Choose this when you provided technical consulting to an enterprise, including qualifying consulting intended to support productivity enhancement, and the work is relevant to the qualification being applied for.",
      examples:"Upload documents that establish the consulting engagement, its inclusive dates/duration, actual work performed, and completion or output where applicable.",
      credit:"Qualifying technical consulting may earn industry-work-experience credit subject to the evidence rules and assessment under the applicable TESDA circulars."
    }),
    INTERNATIONAL_IMMERSION:Object.freeze({
      label:"International Industry Immersion",
      short:"Industry immersion undertaken in another country to enhance skills in the trainer’s specialization.",
      explanation:"Choose this when you completed qualifying industry immersion in another country. Under TESDA Circular No. 51, the duration receives special equivalent-hour treatment and remains subject to documentary review.",
      examples:"Upload certificates, deployment/immersion records, and other documents showing the host industry, dates, duration, and relevant activities.",
      credit:"TESDA Circular No. 51, s. 2017 provides two equivalent hours for every actual hour of qualifying international industry immersion."
    }),
    INTERNATIONAL_TRAINING:Object.freeze({
      label:"International Training",
      short:"Skills upgrading or trainer development completed in another country.",
      explanation:"Choose this when you completed qualifying international training relevant to your specialization. This modality is used under the teaching/credit-equivalency route and remains subject to documentary review.",
      examples:"Upload the training certificate and records showing the provider, country, dates, duration, and relevance to the qualification.",
      credit:"TESDA Circular No. 51, s. 2017 provides two equivalent hours for every actual hour of qualifying international training."
    }),
    TEACHING_EQUIVALENCY:Object.freeze({
      label:"Teaching Experience / Credit Equivalency Route",
      short:"For qualified trainers using teaching experience together with another recognized modality.",
      explanation:"Choose this only when you are using the credit-equivalency route based on teaching experience. Teaching experience is not used alone: the circular requires the applicable teaching credit together with credit from a recognized modality such as industry immersion, DTP/DTS, technical consulting, international industry immersion, or international training.",
      examples:"Upload evidence of your TVET teaching experience and the supporting documents for the other qualifying modality or modalities that will be combined with it.",
      credit:"Under TESDA Circular Nos. 50 and 51, s. 2017, teaching experience starts earning credit at a minimum of three years and is combined with qualifying modality credits. Final computation is subject to review."
    })
  }),
  STATUS: Object.freeze({
    DRAFT:"DRAFT", READY_FOR_ONLINE_SUBMISSION:"READY_FOR_ONLINE_SUBMISSION",
    SUBMITTED_FOR_INITIAL_REVIEW:"SUBMITTED_FOR_INITIAL_REVIEW", UNDER_INITIAL_REVIEW:"UNDER_INITIAL_REVIEW",
    WITH_DEFICIENCY:"WITH_DEFICIENCY", COMPLIANCE_SUBMITTED:"COMPLIANCE_SUBMITTED", UNDER_RE_REVIEW:"UNDER_RE_REVIEW",
    APPROVED_FOR_HARDCOPY_SUBMISSION:"APPROVED_FOR_HARDCOPY_SUBMISSION", SUBMISSION_SCHEDULED:"SUBMISSION_SCHEDULED",
    APPOINTMENT_CONFIRMED:"APPOINTMENT_CONFIRMED", APPLICANT_ARRIVED:"APPLICANT_ARRIVED",
    HARDCOPY_UNDER_VERIFICATION:"HARDCOPY_UNDER_VERIFICATION", HARDCOPY_RECEIVED:"HARDCOPY_RECEIVED", ORIGINALS_VERIFIED:"ORIGINALS_VERIFIED",
    FOR_PO_PROCESSING:"FOR_PO_PROCESSING", FOR_PD_ENDORSEMENT:"FOR_PD_ENDORSEMENT", READY_FOR_RO_TRANSMITTAL:"READY_FOR_RO_TRANSMITTAL",
    TRANSMITTED_TO_REGIONAL_OFFICE:"TRANSMITTED_TO_REGIONAL_OFFICE", REGIONAL_OFFICE_PROCESSING:"REGIONAL_OFFICE_PROCESSING",
    RETURNED_BY_REGIONAL_OFFICE:"RETURNED_BY_REGIONAL_OFFICE", FOR_COMPLIANCE_WITH_RO_FINDING:"FOR_COMPLIANCE_WITH_RO_FINDING",
    RETRANSMITTED_TO_REGIONAL_OFFICE:"RETRANSMITTED_TO_REGIONAL_OFFICE", NTTC_RECEIVED_FROM_RO:"NTTC_RECEIVED_FROM_RO",
    CERTIFICATE_RECORDED:"CERTIFICATE_RECORDED", CERTIFICATE_READY_FOR_RELEASE:"CERTIFICATE_READY_FOR_RELEASE",
    RELEASED:"RELEASED", CLOSED:"CLOSED"
  }),
  APPLICANT_STAGE: Object.freeze({
    DRAFT:"ONLINE APPLICATION DRAFT", REVIEW:"SUBMITTED FOR INITIAL REVIEW", COMPLIANCE:"REQUIRES COMPLIANCE",
    HARDCOPY_READY:"APPROVED FOR HARD-COPY SUBMISSION", HARDCOPY_RECEIVED:"HARD COPY RECEIVED",
    RO:"SUBMITTED TO REGIONAL OFFICE", RO_PROCESSING:"UNDER REGIONAL OFFICE PROCESSING",
    READY:"CERTIFICATE READY FOR RELEASE", RELEASED:"RELEASED"
  }),
  MODALITY_FACTOR: Object.freeze({ PRE_SERVICE:1, INDUSTRY_IMMERSION:1, DTP_DTS:0.5, TECHNICAL_CONSULTING:1, INTERNATIONAL_IMMERSION:2, INTERNATIONAL_TRAINING:2 }),
  DISCLAIMER: "Online submission is for initial documentary review only. It does not constitute approval or issuance of the National TVET Trainer Certificate. Complete applications accepted by the TESDA Albay Provincial Office are transmitted to the TESDA Regional Office for review, processing and issuance in accordance with applicable TESDA guidelines.",
  SHEETS: Object.freeze([
    "NTTC_CONFIG","NTTC_APPLICANTS","NTTC_APPLICATIONS","NTTC_QUALIFICATIONS","NTTC_REQUIREMENTS","NTTC_CREDENTIALS",
    "NTTC_EVIDENCES","NTTC_DOCUMENTS","NTTC_SCREENING","NTTC_DEFICIENCIES","NTTC_ASSESSMENTS","NTTC_EVIDENCE_RATINGS",
    "NTTC_CREDIT_COMPUTATION","NTTC_APPOINTMENTS","NTTC_HARDCOPY_RECEIPT","NTTC_ENDORSEMENTS","NTTC_CERTIFICATES",
    "NTTC_NOTIFICATIONS","NTTC_STATUS_HISTORY","NTTC_AUDIT_LOG","NTTC_SETTINGS"
  ])
});
