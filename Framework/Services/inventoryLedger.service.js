/**
 * ==========================================================
 * TAESF Frontend Framework
 * InventoryLedgerService
 * Version: 11.1.0-alpha
 * ==========================================================
 *
 * Frontend gateway for Inventory Ledger commands.
 *
 * Responsibilities:
 * - Send ledger commands to the TAESF backend
 * - Validate basic frontend command inputs
 * - Preserve the standard BaseBusinessService response
 *
 * This service does not:
 * - Persist ledger records locally
 * - Modify inventory balances
 * - Calculate replay balances
 * - Access Google Sheets directly
 * ==========================================================
 */

const InventoryLedgerService = (() => {

    const ACTIONS = Object.freeze({

        RECORD:
            "inventory.ledger.record",

        RECORD_MANY:
            "inventory.ledger.recordMany",

        GET_ALL:
            "inventory.ledger.getAll",

        GET_BY_ID:
            "inventory.ledger.getById",

        GET_BY_ITEM:
            "inventory.ledger.getByItem",

        GET_BY_TRANSACTION:
            "inventory.ledger.getByTransaction",

        GET_BY_REFERENCE:
            "inventory.ledger.getByReference",

        GET_BY_TYPE:
            "inventory.ledger.getByType",

        GET_BY_FUND:
            "inventory.ledger.getByFund",

        GET_SUMMARY:
            "inventory.ledger.getSummary",

        GET_TRANSACTION_TYPES:
            "inventory.ledger.getTransactionTypes"

    });

    /**
     * Records one ledger movement.
     *
     * @param {Object} movement
     * @returns {Promise<Object>}
     */
    async function record(movement) {

        validateObject(
            movement,
            "Ledger movement"
        );

        return BaseBusinessService.execute(
            ACTIONS.RECORD,
            movement
        );

    }

    /**
     * Records multiple ledger movements.
     *
     * Payload expected by the backend:
     *
     * {
     *   movements: [...]
     * }
     *
     * @param {Array<Object>} movements
     * @returns {Promise<Object>}
     */
    async function recordMany(movements) {

        validateNonEmptyArray(
            movements,
            "Ledger movements"
        );

        return BaseBusinessService.execute(
            ACTIONS.RECORD_MANY,
            {
                movements
            }
        );

    }

    /**
     * Returns all ledger records.
     *
     * @returns {Promise<Object>}
     */
    async function getAll() {

        return BaseBusinessService.execute(
            ACTIONS.GET_ALL,
            {}
        );

    }

    /**
     * Returns one ledger record by ID.
     *
     * @param {string|number} ledgerId
     * @returns {Promise<Object>}
     */
    async function getById(ledgerId) {

        validateRequiredValue(
            ledgerId,
            "Ledger ID"
        );

        return BaseBusinessService.execute(
            ACTIONS.GET_BY_ID,
            {
                ledgerId
            }
        );

    }

    /**
     * Returns all ledger records for one item.
     *
     * @param {string|number} itemId
     * @returns {Promise<Object>}
     */
    async function getByItemId(itemId) {

        validateRequiredValue(
            itemId,
            "Item ID"
        );

        return BaseBusinessService.execute(
            ACTIONS.GET_BY_ITEM,
            {
                itemId
            }
        );

    }

    /**
     * Returns all ledger records belonging to one
     * transaction.
     *
     * @param {string|number} transactionId
     * @returns {Promise<Object>}
     */
    async function getByTransactionId(
        transactionId
    ) {

        validateRequiredValue(
            transactionId,
            "Transaction ID"
        );

        return BaseBusinessService.execute(
            ACTIONS.GET_BY_TRANSACTION,
            {
                transactionId
            }
        );

    }

    /**
     * Returns all ledger records matching a reference.
     *
     * @param {string|number} referenceNo
     * @returns {Promise<Object>}
     */
    async function getByReference(
        referenceNo
    ) {

        validateRequiredValue(
            referenceNo,
            "Reference number"
        );

        return BaseBusinessService.execute(
            ACTIONS.GET_BY_REFERENCE,
            {
                referenceNo
            }
        );

    }

    /**
     * Returns all records matching a transaction type.
     *
     * @param {string} transactionType
     * @returns {Promise<Object>}
     */
    async function getByType(
        transactionType
    ) {

        validateRequiredValue(
            transactionType,
            "Transaction type"
        );

        return BaseBusinessService.execute(
            ACTIONS.GET_BY_TYPE,
            {
                transactionType
            }
        );

    }

    /**
     * Returns all records matching a fund cluster.
     *
     * @param {string} fundCluster
     * @returns {Promise<Object>}
     */
    async function getByFundCluster(
        fundCluster
    ) {

        validateRequiredValue(
            fundCluster,
            "Fund cluster"
        );

        return BaseBusinessService.execute(
            ACTIONS.GET_BY_FUND,
            {
                fundCluster
            }
        );

    }

    /**
     * Returns repository-level ledger statistics.
     *
     * @returns {Promise<Object>}
     */
    async function getSummary() {

        return BaseBusinessService.execute(
            ACTIONS.GET_SUMMARY,
            {}
        );

    }

    /**
     * Returns supported backend transaction types.
     *
     * @returns {Promise<Object>}
     */
    async function getTransactionTypes() {

        return BaseBusinessService.execute(
            ACTIONS.GET_TRANSACTION_TYPES,
            {}
        );

    }

    /**
     * Checks whether the backend operation succeeded.
     *
     * BaseBusinessService responses use this structure:
     *
     * {
     *   success,
     *   mode,
     *   backendReachable,
     *   message,
     *   data
     * }
     *
     * @param {Object} response
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
     * Returns response data or throws a business error.
     *
     * This helper is optional for callers that prefer direct
     * data rather than the standard business response.
     *
     * @param {Object} response
     * @returns {*}
     */
    function unwrap(response) {

        if (!isSuccessful(response)) {

            throw new Error(
                response &&
                response.message
                    ? response.message
                    : "Inventory Ledger operation failed."
            );

        }

        return response.data;

    }

    /**
     * Validates a required value.
     *
     * @param {*} value
     * @param {string} fieldName
     */
    function validateRequiredValue(
        value,
        fieldName
    ) {

        if (
            value === null ||
            value === undefined ||
            String(value).trim() === ""
        ) {
            throw new Error(
                fieldName + " is required."
            );
        }

    }

    /**
     * Validates a plain object.
     *
     * @param {*} value
     * @param {string} fieldName
     */
    function validateObject(
        value,
        fieldName
    ) {

        if (
            value === null ||
            value === undefined ||
            typeof value !== "object" ||
            Array.isArray(value)
        ) {
            throw new Error(
                fieldName + " must be an object."
            );
        }

    }

    /**
     * Validates a non-empty array.
     *
     * @param {*} value
     * @param {string} fieldName
     */
    function validateNonEmptyArray(
        value,
        fieldName
    ) {

        if (!Array.isArray(value)) {
            throw new Error(
                fieldName + " must be an array."
            );
        }

        if (value.length === 0) {
            throw new Error(
                fieldName + " cannot be empty."
            );
        }

    }

    return Object.freeze({

        ACTIONS,

        record,

        recordMany,

        getAll,

        getById,

        getByItemId,

        getByTransactionId,

        getByReference,

        getByType,

        getByFundCluster,

        getSummary,

        getTransactionTypes,

        isSuccessful,

        unwrap

    });

})();