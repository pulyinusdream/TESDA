/**
 * ==========================================================
 * TAESF Framework
 * Inventory Migration Service
 * Version: 11.2.0-alpha
 * ==========================================================
 *
 * Frontend gateway for the Inventory Ledger Version 11
 * migration process.
 *
 * Responsibilities:
 * - Request validation of legacy Transactions records
 * - Execute controlled migration import batches
 * - Retrieve the current migration state
 * - Normalize frontend options
 * - Return standard BaseBusinessService responses
 *
 *  This service does not:
 * - Write directly to spreadsheets
 * - Read spreadsheets directly
 * - Rebuild inventory balances
 * ==========================================================
 */

const InventoryMigrationService = (() => {

    /**
     * Backend migration command registry.
     */
    const ACTIONS = Object.freeze({

        VALIDATE:
            "inventory.migration.validate",

        IMPORT:
            "inventory.migration.import",

        GET_STATE:
            "inventory.migration.getState"

    });


    /**
     * Validates legacy inventory transactions.
     *
     * Validation only:
     * no InventoryLedger records are created.
     *
     * @param {Object} options
     * @returns {Promise<Object>}
     */
    async function validate(
        options = {}
    ) {

        const payload =
            normalizeValidationOptions(
                options
            );

        return BaseBusinessService.execute(
            ACTIONS.VALIDATE,
            payload
        );

    }
    /**
     * Executes one or more controlled migration batches.
     *
     * The backend determines whether the migration pauses,
     * resumes, or completes.
     *
     * By default, one batch of 100 valid transactions is
     * processed per request.
     *
     * @param {Object} options
     * @returns {Promise<Object>}
     */
    async function importBatch(
        options = {}
    ) {

        const payload =
            normalizeImportOptions(
                options
            );

        return BaseBusinessService.execute(
            ACTIONS.IMPORT,
            payload
        );

    }

    /**
     * Returns the current Inventory Ledger migration state.
     *
     * @returns {Promise<Object>}
     */
    async function getState() {

        return BaseBusinessService.execute(
            ACTIONS.GET_STATE,
            {}
        );

    }


    /**
     * Returns true when the standard business response
     * indicates a successful backend operation.
     *
     * @param {*} response
     * @returns {boolean}
     */
    function isSuccessful(response) {

        return Boolean(
            response &&
            response.success === true &&
            response.backendReachable === true
        );

    }


    /**
     * Returns the backend data portion of a standard
     * BaseBusinessService response.
     *
     * @param {*} response
     * @returns {*}
     */
    function unwrap(response) {

        if (!isSuccessful(response)) {

            throw new Error(
                response &&
                response.message
                    ? response.message
                    : "Inventory migration operation failed."
            );

        }

        return response.data;

    }


    /**
     * Returns true when the migration state is completed.
     *
     * @param {*} state
     * @returns {boolean}
     */
    function isCompleted(state) {

        return Boolean(
            state &&
            (
                state.status ===
                    "COMPLETED" ||
                state.status ===
                    "COMPLETED_WITH_ERRORS"
            )
        );

    }


    /**
     * Returns true when migration validation has completed
     * and the migration is ready for import.
     *
     * @param {*} state
     * @returns {boolean}
     */
    function isReady(state) {

        return Boolean(
            state &&
            state.status === "READY"
        );

    }


    /**
     * Returns true when a migration is currently active.
     *
     * @param {*} state
     * @returns {boolean}
     */
    function isRunning(state) {

        return Boolean(
            state &&
            state.status === "RUNNING"
        );

    }
    /**
         * Returns true when migration processing has paused and may
         * be continued safely.
         *
         * @param {*} state
         * @returns {boolean}
         */
        function isPaused(state) {

            return Boolean(
                state &&
                state.status === "PAUSED"
            );

        }


    /**
     * Normalizes migration validation options.
     *
     * @param {*} options
     * @returns {Object}
     */
    function normalizeValidationOptions(
        options
    ) {

        if (
            options === null ||
            options === undefined
        ) {
            options = {};
        }

        if (
            typeof options !== "object" ||
            Array.isArray(options)
        ) {
            throw new Error(
                "Migration validation options must be an object."
            );
        }

        const normalized = {

            updatedBy:
                normalizeOptionalText(
                    options.updatedBy
                ) || "SYSTEM",

            batchSize:
                normalizePositiveInteger(
                    options.batchSize !== undefined
                        ? options.batchSize
                        : 100,
                    "Batch size"
                ),

            allowMissingDate:
                options.allowMissingDate === true,

            allowMissingIssueCost:
                options.allowMissingIssueCost === true,

            recalculateTotals:
                options.recalculateTotals !== false

        };

        return normalized;

    }

    /**
     * Normalizes controlled migration import options.
     *
     * Test-only backend fields such as testMode, migrationKey,
     * and sourceRecords are deliberately not exposed through the
     * frontend production gateway.
     *
     * @param {*} options
     * @returns {Object}
     */
    function normalizeImportOptions(
        options
    ) {

        if (
            options === null ||
            options === undefined
        ) {
            options = {};
        }

        if (
            typeof options !== "object" ||
            Array.isArray(options)
        ) {
            throw new Error(
                "Migration import options must be an object."
            );
        }

        return {

            updatedBy:
                normalizeOptionalText(
                    options.updatedBy
                ) || "SYSTEM",

            batchSize:
                normalizePositiveInteger(
                    options.batchSize !== undefined
                        ? options.batchSize
                        : 100,
                    "Batch size"
                ),

            maxBatchesPerRun:
                normalizePositiveInteger(
                    options.maxBatchesPerRun !== undefined
                        ? options.maxBatchesPerRun
                        : 1,
                    "Maximum batches per run"
                ),

            allowMissingDate:
                options.allowMissingDate === true,

            allowMissingIssueCost:
                options.allowMissingIssueCost === true,

            recalculateTotals:
                options.recalculateTotals !== false

        };

    }
    /**
     * Normalizes optional text.
     *
     * @param {*} value
     * @returns {string}
     */
    function normalizeOptionalText(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        return String(value).trim();

    }


    /**
     * Validates a positive integer.
     *
     * @param {*} value
     * @param {string} fieldName
     * @returns {number}
     */
    function normalizePositiveInteger(
        value,
        fieldName
    ) {

        const numericValue =
            Number(value);

        if (
            !Number.isFinite(
                numericValue
            ) ||
            !Number.isInteger(
                numericValue
            ) ||
            numericValue <= 0
        ) {
            throw new Error(
                fieldName +
                " must be a positive integer."
            );
        }

        return numericValue;

    }


        return Object.freeze({

        ACTIONS,

        validate,

        importBatch,

        getState,

        isSuccessful,

        unwrap,

        isCompleted,

        isReady,

        isRunning,

        isPaused

    });

})();