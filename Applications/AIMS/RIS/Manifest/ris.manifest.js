/**
 * ============================================================
 * TAESF Enterprise Framework
 * ------------------------------------------------------------
 * Application : AIMS
 * Manifest    : RIS
 * Version     : 1.0.0
 * ============================================================
 */

(function (global) {

    "use strict";

    const descriptor =
        new TAESF.Core.ModuleDescriptor({

            id: "ris",

            name: "Requisition and Issue Slip",

            version: "1.0.0",

            description:
                "AIMS Requisition and Issue Slip Module",

            factory: () =>
                new TAESF.Applications.AIMS.RISModule(),

            dependencies: [],

            permissions: [],

            services: [],

            routes: [],

            autoStart: false,

            enabled: true,

            priority: 100

        });

    TAESF.Core.ManifestRegistry.register(
        descriptor
    );

})(window);