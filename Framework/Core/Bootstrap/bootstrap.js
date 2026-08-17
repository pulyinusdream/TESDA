/**
 * ============================================================
 * TAESF Enterprise Framework
 * ------------------------------------------------------------
 * Module      : Bootstrap
 * Version     : 1.0.0
 * Sprint      : S0.2.1
 * Description : Starts the TAESF application.
 * ============================================================
 */

(function (global) {

    "use strict";

    global.TAESF = global.TAESF || {};

    function bootstrap() {

        TAESF.Core.Logger.info(
            "[BOOTSTRAP] Starting TAESF..."
        );

        // ----------------------------------------
        // Register RIS Module
        // ----------------------------------------

        const risModule =
            new TAESF.Applications
                .AIMS
                .RISModule();

        TAESF.Application
            .ModuleRegistry
            .register(risModule);

        // ----------------------------------------
        // Start Application Lifecycle
        // ----------------------------------------

        TAESF.Application
            .ApplicationLifecycle
            .start();

        TAESF.Core.Logger.info(
            "[BOOTSTRAP] Completed."
        );

    }

    bootstrap();

})(window);