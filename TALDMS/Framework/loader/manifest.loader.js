/**
 * ============================================================
 * TAESF Manifest Loader
 * ============================================================
 * Responsibility
 *  - Validate Manifest Contract v1.0
 *  - Register manifest
 *
 * Does NOT:
 *  - Load dependencies
 *  - Load scripts
 *  - Initialize modules
 * ============================================================
 */

(function (window) {

    "use strict";

    window.TAESF = window.TAESF || {};
    TAESF.Loader = TAESF.Loader || {};

    TAESF.Loader.ManifestLoader = {

        /**
         * Validate Manifest Contract v1.0
         */
        validate(manifest) {

            if (!manifest)
                throw new Error("Manifest is required.");

            if (!manifest.schemaVersion)
                throw new Error("Missing schemaVersion.");

            if (!manifest.id)
                throw new Error("Missing module id.");

            if (!manifest.name)
                throw new Error("Missing module name.");

            if (!manifest.version)
                throw new Error("Missing version.");

            if (!manifest.controller)
                throw new Error("Missing controller.");

            if (!Array.isArray(manifest.dependencies))
                throw new Error("Dependencies must be an array.");

            if (!Array.isArray(manifest.routes))
                throw new Error("Routes must be an array.");

            if (!Array.isArray(manifest.permissions))
                throw new Error("Permissions must be an array.");

            if (!manifest.menu)
                throw new Error("Missing menu.");

            return true;

        },

        /**
         * Loads a manifest.
         */
        load(manifest) {

            this.validate(manifest);

            TAESF.Loader.ManifestRegistry.register(manifest);

            if (TAESF.Logger?.info) {

                TAESF.Logger.info(
                    `Manifest loaded: ${manifest.id}`
                );

            }

            return manifest;

        }

    };

})(window);