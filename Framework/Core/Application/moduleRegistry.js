/**
 * ============================================================
 * TAESF Enterprise Framework
 * ------------------------------------------------------------
 * Module      : Module Registry
 * Version     : 1.0.0
 * Sprint      : S0.1.1
 * Description : Central registry for TAESF modules.
 * ============================================================
 */

(function (global) {

    "use strict";

    global.TAESF = global.TAESF || {};
    global.TAESF.Application = global.TAESF.Application || {};

    class ModuleRegistry {

        constructor() {

            this.modules = new Map();

        }

        register(module) {

            if (!(module instanceof global.TAESF.Application.BaseModule)) {

                throw new Error(
                    "[TAESF] Only BaseModule instances can be registered."
                );

            }

            const id = module.getId();

            if (this.modules.has(id)) {

                console.warn(
                    `[TAESF] Module '${id}' is already registered.`
                );

                return false;

            }

            this.modules.set(id, module);

            console.log(
                `[TAESF] Registered module '${id}'.`
            );

            return true;

        }

        unregister(id) {

            return this.modules.delete(id);

        }

        get(id) {

            return this.modules.get(id) || null;

        }

        has(id) {

            return this.modules.has(id);

        }

        getAll() {

            return Array.from(this.modules.values());

        }

        initializeAll() {

            this.modules.forEach(module => {

                if (!module.isInitialized()) {

                    module.initialize();

                }

            });

        }

        refreshAll() {

            this.modules.forEach(module => {

                if (module.isEnabled()) {

                    module.refresh();

                }

            });

        }

        destroyAll() {

            this.modules.forEach(module => {

                module.destroy();

            });

        }

        clear() {

            this.modules.clear();

        }

        size() {

            return this.modules.size;

        }

    }

    global.TAESF.Application.ModuleRegistry = new ModuleRegistry();

})(window);