"use strict";

/**
 * ==========================================================
 * TESDA Albay Enterprise Systems Framework (TAESF)
 * ----------------------------------------------------------
 * File        : configuration.service.js
 * Module      : Enterprise Core Services
 * Description : Provides centralized access to all
 *               configuration resources.
 *
 * Version     : 1.0.0
 * ==========================================================
 */

TAESF.Services.Configuration = (() => {

    /**
     * Returns application version information.
     */
    function getVersion() {
        return TAESF.Configuration.Version;
    }

    /**
     * Returns application settings.
     */
    function getSettings() {
        return TAESF.Configuration.Settings;
    }

    /**
     * Returns technical constants.
     */
    function getConstants() {
        return TAESF.Configuration.Constants;
    }

    /**
     * Returns business policies.
     */
    function getPolicy() {
        return TAESF.Configuration.Policy;
    }

    /**
     * Returns feature flags.
     */
    function getFeatures() {
        return TAESF.Configuration.Features;
    }

    /**
     * Returns runtime environment.
     */
    function getEnvironment() {
        return TAESF.Configuration.Environment;
    }

    /**
     * Returns application routes.
     */
    function getRoutes() {
        return TAESF.Configuration.Routes;
    }

    /**
     * Returns TRUE if a feature is enabled.
     */
    function isFeatureEnabled(featureName) {

        const features = getFeatures();

        if (!(featureName in features)) {
            return false;
        }

        return features[featureName] === true;

    }

    /**
     * Returns the active application mode.
     */
    function getApplicationMode() {
        return getEnvironment().mode;
    }

    /**
     * Determines whether the application
     * is running in Development mode.
     */
    function isDevelopment() {

        return getApplicationMode() === "DEVELOPMENT";

    }

    /**
     * Determines whether the application
     * is running in Production mode.
     */
    function isProduction() {

        return getApplicationMode() === "PRODUCTION";

    }

    /**
     * Public API
     */
    return Object.freeze({

        getVersion,

        getSettings,

        getConstants,

        getPolicy,

        getFeatures,

        getEnvironment,

        getRoutes,

        isFeatureEnabled,

        getApplicationMode,

        isDevelopment,

        isProduction

    });

})();