"use strict";

NEXUS_RRMS.Modules.Risk.Repository = (() => {
    const storageKey = NEXUS_RRMS.Configuration.Constants.STORAGE_KEYS.RISK_MASTER;

    function normalizeObjectiveTypes(record) {
        if (Array.isArray(record.objectiveTypes)) {
            return record;
        }
        const legacyValue = String(record.objectiveType || "").trim().toUpperCase();
        return {
            ...record,
            objectiveTypes: legacyValue ? [legacyValue] : []
        };
    }

    function getAll() {
        const records = NEXUS_RRMS.Services.Storage.load(storageKey, []);
        return Array.isArray(records) ? records.map(normalizeObjectiveTypes) : [];
    }

    function saveAll(records) {
        NEXUS_RRMS.Services.Storage.save(storageKey, records);
    }

    function getById(riskId) {
        return getAll().find((record) => record.riskId === riskId) || null;
    }

    function getNextSequence(year, processCode) {
        const prefix = `RR-ALBAY-${year}-${NEXUS_RRMS.Utilities.Id.normalizeProcessCode(processCode)}-`;
        const sequences = getAll()
            .filter((record) => record.riskId.startsWith(prefix))
            .map((record) => Number(record.riskId.slice(prefix.length)))
            .filter(Number.isFinite);
        return sequences.length === 0 ? 1 : Math.max(...sequences) + 1;
    }

    function add(record) {
        if (getById(record.riskId)) {
            throw new Error(`Risk ID ${record.riskId} already exists.`);
        }
        const records = getAll();
        records.push(record);
        saveAll(records);
        return record;
    }

    function update(record) {
        const records = getAll();
        const index = records.findIndex((item) => item.riskId === record.riskId);
        if (index < 0) {
            throw new Error("Risk record was not found.");
        }
        records[index] = record;
        saveAll(records);
        return record;
    }

    function removeDraft(riskId) {
        const existing = getById(riskId);
        if (!existing) return false;
        if (existing.currentStatus !== "DRAFT") {
            throw new Error("Only unsubmitted Draft records may be removed in this implementation block.");
        }
        saveAll(getAll().filter((record) => record.riskId !== riskId));
        return true;
    }

    return Object.freeze({ getAll, getById, getNextSequence, add, update, removeDraft });
})();
