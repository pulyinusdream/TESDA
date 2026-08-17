"use strict";

NEXUS_RRMS.Modules.Risk.AuditService = (() => {
    const storageKey = NEXUS_RRMS.Configuration.Constants.STORAGE_KEYS.AUDIT_LOG;

    function record(eventType, entityId, details = {}) {
        const events = NEXUS_RRMS.Services.Storage.load(storageKey, []);
        const event = Object.freeze({
            auditLogId: NEXUS_RRMS.Utilities.Id.createEventId("AUD"),
            eventType,
            entityType: "rrro_risk_master",
            entityId,
            eventAt: NEXUS_RRMS.Utilities.Date.nowIso(),
            actor: "Local User",
            details
        });
        events.push(event);
        NEXUS_RRMS.Services.Storage.save(storageKey, events);
        return event;
    }

    function getAll() {
        return NEXUS_RRMS.Services.Storage.load(storageKey, []);
    }

    return Object.freeze({ record, getAll });
})();
