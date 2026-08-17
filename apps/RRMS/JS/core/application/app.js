"use strict";

NEXUS_RRMS.Core.Application = (() => {
    function initialize() {
        document.documentElement.dataset.rrmsVersion = NEXUS_RRMS.Configuration.Settings.VERSION;
        updateHeaderMetadata();
        NEXUS_RRMS.Modules.Risk.Controller.initialize();
        NEXUS_RRMS.State.ready = true;
        console.info("NEXUS-RRMS initialized", NEXUS_RRMS.Configuration.Settings.VERSION);
    }

    function updateHeaderMetadata() {
        document.getElementById("appVersion").textContent = `v${NEXUS_RRMS.Configuration.Settings.VERSION}`;
        document.getElementById("formCode").textContent = `${NEXUS_RRMS.Configuration.Settings.FORM_CODE} · ${NEXUS_RRMS.Configuration.Settings.FORM_REVISION}`;
        document.getElementById("currentYear").textContent = NEXUS_RRMS.Configuration.Settings.CURRENT_YEAR;
    }

    return Object.freeze({ initialize });
})();
