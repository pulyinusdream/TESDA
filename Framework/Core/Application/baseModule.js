/**
 * ============================================================
 * TAESF Enterprise Framework
 * ------------------------------------------------------------
 * Module      : Base Module
 * Version     : 1.1.0
 * Sprint      : S0.1.1
 * Description : Base class for every TAESF application module.
 * ============================================================
 */

(function (global) {

    "use strict";

    global.TAESF = global.TAESF || {};
    global.TAESF.Application = global.TAESF.Application || {};

    class BaseModule {

        constructor(config = {}) {

            this.id = config.id || "unknown";

            this.name = config.name || "Unnamed Module";

            this.version = config.version || "1.0.0";

            this.dependencies = Array.isArray(config.dependencies)
                ? [...config.dependencies]
                : [];

            this.initialized = false;

            this.enabled = true;
        }

        initialize() {

            if (this.initialized) {

                console.warn(
                    `[TAESF] ${this.id} is already initialized.`
                );

                return;
            }

            this.initialized = true;

            console.log(
                `[TAESF] Initializing ${this.name}`
            );
        }

        load() {

            console.log(
                `[TAESF] Loading ${this.name}`
            );
        }

        render() {

            console.log(
                `[TAESF] Rendering ${this.name}`
            );
        }

        refresh() {

            console.log(
                `[TAESF] Refreshing ${this.name}`
            );
        }

        destroy() {

            this.initialized = false;

            console.log(
                `[TAESF] Destroying ${this.name}`
            );
        }

        enable() {

            this.enabled = true;
        }

        disable() {

            this.enabled = false;
        }

        isEnabled() {

            return this.enabled;
        }

        isInitialized() {

            return this.initialized;
        }

        getId() {

            return this.id;
        }

        getName() {

            return this.name;
        }

        getVersion() {

            return this.version;
        }

        getDependencies() {

            return [...this.dependencies];
        }

        hasDependency(moduleId) {

            return this.dependencies.includes(moduleId);
        }

    }

    global.TAESF.Application.BaseModule = BaseModule;

})(window);