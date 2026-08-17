"use strict";

NEXUS_RRMS.Modules.Risk = NEXUS_RRMS.Modules.Risk || {};

NEXUS_RRMS.Modules.Risk.Model = (() => {
    function create(data) {
        const now = NEXUS_RRMS.Utilities.Date.nowIso();
        const recordType = String(data.recordType || "RISK").toUpperCase();

        const model = {
            riskId: data.riskId,
            legacyRiskNo: String(data.legacyRiskNo || "").trim(),
            recordType,
            firstIdentifiedDate: data.firstIdentifiedDate,
            firstIdentifiedYear: Number(data.firstIdentifiedYear),
            issueTitle: String(data.issueTitle || "").trim(),
            riskStatement: recordType === "RISK" ? String(data.riskStatement || "").trim() : "",
            opportunityStatement: recordType === "OPPORTUNITY" ? String(data.opportunityStatement || "").trim() : "",
            contextType: String(data.contextType || "").toUpperCase(),
            riskProfile: String(data.riskProfile || "").toUpperCase(),
            objectiveTypes: Object.freeze(
                (Array.isArray(data.objectiveTypes)
                    ? data.objectiveTypes
                    : [data.objectiveType].filter(Boolean)
                )
                    .map((value) => String(value || "").toUpperCase())
                    .filter(Boolean)
            ),
            objectiveReference: String(data.objectiveReference || "").trim(),
            objectiveStatement: String(data.objectiveStatement || "").trim(),
            office: String(data.office || "TESDA Albay Provincial Office").trim(),
            processCode: String(data.processCode || "GEN").trim().toUpperCase(),
            processName: String(data.processName || "").trim(),
            riskOwner: String(data.riskOwner || "").trim(),
            currentStatus: String(data.currentStatus || "DRAFT").toUpperCase(),
            currentClassification: String(data.currentClassification || "EMERGING").toUpperCase(),
            initialLikelihood: recordType === "RISK" ? Number(data.initialLikelihood) : null,
            initialConsequence: recordType === "RISK" ? Number(data.initialConsequence) : null,
            initialScore: recordType === "RISK" ? Number(data.initialScore) : null,
            initialLevel: recordType === "RISK" ? String(data.initialLevel || "").toUpperCase() : null,
            ratingBasis: recordType === "RISK" ? String(data.ratingBasis || "").trim() : "",
            consultationSummary: String(data.consultationSummary || "").trim(),
            createdAt: data.createdAt || now,
            createdBy: String(data.createdBy || "Local User").trim(),
            updatedAt: now,
            rowVersion: Number(data.rowVersion || 1)
        };

        return Object.freeze(model);
    }

    function cloneForUpdate(existing, changes) {
        return create({
            ...existing,
            ...changes,
            riskId: existing.riskId,
            firstIdentifiedDate: existing.firstIdentifiedDate,
            firstIdentifiedYear: existing.firstIdentifiedYear,
            createdAt: existing.createdAt,
            createdBy: existing.createdBy,
            rowVersion: Number(existing.rowVersion || 1) + 1
        });
    }

    return Object.freeze({ create, cloneForUpdate });
})();
