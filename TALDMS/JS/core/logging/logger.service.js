"use strict";

/**
 * ==========================================================
 * TESDA Albay Enterprise Systems Framework (TAESF)
 * ----------------------------------------------------------
 * File        : logger.service.js
 * Module      : Enterprise Logger Service
 * Description : Centralized logging service.
 *
 * Framework   : TAECP v1.0.0
 * ==========================================================
 */

TAESF.Services.Logger = (() => {

    function info(message) {

        console.info(`[INFO] ${message}`);

    }

    function warn(message) {

        console.warn(`[WARNING] ${message}`);

    }

    function error(message) {

        console.error(`[ERROR] ${message}`);

    }

    function debug(message) {

        if (
            TAESF.Services.Configuration.isDevelopment()
        ) {

            console.debug(`[DEBUG] ${message}`);

        }

    }

    /**
     * Reserved for future Audit Trail integration.
     */
    function audit(message) {

        console.info(`[AUDIT] ${message}`);

    }

    return Object.freeze({

        info,

        warn,

        error,

        debug,

        audit

    });

})();