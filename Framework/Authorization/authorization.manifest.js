/**
 * ============================================================
 * TAESF Authorization Manifest
 * RC-3 Sprint 3.0B.4
 * Manifest Version 2.0
 * ============================================================
 *
 * Module Metadata
 *
 * This file describes the Authorization Framework.
 *
 * It contains NO business logic.
 *
 * ============================================================
 */

const AuthorizationManifest = (function () {

    "use strict";

    const manifest = Object.freeze({

        /**
         * Module Identity
         */

        id: "Authorization",

        name: "Authorization Framework",

        version: "2.0.0",

        manifestVersion: "2.0",

        description:
            "Provides centralized authorization services and permission evaluation.",

        /**
         * Module Dependencies
         */

        dependencies: Object.freeze([

            "Authentication"

        ]),

        /**
         * Framework Components
         */

        constants: Object.freeze([

            "AuthorizationConstants"

        ]),

        services: Object.freeze([

            "AuthorizationMatrix",

            "PermissionService"

        ]),

        /**
         * Module Status
         */

        status: "ACTIVE"

    });

    return manifest;

})();