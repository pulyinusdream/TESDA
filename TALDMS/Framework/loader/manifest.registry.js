/**
 * ============================================================
 * TAESF Manifest Registry
 * ============================================================
 * Framework : TAESF
 * Component : Manifest Registry
 * Version   : 1.0.0
 *
 * Responsibility:
 *  - Register module manifests
 *  - Store module manifests
 *  - Retrieve module manifests
 *  - Remove module manifests
 *
 * This component DOES NOT:
 *  - Validate manifests
 *  - Load scripts
 *  - Initialize modules
 * ============================================================
 */

(function (window) {

    "use strict";

    window.TAESF = window.TAESF || {};
    TAESF.Loader = TAESF.Loader || {};

    const registry = new Map();

    TAESF.Loader.ManifestRegistry = {

        /**
         * Registers a manifest.
         * @param {Object} manifest
         * @returns {Object}
         */
        register(manifest) {

            if (!manifest) {
                throw new Error("Manifest is required.");
            }

            if (!manifest.id) {
                throw new Error("Manifest id is required.");
            }

            if (registry.has(manifest.id)) {
                throw new Error(
                    `Manifest '${manifest.id}' is already registered.`
                );
            }

            registry.set(manifest.id, manifest);

            if (TAESF.Logger?.info) {
                TAESF.Logger.info(
                    `Manifest registered: ${manifest.id}`
                );
            }

            return manifest;
        },

        /**
         * Removes a manifest.
         * @param {String} id
         * @returns {Boolean}
         */
        unregister(id) {

            const removed = registry.delete(id);

            if (removed && TAESF.Logger?.info) {
                TAESF.Logger.info(
                    `Manifest removed: ${id}`
                );
            }

            return removed;
        },

        /**
         * Returns a manifest.
         * @param {String} id
         * @returns {Object|null}
         */
        get(id) {

            return registry.get(id) || null;

        },

        /**
         * Returns all manifests.
         * @returns {Array}
         */
        getAll() {

            return Array.from(registry.values());

        },

        /**
         * Checks if a manifest exists.
         * @param {String} id
         * @returns {Boolean}
         */
        exists(id) {

            return registry.has(id);

        },

        /**
         * Returns number of registered manifests.
         * @returns {Number}
         */
        count() {

            return registry.size;

        },

        /**
         * Clears registry.
         */
        clear() {

            registry.clear();

            if (TAESF.Logger?.info) {
                TAESF.Logger.info(
                    "Manifest registry cleared."
                );
            }

        }

    };

})(window);