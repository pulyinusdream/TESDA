/**
 * ============================================================
 * TAESF Enterprise Framework
 * ------------------------------------------------------------
 * Module      : Manifest Registry
 * Version     : 1.0.0
 * Sprint      : S0.2.1
 * Description : Registry of TAESF module descriptors.
 * ============================================================
 */

(function (global) {

    "use strict";

    global.TAESF = global.TAESF || {};
    global.TAESF.Core = global.TAESF.Core || {};

    class ManifestRegistry {

        constructor() {

            this.descriptors = new Map();

        }

        register(descriptor) {

            if (!(descriptor instanceof global.TAESF.Core.ModuleDescriptor)) {

                throw new Error(
                    "[TAESF] Only ModuleDescriptor instances can be registered."
                );

            }

            if (this.descriptors.has(descriptor.id)) {

                console.warn(
                    `[TAESF] Descriptor '${descriptor.id}' already exists.`
                );

                return false;

            }

            // Store the descriptor
            this.descriptors.set(
                descriptor.id,
                descriptor
            );

            TAESF.Core.Logger.info(
                `Registered descriptor '${descriptor.id}'.`
            );

            return true;

        }

        unregister(id) {

            return this.descriptors.delete(id);

        }

        has(id) {

            return this.descriptors.has(id);

        }

        get(id) {

            return this.descriptors.get(id) || null;

        }

        getAll() {

            return Array.from(
                this.descriptors.values()
            );

        }

        getEnabled() {

            return this.getAll()
                .filter(d => d.enabled);

        }

        getAutoStart() {

            return this.getEnabled()
                .filter(d => d.autoStart);

        }

        getSorted() {

            return this.getAll()
                .sort(
                    (a, b) =>
                        a.priority - b.priority
                );

        }

        clear() {

            this.descriptors.clear();

        }

        size() {

            return this.descriptors.size;

        }

    }

    global.TAESF.Core.ManifestRegistry =
        new ManifestRegistry();

})(window);