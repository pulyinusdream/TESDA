/**
 * ==========================================================
 * TAESF Framework
 * User Account Service
 * Version: 1.0.0-alpha
 * ==========================================================
 *
 * Frontend gateway for centralized designated user accounts.
 *
 * Responsibilities:
 * - Create one designated user account
 * - Retrieve safe user-account profiles
 * - Retrieve a safe account profile by username
 * - Normalize user-account request data
 * - Return standard BaseBusinessService responses
 *
 * This service does not:
 * - Hash passwords in the browser
 * - Store passwords
 * - Read the UserAccounts sheet directly
 * - Create authenticated sessions
 * - Perform login validation
 * ==========================================================
 */

const UserAccountService = (() => {

    "use strict";


    /**
     * Backend command registry.
     */
    const ACTIONS = Object.freeze({

        CREATE:
            "userAccounts.create",

        GET_ALL:
            "userAccounts.getAll",

        GET_BY_USERNAME:
            "userAccounts.getByUsername",

        UPDATE:
            "userAccounts.update",

        RESET_PASSWORD:
            "userAccounts.resetPassword",
        
        CHANGE_PASSWORD:
            "userAccounts.changePassword"
        
    });


    /**
     * Creates one designated user account.
     *
     * The plain-text password is sent only to the backend
     * through the HTTPS web-app request. It is never stored
     * by this frontend service.
     *
     * @param {Object} accountData
     * @returns {Promise<Object>}
     */
    async function createAccount(
        accountData
    ) {

        const payload =
            normalizeCreatePayload(
                accountData
            );

        return BaseBusinessService.execute(
            ACTIONS.CREATE,
            payload
        );

    }


    /**
     * Retrieves all safe account profiles.
     *
     * Password hashes and salts are excluded by the backend.
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
     * Retrieves one safe account profile by username.
     *
     * @param {string} username
     * @returns {Promise<Object>}
     */
    async function getByUsername(
        username
    ) {

        const normalizedUsername =
            normalizeUsername(
                username
            );

        return BaseBusinessService.execute(
            ACTIONS.GET_BY_USERNAME,
            {
                username:
                    normalizedUsername
            }
        );

    }

    /**
     * Updates the role and status of one designated account.
     *
     * @param {Object} accountData
     * @returns {Promise<Object>}
     */
    async function updateAccount(
        accountData
    ) {

        const payload =
            normalizeUpdatePayload(
                accountData
            );

        return BaseBusinessService.execute(
            ACTIONS.UPDATE,
            payload
        );

    }

    /**
     * Resets one designated account to a new temporary password.
     *
     * The plain-text password is sent only to the backend
     * through the HTTPS web-app request. It is never stored
     * by this frontend service.
     *
     * @param {Object} accountData
     * @returns {Promise<Object>}
     */
    async function resetPassword(
        accountData
    ) {
        

        const payload =
            normalizeResetPasswordPayload(
                accountData
            );

        return BaseBusinessService.execute(
            ACTIONS.RESET_PASSWORD,
            payload
        );

    }
    /**
     * Changes the password of one authenticated account.
     *
     * @param {Object} accountData
     * @returns {Promise<Object>}
     */
    async function changePassword(
        accountData
    ) {

        const payload =
            normalizeChangePasswordPayload(
                accountData
            );

        return BaseBusinessService.execute(
            ACTIONS.CHANGE_PASSWORD,
            payload
        );

    }

    /**
     * Returns true when the standard response represents
     * a successful backend operation.
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
     * Returns the data from a successful response.
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
                    : "User-account operation failed."
            );
        }

        return response.data;

    }


    /**
     * Normalizes account-creation data.
     *
     * @param {*} accountData
     * @returns {Object}
     */
    function normalizeCreatePayload(
        accountData
    ) {

        if (
            accountData === null ||
            accountData === undefined ||
            typeof accountData !== "object" ||
            Array.isArray(accountData)
        ) {
            throw new Error(
                "User-account data is required."
            );
        }

        const employeeId =
            normalizeRequiredText(
                accountData.employeeId,
                "employeeId"
            );

        const username =
            normalizeUsername(
                accountData.username
            );

        const password =
            normalizePassword(
                accountData.password
            );

        const role =
            normalizeRole(
                accountData.role
            );

        const createdBy =
            normalizeOptionalText(
                accountData.createdBy
            ) || "SYSTEM";

        return {

            employeeId,

            username,

            password,

            role,

            createdBy

        };

    }

    /**
     * Normalizes account-update data.
     *
     * @param {*} accountData
     * @returns {Object}
     */
    function normalizeUpdatePayload(
        accountData
    ) {

        if (
            accountData === null ||
            accountData === undefined ||
            typeof accountData !== "object" ||
            Array.isArray(accountData)
        ) {
            throw new Error(
                "User-account update data is required."
            );
        }

        const accountId =
            normalizeRequiredText(
                accountData.accountId,
                "accountId"
            );

        const role =
            normalizeRole(
                accountData.role
            );

        const status =
            normalizeStatus(
                accountData.status
            );

        const updatedBy =
            normalizeOptionalText(
                accountData.updatedBy
            ) || "SYSTEM";

        return {

            accountId,

            role,

            status,

            updatedBy

        };

    }

    /**
     * Normalizes password-reset data.
     *
     * @param {*} accountData
     * @returns {Object}
     */
    function normalizeResetPasswordPayload(
        accountData
    ) {

        if (
            accountData === null ||
            accountData === undefined ||
            typeof accountData !== "object" ||
            Array.isArray(accountData)
        ) {
            throw new Error(
                "Password-reset data is required."
            );
        }

        const accountId =
            normalizeRequiredText(
                accountData.accountId,
                "accountId"
            );

        const password =
            normalizePassword(
                accountData.password
            );

        const updatedBy =
            normalizeOptionalText(
                accountData.updatedBy
            ) || "SYSTEM";

        return {

            accountId,

            password,

            updatedBy

        };

    }
    /**
     * Normalizes authenticated password-change data.
     *
     * @param {*} accountData
     * @returns {Object}
     */
    function normalizeChangePasswordPayload(
        accountData
    ) {

        if (
            accountData === null ||
            accountData === undefined ||
            typeof accountData !== "object" ||
            Array.isArray(accountData)
        ) {

            throw new Error(
                "Password-change data is required."
            );

        }

        const accountId =
            normalizeRequiredText(
                accountData.accountId,
                "accountId"
            );

        const currentPassword =
            normalizeCurrentPassword(
                accountData.currentPassword
            );

        const newPassword =
            normalizePassword(
                accountData.newPassword
            );

        const updatedBy =
            normalizeOptionalText(
                accountData.updatedBy
            ) || accountId;

        return {

            accountId,

            currentPassword,

            newPassword,

            updatedBy

        };

    }

    /**
     * Normalizes usernames to lowercase.
     *
     * @param {*} username
     * @returns {string}
     */
    function normalizeUsername(
        username
    ) {

        const normalized =
            normalizeRequiredText(
                username,
                "username"
            ).toLowerCase();

        if (
            normalized.length < 3
        ) {
            throw new Error(
                "Username must contain at least 3 characters."
            );
        }

        if (
            !/^[a-z0-9._-]+$/.test(
                normalized
            )
        ) {
            throw new Error(
                "Username may contain only letters, numbers, " +
                "periods, underscores, and hyphens."
            );
        }

        return normalized;

    }


    /**
     * Validates the current supported role set.
     *
     * @param {*} role
     * @returns {string}
     */
    function normalizeRole(
        role
    ) {

        const normalized =
            normalizeRequiredText(
                role,
                "role"
            ).toLowerCase();

        const supportedRoles = [

            "staff",

            "admin",

            "coa"

        ];

        if (
            !supportedRoles.includes(
                normalized
            )
        ) {
            throw new Error(
                "Unsupported user role: " +
                normalized
            );
        }

        return normalized;

    }

    /**
     * Validates the supported account-status set.
     *
     * @param {*} status
     * @returns {string}
     */
    function normalizeStatus(
        status
    ) {

        const normalized =
            normalizeRequiredText(
                status,
                "status"
            ).toUpperCase();

        const supportedStatuses = [

            "ACTIVE",

            "INACTIVE",

            "LOCKED"

        ];

        if (
            !supportedStatuses.includes(
                normalized
            )
        ) {
            throw new Error(
                "Unsupported user-account status: " +
                normalized
            );
        }

        return normalized;

    }

    /**
     * Validates current-password input without trimming it.
     *
     * @param {*} password
     * @returns {string}
     */
    function normalizeCurrentPassword(
        password
    ) {

        if (
            password === null ||
            password === undefined
        ) {

            throw new Error(
                "currentPassword is required."
            );

        }

        const normalized =
            String(
                password
            );

        if (
            normalized.length === 0
        ) {

            throw new Error(
                "currentPassword is required."
            );

        }

        return normalized;

    }
    /**
     * Performs frontend password format validation.
     *
     * Final password validation and hashing remain the
     * responsibility of the backend.
     *
     * @param {*} password
     * @returns {string}
     */
    function normalizePassword(
        password
    ) {

        if (
            password === null ||
            password === undefined
        ) {
            throw new Error(
                "password is required."
            );
        }

        const normalized =
            String(password);

        if (
            normalized.length < 8
        ) {
            throw new Error(
                "Password must contain at least 8 characters."
            );
        }

        if (
            !/[A-Za-z]/.test(
                normalized
            )
        ) {
            throw new Error(
                "Password must contain at least one letter."
            );
        }

        if (
            !/[0-9]/.test(
                normalized
            )
        ) {
            throw new Error(
                "Password must contain at least one number."
            );
        }

        return normalized;

    }


    /**
     * Normalizes required text.
     *
     * @param {*} value
     * @param {string} fieldName
     * @returns {string}
     */
    function normalizeRequiredText(
        value,
        fieldName
    ) {

        const normalized =
            normalizeOptionalText(
                value
            );

        if (normalized === "") {
            throw new Error(
                fieldName +
                " is required."
            );
        }

        return normalized;

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

        createAccount,

        getAll,

        getByUsername,

        updateAccount,

        resetPassword,

        changePassword,

        isSuccessful,

        unwrap,

        normalizeUsername,

        normalizeRole,

        normalizeStatus

    });

})();