/**
 * ==========================================================
 * TAESF Framework
 * Employee Migration Service
 * Version: 1.0.0-alpha
 * ==========================================================
 *
 * Frontend gateway for centralized Employee Master migration.
 *
 * Responsibilities:
 * - Read the existing EmployeeSeedData resource
 * - Validate migration input
 * - Send employee records to the backend
 * - Retrieve centralized employee records
 * - Normalize standard business-service responses
 *
 * This service does not:
 * - Write directly to spreadsheets
 * - Modify browser EmployeeStorageService data
 * - Create user accounts
 * - Authenticate users
 * - Store passwords
 * ==========================================================
 */

const EmployeeMigrationService = (() => {

    "use strict";


    /**
     * Backend employee command registry.
     */
    const ACTIONS = Object.freeze({

        IMPORT:
            "employees.migration.import",

        GET_ALL:
            "employees.getAll"

    });


    /**
     * Imports the current EmployeeSeedData collection into
     * the centralized backend Employee Master.
     *
     * Existing centralized employees are not replaced unless
     * allowReplace is explicitly set to true.
     *
     * @param {Object} options
     * @returns {Promise<Object>}
     */
    async function importSeedData(
        options = {}
    ) {

        const normalizedOptions =
            normalizeImportOptions(
                options
            );

        const employees =
            getSeedEmployees();

        return BaseBusinessService.execute(
            ACTIONS.IMPORT,
            {
                employees,

                migratedBy:
                    normalizedOptions.migratedBy,

                allowReplace:
                    normalizedOptions.allowReplace
            }
        );

    }


    /**
     * Returns all centralized employee records.
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
     * Returns a safe copy of EmployeeSeedData.
     *
     * A copy is returned because EmployeeSeedData is an
     * immutable resource and should never be modified by the
     * migration process.
     *
     * @returns {Array<Object>}
     */
    function getSeedEmployees() {

        if (
            typeof EmployeeSeedData ===
                "undefined"
        ) {
            throw new Error(
                "EmployeeSeedData is not loaded."
            );
        }

        if (
            !Array.isArray(
                EmployeeSeedData
            )
        ) {
            throw new Error(
                "EmployeeSeedData must be an array."
            );
        }

        if (
            EmployeeSeedData.length === 0
        ) {
            throw new Error(
                "EmployeeSeedData cannot be empty."
            );
        }

        return EmployeeSeedData.map(
            employee => {

                if (
                    employee === null ||
                    employee === undefined ||
                    typeof employee !== "object" ||
                    Array.isArray(employee)
                ) {
                    throw new Error(
                        "Every EmployeeSeedData entry must be an object."
                    );
                }

                return {

                    id:
                        normalizeOptionalText(
                            employee.id
                        ),

                    name:
                        normalizeOptionalText(
                            employee.name
                        ),

                    pos:
                        normalizeOptionalText(
                            employee.pos
                        ),

                    code:
                        normalizeOptionalText(
                            employee.code
                        ),

                    div:
                        normalizeOptionalText(
                            employee.div
                        )

                };

            }
        );

    }


    /**
     * Returns true when a standard business response
     * represents a successful backend operation.
     *
     * @param {*} response
     * @returns {boolean}
     */
    function isSuccessful(
        response
    ) {

        return Boolean(
            response &&
            response.success === true &&
            response.backendReachable === true
        );

    }


    /**
     * Returns the data portion of a successful response.
     *
     * @param {*} response
     * @returns {*}
     */
    function unwrap(
        response
    ) {

        if (
            !isSuccessful(
                response
            )
        ) {
            throw new Error(
                response &&
                response.message
                    ? response.message
                    : "Employee migration operation failed."
            );
        }

        return response.data;

    }


    /**
     * Normalizes import options.
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
                "Employee migration options must be an object."
            );
        }

        return {

            migratedBy:
                normalizeOptionalText(
                    options.migratedBy
                ) || "SYSTEM",

            allowReplace:
                options.allowReplace === true

        };

    }


    /**
     * Normalizes optional text.
     *
     * @param {*} value
     * @returns {string}
     */
    function normalizeOptionalText(
        value
    ) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        return String(
            value
        ).trim();

    }


    return Object.freeze({

        ACTIONS,

        importSeedData,

        getAll,

        getSeedEmployees,

        isSuccessful,

        unwrap

    });

})();