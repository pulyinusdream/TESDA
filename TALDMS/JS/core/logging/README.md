"use strict";

/**
 * ==========================================================
 * TESDA Albay Enterprise Systems Framework (TAESF)
 * ----------------------------------------------------------
 * File        : bootstrap.js
 * Module      : Enterprise Bootstrap
 * Description : Starts the Enterprise Framework.
 *
 * Framework   : TAECP v1.0.0
 * ==========================================================
 */

TAESF.Core.Bootstrap = (() => {

    /**
     * Starts the Enterprise Framework.
     */
    function run() {

        console.group("TAECP Framework Startup");

        console.info("Step 1 : Initialize");
        TAESF.Core.Application.initialize();

        console.info("Step 2 : Validate");
        TAESF.Core.Application.validate();

        console.info("Step 3 : Configure");
        TAESF.Core.Application.configure();

        console.info("Step 4 : Start");
        TAESF.Core.Application.start();

        console.info("Step 5 : Ready");
        TAESF.Core.Application.ready();

        console.groupEnd();

    }

    return Object.freeze({

        run

    });

})();