"use strict";

NEXUS_RRMS.Utilities.RiskRating = (() => {
    function validateComponent(value, fieldName) {
        const numericValue = Number(value);
        if (!Number.isInteger(numericValue) || numericValue < 1 || numericValue > 4) {
            throw new RangeError(`${fieldName} must be an integer from 1 to 4.`);
        }
        return numericValue;
    }

    function getLevel(score) {
        if ([1, 2, 3].includes(score)) return "LOW";
        if ([4, 6].includes(score)) return "MEDIUM";
        if ([8, 9].includes(score)) return "HIGH";
        if ([12, 16].includes(score)) return "VERY_HIGH";
        throw new RangeError("The computed risk score is not supported by the RRRO matrix.");
    }

    function calculate(likelihood, consequence) {
        const safeLikelihood = validateComponent(likelihood, "Likelihood");
        const safeConsequence = validateComponent(consequence, "Consequence");
        const score = safeLikelihood * safeConsequence;
        return Object.freeze({
            likelihood: safeLikelihood,
            consequence: safeConsequence,
            score,
            level: getLevel(score)
        });
    }

    return Object.freeze({ calculate, getLevel });
})();
