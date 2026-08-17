"use strict";

NEXUS_RRMS.Configuration.Constants = Object.freeze({
    RECORD_TYPES: Object.freeze(["RISK", "OPPORTUNITY"]),
    CONTEXT_TYPES: Object.freeze(["INTERNAL", "EXTERNAL"]),
    OBJECTIVE_TYPES: Object.freeze([
        "GAA",
        "OPCR",
        "OP",
        "CITIZENS_CHARTER",
        "LEGAL",
        "OTHER"
    ]),
    RISK_PROFILES: Object.freeze([
        "INTERNAL_GOVERNANCE_POLICIES_PROCESSES",
        "INTERNAL_PEOPLE_CULTURE",
        "INTERNAL_INFRASTRUCTURE_IT_RESOURCES",
        "INTERNAL_OTHERS",
        "EXTERNAL_POLITICAL_LEGAL",
        "EXTERNAL_ECONOMIC_INDUSTRY_STAKEHOLDER",
        "EXTERNAL_SOCIAL",
        "EXTERNAL_TECHNOLOGICAL",
        "EXTERNAL_ENVIRONMENTAL"
    ]),
    STATUSES: Object.freeze([
        "DRAFT",
        "UNDER_CONSULTATION",
        "UNDER_ASSESSMENT",
        "ACTIVE",
        "ARCHIVE_ELIGIBLE",
        "ARCHIVED",
        "REACTIVATED",
        "SUPERSEDED",
        "CLOSED"
    ]),
    CLASSIFICATIONS: Object.freeze([
        "EMERGING",
        "TOP_PRIORITIZED",
        "ARCHIVE_MONITORING",
        "ARCHIVE_ELIGIBLE",
        "ARCHIVED"
    ]),
    RISK_LEVELS: Object.freeze(["LOW", "MEDIUM", "HIGH", "VERY_HIGH"]),
    STORAGE_KEYS: Object.freeze({
        RISK_MASTER: "risk_master",
        AUDIT_LOG: "audit_log"
    })
});
