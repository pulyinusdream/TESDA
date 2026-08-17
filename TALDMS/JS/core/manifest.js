"use strict";

/**
 * ==========================================================
 * TESDA Albay Enterprise Systems Framework (TAESF)
 * ----------------------------------------------------------
 * File        : manifest.js
 * Module      : Enterprise Core
 * Description : Enterprise Application Manifest
 *
 * The Manifest describes the application and its
 * required enterprise resources.
 *
 * Version     : 1.0.0
 * ==========================================================
 */

TAESF.Core.Manifest = Object.freeze({

    /**
     * ======================================================
     * Application Information
     * ======================================================
     */
    application: Object.freeze({

        code: TAESF.Configuration.Version.appCode,

        name: TAESF.Configuration.Version.appName,

        version: TAESF.Configuration.Version.version,

        build: TAESF.Configuration.Version.buildNumber

    }),

    /**
     * ======================================================
     * Required Configuration
     * ======================================================
     */
    configuration: Object.freeze([

        "Version",

        "Settings",

        "Constants",

        "Policy",

        "Features",

        "Environment",

        "Routes"

    ]),

    /**
     * ======================================================
     * Required Enterprise Services
     * ======================================================
     */
    services: Object.freeze([

        "Configuration"

    ]),

    /**
     * ======================================================
     * Registered Business Modules
     * ======================================================
     */
    modules: Object.freeze([

        "Dashboard",

        "Employee",

        "Learning",

        "Workforce",

        "Compliance",

        "Knowledge",

        "Reports",

        "Analytics",

        "Administration",

        "Executive"

    ]),

    /**
     * ======================================================
     * Application Startup Sequence
     * ======================================================
     */
    startup: Object.freeze([

        "Configuration",

        "Application",

        "Authentication",

        "Dashboard"

    ])

});