/**
 * ============================================================
 * TAESF Enterprise Framework
 * ------------------------------------------------------------
 * Module      : Application Lifecycle
 * Version     : 1.1.0
 * Sprint      : Production Stabilization P1.2A
 * Description : Controls the TAESF application lifecycle and
 *               prevents duplicate initialization.
 * ============================================================
 */

(function (global) {

    "use strict";

    
    global.TAESF =
        global.TAESF || {};

    global.TAESF.Application =
        global.TAESF.Application || {};

    const STATES =
        global.TAESF.Application
            .Constants
            .STATES;


    class ApplicationLifecycle {

        constructor() {

            this.state =
                STATES.CREATED;

            /*
             * Prevents ModuleRegistry.initializeAll() from
             * running more than once during one application
             * session.
             */
            this.started =
                false;

            /*
             * Prevents overlapping startup requests.
             */
            this.starting =
                false;

        }


        /**
         * Marks the framework as bootstrapped.
         */
        bootstrap() {

            if (
                this.state ===
                    STATES.BOOTSTRAPPED ||
                this.state ===
                    STATES.INITIALIZED ||
                this.state ===
                    STATES.READY
            ) {

                return;

            }

            this.state =
                STATES.BOOTSTRAPPED;

            console.log(
                "[TAESF] Application bootstrapped."
            );

        }


        /**
         * Marks the lifecycle as authenticated.
         */
        authenticate() {

            this.state =
                STATES.AUTHENTICATED;

            console.log(
                "[TAESF] Application authenticated."
            );

        }


        /**
         * Initializes all registered modules once.
         */
        initialize() {

            if (
                this.started ===
                    true
            ) {

                console.log(
                    "[TAESF] Module initialization skipped; " +
                    "application is already started."
                );

                return false;

            }

            global.TAESF.Application
                .ModuleRegistry
                .initializeAll();

            this.state =
                STATES.INITIALIZED;

            console.log(
                "[TAESF] Application initialized."
            );

            return true;

        }


        /**
         * Starts the application once.
         *
         * @returns {boolean}
         */
        start() {

            if (
                this.started ===
                    true
            ) {

                console.log(
                    "[TAESF] Startup skipped; " +
                    "application is already ready."
                );

                return false;

            }

            if (
                this.starting ===
                    true
            ) {

                console.log(
                    "[TAESF] Startup skipped; " +
                    "application startup is already in progress."
                );

                return false;

            }

            this.starting =
                true;

            try {

                this.bootstrap();

                const initialized =
                    this.initialize();

                if (
                    initialized !==
                        true
                ) {

                    return false;

                }

                this.started =
                    true;

                this.state =
                    STATES.READY;

                console.log(
                    "[TAESF] Application ready."
                );

                return true;

            } finally {

                this.starting =
                    false;

            }

        }


        /**
         * Refreshes all initialized modules.
         *
         * @returns {boolean}
         */
        refresh() {

            if (
                this.started !==
                    true
            ) {

                console.warn(
                    "[TAESF] Refresh skipped; " +
                    "application has not started."
                );

                return false;

            }

            this.state =
                STATES.REFRESHING;

            global.TAESF.Application
                .ModuleRegistry
                .refreshAll();

            this.state =
                STATES.READY;

            console.log(
                "[TAESF] Application refreshed."
            );

            return true;

        }


        /**
         * Stops and destroys initialized modules.
         *
         * @returns {boolean}
         */
        shutdown() {

            if (
                this.started !==
                    true
            ) {

                this.state =
                    STATES.STOPPED;

                return false;

            }

            global.TAESF.Application
                .ModuleRegistry
                .destroyAll();

            this.started =
                false;

            this.starting =
                false;

            this.state =
                STATES.STOPPED;

            console.log(
                "[TAESF] Application stopped."
            );

            return true;

        }


        /**
         * Returns the current lifecycle state.
         *
         * @returns {string}
         */
        getState() {

            return this.state;

        }


        /**
         * Returns whether startup completed.
         *
         * @returns {boolean}
         */
        isStarted() {

            return (
                this.started ===
                true
            );

        }


        /**
         * Returns whether startup is currently running.
         *
         * @returns {boolean}
         */
        isStarting() {

            return (
                this.starting ===
                true
            );

        }

    }


    global.TAESF.Application
        .ApplicationLifecycle =
            new ApplicationLifecycle();

})(window);