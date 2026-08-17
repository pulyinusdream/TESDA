"use strict";

NEXUS_RRMS.Modules.Risk.Validator = (() => {
    const constants = NEXUS_RRMS.Configuration.Constants;

    function isBlank(value) {
        return !String(value || "").trim();
    }

    function validate(data) {
        const errors = [];
        const recordType = String(data.recordType || "").toUpperCase();

        if (!constants.RECORD_TYPES.includes(recordType)) {
            errors.push("Record Type must be Risk or Opportunity.");
        }
        if (!data.firstIdentifiedDate) {
            errors.push("Date First Identified is required.");
        }
        if (!Number.isInteger(Number(data.firstIdentifiedYear))) {
            errors.push("Year First Identified is required.");
        }
        if (data.firstIdentifiedDate) {
            const dateYear = NEXUS_RRMS.Utilities.Date.yearOf(data.firstIdentifiedDate);
            if (dateYear !== Number(data.firstIdentifiedYear)) {
                errors.push("Year First Identified must match the Date First Identified.");
            }
        }
        if (isBlank(data.issueTitle)) {
            errors.push("Key Issue / Issue is required.");
        }
        if (recordType === "RISK" && isBlank(data.riskStatement)) {
            errors.push("Risk Statement is required for a Risk record.");
        }
        if (recordType === "OPPORTUNITY" && isBlank(data.opportunityStatement)) {
            errors.push("Opportunity Statement is required for an Opportunity record.");
        }
        if (!constants.CONTEXT_TYPES.includes(String(data.contextType || "").toUpperCase())) {
            errors.push("Context Type is required.");
        }
        if (!constants.RISK_PROFILES.includes(String(data.riskProfile || "").toUpperCase())) {
            errors.push("Risk Profile is required.");
        }
        const objectiveTypes = Array.isArray(data.objectiveTypes)
            ? data.objectiveTypes.map((value) => String(value || "").toUpperCase())
            : [String(data.objectiveType || "").toUpperCase()].filter(Boolean);
        if (objectiveTypes.length === 0) {
            errors.push("Select at least one Affected Objective Type.");
        } else if (objectiveTypes.some((value) => !constants.OBJECTIVE_TYPES.includes(value))) {
            errors.push("One or more selected Affected Objective Types are invalid.");
        }
        if (isBlank(data.objectiveStatement)) {
            errors.push("Affected Objective is required and must be specific.");
        }
        if (isBlank(data.processCode) || isBlank(data.processName)) {
            errors.push("Responsible Process Code and Process Name are required.");
        }
        if (isBlank(data.riskOwner)) {
            errors.push("Risk Owner is required.");
        }
        if (isBlank(data.consultationSummary)) {
            errors.push("Consultation / Validation Summary is required.");
        }

        if (recordType === "RISK") {
            try {
                const rating = NEXUS_RRMS.Utilities.RiskRating.calculate(
                    data.initialLikelihood,
                    data.initialConsequence
                );
                if (Number(data.initialScore) !== rating.score || String(data.initialLevel || "") !== rating.level) {
                    errors.push("Risk Rating does not match Likelihood × Consequence.");
                }
            } catch (error) {
                errors.push(error.message);
            }
            if (isBlank(data.ratingBasis)) {
                errors.push("Initial Rating Basis is required for a Risk record.");
            }
        }

        return Object.freeze({ valid: errors.length === 0, errors });
    }

    return Object.freeze({ validate });
})();
