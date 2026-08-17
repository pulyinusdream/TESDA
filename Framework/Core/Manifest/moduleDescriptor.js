/**
 * ============================================================
 * TAESF Enterprise Framework
 * ------------------------------------------------------------
 * Module      : Module Descriptor
 * Version     : 1.0.0
 * Sprint      : S0.2.2
 * Description : Standard descriptor contract for TAESF modules.
 * ============================================================
 */

(function (global) {

    "use strict";

    global.TAESF = global.TAESF || {};
    global.TAESF.Core = global.TAESF.Core || {};

    class ModuleDescriptor {

        constructor(config = {}) {

            if (!config.id) {
                throw new Error("[TAESF] ModuleDescriptor requires an 'id'.");
            }

            if (!config.factory || typeof config.factory !== "function") {
                throw new Error("[TAESF] ModuleDescriptor requires a factory function.");
            }

            this.id = config.id;

            this.name = config.name || config.id;

            this.version = config.version || "1.0.0";

            this.description = config.description || "";

            this.factory = config.factory;

            this.dependencies = [...(config.dependencies || [])];

            this.permissions = [...(config.permissions || [])];

            this.services = [...(config.services || [])];

            this.routes = [...(config.routes || [])];

            this.autoStart = config.autoStart ?? true;

            this.enabled = config.enabled ?? true;

            this.priority = config.priority ?? 100;

            this.metadata = { ...(config.metadata || {}) };

            Object.freeze(this.dependencies);
            Object.freeze(this.permissions);
            Object.freeze(this.services);
            Object.freeze(this.routes);
            Object.freeze(this.metadata);

            Object.freeze(this);
        }

    }

    global.TAESF.Core.ModuleDescriptor =
        ModuleDescriptor;

})(window);