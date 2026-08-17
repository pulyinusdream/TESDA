/**
 * ============================================================
 * TAESF Enterprise Framework
 * ------------------------------------------------------------
 * Module      : Configuration Service
 * Version     : 1.0.0
 * Sprint      : S0.2.0
 * Description : Central configuration provider for TAESF.
 * ============================================================
 */

(function (global) {

    "use strict";

    global.TAESF = global.TAESF || {};
    global.TAESF.Core = global.TAESF.Core || {};

    const configuration = {

        application: {

            name: "TAESF",

            version: "1.0.0",

            environment: "development"

        },

        logging: {

            enabled: true,

            level: "INFO"

        },

        features: {

            debug: true,

            autoDiscoverModules: true,

            cloudSynchronization: false

        },

        api: {

            timeout: 30000,

            baseUrl: ""

        }

    };

    const ConfigurationService = {

        get(path, defaultValue = null) {

            if (!path) {

                return configuration;

            }

            const value = path
                .split(".")
                .reduce((obj, key) => obj?.[key], configuration);

            return value !== undefined
                ? value
                : defaultValue;

        },

        set(path, value) {

            if (!path) {

                return false;

            }

            const keys = path.split(".");

            let target = configuration;

            while (keys.length > 1) {

                const key = keys.shift();

                if (!(key in target)) {

                    target[key] = {};

                }

                target = target[key];

            }

            target[keys[0]] = value;

            return true;

        },

        has(path) {

            return this.get(path) !== null;

        },

        getAll() {

            return structuredClone(configuration);

        }

    };

    Object.freeze(ConfigurationService);

    global.TAESF.Core.ConfigurationService =
        ConfigurationService;

})(window);