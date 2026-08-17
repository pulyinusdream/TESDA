/**
 * ============================================================
 * TAESF Enterprise Framework
 * ------------------------------------------------------------
 * Module      : Application Constants
 * Version     : 1.0.0
 * Sprint      : S0.1.1
 * Description : Defines application lifecycle states.
 * ============================================================
 */

(function (global) {

    "use strict";

    global.TAESF = global.TAESF || {};

    global.TAESF.Application =
        global.TAESF.Application || {};

    const ApplicationConstants = Object.freeze({

        VERSION: "1.0.0",

        STATES: Object.freeze({

            CREATED: "CREATED",

            BOOTSTRAPPED: "BOOTSTRAPPED",

            AUTHENTICATED: "AUTHENTICATED",

            INITIALIZED: "INITIALIZED",

            READY: "READY",

            REFRESHING: "REFRESHING",

            STOPPED: "STOPPED",

            ERROR: "ERROR"

        })

    });

    global.TAESF.Application.Constants =
        ApplicationConstants;

})(window);