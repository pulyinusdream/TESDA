"use strict";

/**
 * ==========================================================
 * TESDA Albay Enterprise Systems Framework (TAESF)
 * ----------------------------------------------------------
 * File        : registry.js
 * Module      : Enterprise Registry
 * Description : Central registry for Enterprise Services
 *               and Business Modules.
 *
 * Framework   : TAECP v1.0.0
 * ==========================================================
 */

TAESF.Core.Registry = (() => {

    /**
     * ------------------------------------------------------
     * Private Collections
     * ------------------------------------------------------
     */

    const services = new Map();

    const modules = new Map();

    /**
     * ------------------------------------------------------
     * Service Registration
     * ------------------------------------------------------
     */

    function registerService(name, instance) {

        if (services.has(name)) {

            throw new Error(
                `Service '${name}' is already registered.`
            );

        }

        services.set(name, instance);

    }

    function getService(name) {

        return services.get(name);

    }

    function hasService(name) {

        return services.has(name);

    }

    function listServices() {

        return Array.from(services.keys());

    }

    /**
     * ------------------------------------------------------
     * Module Registration
     * ------------------------------------------------------
     */

    function registerModule(name, instance) {

        if (modules.has(name)) {

            throw new Error(
                `Module '${name}' is already registered.`
            );

        }

        modules.set(name, instance);

    }

    function getModule(name) {

        return modules.get(name);

    }

    function hasModule(name) {

        return modules.has(name);

    }

    function listModules() {

        return Array.from(modules.keys());

    }

    /**
     * ------------------------------------------------------
     * Public API
     * ------------------------------------------------------
     */

    return Object.freeze({

        registerService,

        getService,

        hasService,

        listServices,

        registerModule,

        getModule,

        hasModule,

        listModules

    });

})();