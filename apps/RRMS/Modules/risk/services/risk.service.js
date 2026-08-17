"use strict";

NEXUS_RRMS.Modules.Risk.Service = (() => {
    const repository = NEXUS_RRMS.Modules.Risk.Repository;
    const validator = NEXUS_RRMS.Modules.Risk.Validator;
    const model = NEXUS_RRMS.Modules.Risk.Model;

    function prepareData(input) {
        const recordType = String(input.recordType || "RISK").toUpperCase();
        let rating = { score: null, level: null };
        if (recordType === "RISK") {
            rating = NEXUS_RRMS.Utilities.RiskRating.calculate(
                input.initialLikelihood,
                input.initialConsequence
            );
        }
        return {
            ...input,
            recordType,
            firstIdentifiedYear: NEXUS_RRMS.Utilities.Date.yearOf(input.firstIdentifiedDate),
            initialScore: rating.score,
            initialLevel: rating.level
        };
    }

    function create(input) {
        let prepared;
        try {
            prepared = prepareData(input);
        } catch (error) {
            return { success: false, errors: [error.message] };
        }

        const sequence = repository.getNextSequence(prepared.firstIdentifiedYear, prepared.processCode);
        prepared.riskId = NEXUS_RRMS.Utilities.Id.createRiskId(
            prepared.firstIdentifiedYear,
            prepared.processCode,
            sequence
        );

        const candidate = model.create(prepared);
        const validation = validator.validate(candidate);
        if (!validation.valid) {
            return { success: false, errors: validation.errors };
        }

        const saved = repository.add(candidate);
        NEXUS_RRMS.Modules.Risk.AuditService.record("CREATE", saved.riskId, { after: saved });
        return { success: true, record: saved };
    }

    function update(riskId, input) {
        const existing = repository.getById(riskId);
        if (!existing) {
            return { success: false, errors: ["Risk record was not found."] };
        }

        let prepared;
        try {
            prepared = prepareData({ ...existing, ...input });
        } catch (error) {
            return { success: false, errors: [error.message] };
        }

        const candidate = model.cloneForUpdate(existing, prepared);
        const validation = validator.validate(candidate);
        if (!validation.valid) {
            return { success: false, errors: validation.errors };
        }

        const saved = repository.update(candidate);
        NEXUS_RRMS.Modules.Risk.AuditService.record("UPDATE", saved.riskId, {
            before: existing,
            after: saved
        });
        return { success: true, record: saved };
    }

    function removeDraft(riskId) {
        try {
            const existing = repository.getById(riskId);
            const removed = repository.removeDraft(riskId);
            if (removed) {
                NEXUS_RRMS.Modules.Risk.AuditService.record("DELETE_DRAFT", riskId, { before: existing });
            }
            return { success: removed, errors: removed ? [] : ["Risk record was not found."] };
        } catch (error) {
            return { success: false, errors: [error.message] };
        }
    }

    function getAll() {
        return repository.getAll().slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    function getById(riskId) {
        return repository.getById(riskId);
    }

    function getDashboardSummary() {
        const records = getAll();
        return {
            total: records.length,
            risks: records.filter((item) => item.recordType === "RISK").length,
            opportunities: records.filter((item) => item.recordType === "OPPORTUNITY").length,
            topPrioritized: records.filter((item) => item.currentClassification === "TOP_PRIORITIZED").length,
            archiveMonitoring: records.filter((item) => item.currentClassification === "ARCHIVE_MONITORING").length,
            highAndVeryHigh: records.filter((item) => ["HIGH", "VERY_HIGH"].includes(item.initialLevel)).length
        };
    }

    return Object.freeze({ create, update, removeDraft, getAll, getById, getDashboardSummary });
})();
