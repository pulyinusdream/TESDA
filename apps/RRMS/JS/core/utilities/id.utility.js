"use strict";

NEXUS_RRMS.Utilities.Id = (() => {
    function normalizeProcessCode(value) {
        return String(value || "GEN")
            .toUpperCase()
            .replace(/[^A-Z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "")
            .slice(0, 12) || "GEN";
    }

    function createRiskId(year, processCode, sequence) {
        const safeYear = Number(year);
        if (!Number.isInteger(safeYear) || safeYear < 2000 || safeYear > 2200) {
            throw new RangeError("A valid first-identified year is required.");
        }
        const safeSequence = String(sequence).padStart(4, "0");
        return `RR-ALBAY-${safeYear}-${normalizeProcessCode(processCode)}-${safeSequence}`;
    }

    function createEventId(prefix = "EVT") {
        const randomPart = Math.random().toString(36).slice(2, 10).toUpperCase();
        return `${prefix}-${Date.now()}-${randomPart}`;
    }

    return Object.freeze({ normalizeProcessCode, createRiskId, createEventId });
})();
