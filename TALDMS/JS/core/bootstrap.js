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

    /**
     * Register Enterprise Services
     */
    TAESF.Core.Registry.registerService(
        "Configuration",
        TAESF.Services.Configuration
    );

    TAESF.Core.Registry.registerService(
        "Logger",
        TAESF.Services.Logger
    );
    TAESF.Core.Registry.registerService(
    "Storage",
    TAESF.Services.Storage
    );
    TAESF.Core.Registry.registerService(
    "Session",
    TAESF.Services.Session
    );

    TAESF.Core.Registry.registerService(
        "Authentication",
        TAESF.Services.Authentication
    );
    
    console.info("Step 5 : Ready");
    TAESF.Core.Application.ready();

    TAESF.Services.Logger.info(
        "Enterprise Framework successfully started."
    );

    console.groupEnd();

}

    return Object.freeze({

        run
});        
})();