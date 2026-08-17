"use strict";

/**
 * ==========================================================
 * TESDA Albay Enterprise Systems Framework (TAESF)
 * ----------------------------------------------------------
 * File        : app.js
 * Module      : Application Manager
 * Description : Controls the Enterprise Application Lifecycle.
 *
 * Framework   : TAECP v1.0.0
 * ==========================================================
 */

TAESF.Core.Application = (() => {

    /**
     * ------------------------------------------------------
     * Private State
     * ------------------------------------------------------
     */

    let currentState = "CREATED";

    /**
     * ------------------------------------------------------
     * Lifecycle Methods
     * ------------------------------------------------------
     */

    function initialize() {

    currentState = "INITIALIZED";

    console.info(

        "[TAECP] Application initialized."

    );

    const app =

        document.getElementById(

            "app"

        );

    if (!app) {

        console.error(

            "[TAECP] Application container not found."

        );

        return;

    }

    app.innerHTML =

        TAESF.UI.ApplicationLayout.render();

    const workspace =

        document.getElementById(

            "applicationWorkspace"

        );

    if (!workspace) {

        console.error(

            "[TAECP] Workspace initialization failed."

        );

        return;

    }

    console.info(

    "[TAECP] Workspace initialized."

    );

    /**
     * ------------------------------------------------------
     * Temporary Development Startup
     * Remove after Module Loader is implemented.
     * ------------------------------------------------------
     */
        const samplePlan = {

        wdpNumber:

            "WDP-2025-2027-000001",

        planningCycle:

            "2025-2027",

        office:

            "TESDA Albay Provincial Office",

        preparedBy:

            "Laurence R. Arimado",

        approvedBy:

            "MARIGLO L. MACABUHAY-SESE, CESE",

        status:

            "Draft"

    };

    TAESF.Core.Workspace.load(

        TAESF.Modules.Workforce.WDP.Views.Workspace.render(

            samplePlan

        )

    );

    setCurrentPlan(

        samplePlan

    );

    initializeWorkspace();
    }

    function validate() {

        currentState = "VALIDATED";

        console.info("[TAECP] Configuration validated.");

    }

    function configure() {

        currentState = "CONFIGURED";

        console.info("[TAECP] Application configured.");

    }

    function start() {

        currentState = "STARTED";

        console.info("[TAECP] Application started.");

    }

    function ready() {

        currentState = "READY";

        console.info("[TAECP] Application is ready.");

    }

    function shutdown() {

        currentState = "STOPPED";

        console.info("[TAECP] Application stopped.");

    }

    /**
     * ------------------------------------------------------
     * State
     * ------------------------------------------------------
     */

    function getState() {

        return currentState;

    }

    /**
     * ------------------------------------------------------
     * Public API
     * ------------------------------------------------------
     */

    return Object.freeze({

        initialize,

        validate,

        configure,

        start,

        ready,

        shutdown,

        getState

    });

})();