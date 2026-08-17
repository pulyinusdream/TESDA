/**
 * ==========================================================
 * TAESF Session Manager
 * RC-2 Sprint 2.0B
 * Version 1.1.0
 * ==========================================================
 *
 * Responsibility:
 * Manages the authenticated frontend session only.
 *
 * Supports:
 * - Designated-user identity sessions
 * - Temporary legacy role-only sessions
 * - Session expiration
 * - Safe session restoration
 *
 * Does NOT:
 * - authenticate users
 * - validate passwords
 * - retrieve employee information
 * - store password data
 *
 * Those responsibilities belong to other services.
 * ==========================================================
 */

const SessionManager = (function () {

    "use strict";


    /**
     * Creates a frontend session.
     *
     * Supported input:
     *
     * Legacy:
     * createSession("admin")
     *
     * Designated identity:
     * createSession({
     *   account: {...},
     *   employee: {...},
     *   authenticatedAt: "..."
     * })
     *
     * @param {string|Object} sessionSource
     * @returns {Object}
     */
    function createSession(
        sessionSource
    ) {

        if (
            sessionSource === null ||
            sessionSource === undefined
        ) {
            throw new Error(
                "SessionManager.createSession(): session source is required."
            );
        }

        const loginTime =
            Date.now();

        const timeoutMinutes =
            getTimeoutMinutes();

        const expiresAt =
            loginTime +
            timeoutMinutes *
            60 *
            1000;

        let session;

        if (
            typeof sessionSource === "string"
        ) {

            session =
                createLegacySession(
                    sessionSource,
                    loginTime,
                    expiresAt
                );

        }
        else {

            session =
                createIdentitySession(
                    sessionSource,
                    loginTime,
                    expiresAt
                );

        }

        saveSession(
            session
        );

        return session;

    }


    /**
     * Creates a temporary backward-compatible role-only
     * session.
     *
     * @param {string} role
     * @param {number} loginTime
     * @param {number} expiresAt
     * @returns {Object}
     */
    function createLegacySession(
        role,
        loginTime,
        expiresAt
    ) {

        const normalizedRole =
            normalizeRequiredText(
                role,
                "role"
            ).toLowerCase();

        return {

            version:
                "1.1.0",

            sessionType:
                "LEGACY_ROLE",

            role:
                normalizedRole,

            account:
                null,

            user:
                null,

            employee:
                null,

            loginTime,

            expiresAt

        };

    }


    /**
     * Creates a designated-user identity session.
     *
     * @param {Object} identity
     * @param {number} loginTime
     * @param {number} expiresAt
     * @returns {Object}
     */
    function createIdentitySession(
        identity,
        loginTime,
        expiresAt
    ) {

        validateIdentity(
            identity
        );

        const account =
            sanitizeAccount(
                identity.account
            );

        const employee =
            sanitizeEmployee(
                identity.employee
            );

        return {

            version:
                "1.1.0",

            sessionType:
                "DESIGNATED_USER",

            role:
                account.role,

            account,

            user: {

                accountId:
                    account.accountId,

                employeeId:
                    employee.id,

                employeeNo:
                    employee.employeeNo,

                username:
                    account.username,

                fullName:
                    employee.fullName,

                position:
                    employee.position,

                code:
                    employee.code,

                office:
                    employee.office,

                division:
                    employee.division,

                section:
                    employee.section,

                email:
                    employee.email,

                role:
                    account.role,

                status:
                    account.status,

                mustChangePassword:
                    account.mustChangePassword

            },

            employee,

            authenticatedAt:
                identity.authenticatedAt ||
                new Date(
                    loginTime
                ).toISOString(),

            loginTime,

            expiresAt

        };

    }


    /**
     * Removes the current frontend session.
     */
    function destroySession() {

        sessionStorage.removeItem(
            AuthenticationConstants.SESSION_KEY
        );

    }


    /**
     * Returns the current valid session.
     *
     * Expired or malformed sessions are removed.
     *
     * @returns {Object|null}
     */
    function getSession() {

        const raw =
            sessionStorage.getItem(
                AuthenticationConstants.SESSION_KEY
            );

        if (!raw) {

            return null;

        }

        try {

            const session =
                JSON.parse(
                    raw
                );

            if (
                !isValidStoredSession(
                    session
                )
            ) {

                destroySession();

                return null;

            }

            if (
                isExpired(
                    session
                )
            ) {

                destroySession();

                return null;

            }

            return session;

        }
        catch (error) {

            console.error(
                "Invalid session data.",
                error
            );

            destroySession();

            return null;

        }

    }


    /**
     * Returns true when a valid, non-expired session exists.
     *
     * @returns {boolean}
     */
    function isAuthenticated() {

        return getSession() !== null;

    }


    /**
     * Restores the current valid session.
     *
     * @returns {Object|null}
     */
    function restoreSession() {

        return getSession();

    }


    /**
     * Returns true when the session has expired.
     *
     * @param {Object} session
     * @returns {boolean}
     */
    function isExpired(
        session
    ) {

        const expiresAt =
            Number(
                session.expiresAt
            );

        if (
            !Number.isFinite(
                expiresAt
            )
        ) {

            return false;

        }

        return (
            Date.now() >= expiresAt
        );

    }


    /**
     * Returns the remaining session time in milliseconds.
     *
     * @returns {number}
     */
    function getRemainingTime() {

        const session =
            getSession();

        if (!session) {

            return 0;

        }

        const expiresAt =
            Number(
                session.expiresAt
            );

        if (
            !Number.isFinite(
                expiresAt
            )
        ) {

            return 0;

        }

        return Math.max(
            0,
            expiresAt - Date.now()
        );

    }


    /**
     * Extends the current session timeout.
     *
     * @returns {Object|null}
     */
    function refreshSession() {

        const session =
            getSession();

        if (!session) {

            return null;

        }

        session.expiresAt =
            Date.now() +
            getTimeoutMinutes() *
            60 *
            1000;

        saveSession(
            session
        );

        return session;

    }


    /**
     * Saves one session object.
     *
     * @param {Object} session
     */
    function saveSession(
        session
    ) {

        sessionStorage.setItem(

            AuthenticationConstants.SESSION_KEY,

            JSON.stringify(
                session
            )

        );

    }


    /**
     * Returns the configured timeout.
     *
     * @returns {number}
     */
    function getTimeoutMinutes() {

        const configuredTimeout =
            Number(
                AuthenticationConstants
                    .DEFAULT_TIMEOUT_MINUTES
            );

        if (
            !Number.isFinite(
                configuredTimeout
            ) ||
            configuredTimeout <= 0
        ) {

            return 30;

        }

        return configuredTimeout;

    }


    /**
     * Validates designated authenticated identity data.
     *
     * @param {*} identity
     */
    function validateIdentity(
        identity
    ) {

        if (
            identity === null ||
            identity === undefined ||
            typeof identity !== "object" ||
            Array.isArray(identity)
        ) {

            throw new Error(
                "Authenticated identity must be an object."
            );

        }

        if (
            !identity.account ||
            typeof identity.account !== "object"
        ) {

            throw new Error(
                "Authenticated account is required."
            );

        }

        if (
            !identity.employee ||
            typeof identity.employee !== "object"
        ) {

            throw new Error(
                "Authenticated employee is required."
            );

        }

        normalizeRequiredText(
            identity.account.accountId,
            "account.accountId"
        );

        normalizeRequiredText(
            identity.account.username,
            "account.username"
        );

        normalizeRequiredText(
            identity.account.role,
            "account.role"
        );

        normalizeRequiredText(
            identity.employee.id,
            "employee.id"
        );

        normalizeRequiredText(
            identity.employee.fullName,
            "employee.fullName"
        );

    }


    /**
     * Returns safe account fields for session storage.
     *
     * @param {Object} account
     * @returns {Object}
     */
    function sanitizeAccount(
        account
    ) {

        return {

            accountId:
                normalizeRequiredText(
                    account.accountId,
                    "account.accountId"
                ),

            employeeId:
                normalizeRequiredText(
                    account.employeeId,
                    "account.employeeId"
                ),

            username:
                normalizeRequiredText(
                    account.username,
                    "account.username"
                ).toLowerCase(),

            role:
                normalizeRequiredText(
                    account.role,
                    "account.role"
                ).toLowerCase(),

            status:
                normalizeRequiredText(
                    account.status,
                    "account.status"
                ),

            lastLoginAt:
                account.lastLoginAt || null,

            mustChangePassword:
                normalizeBoolean(
                    account.mustChangePassword,
                    false
                )

        };

    }


    /**
     * Returns safe employee fields for session storage.
     *
     * @param {Object} employee
     * @returns {Object}
     */
    function sanitizeEmployee(
        employee
    ) {

        return {

            id:
                normalizeRequiredText(
                    employee.id,
                    "employee.id"
                ),

            employeeNo:
                normalizeOptionalText(
                    employee.employeeNo
                ),

            fullName:
                normalizeRequiredText(
                    employee.fullName,
                    "employee.fullName"
                ),

            position:
                normalizeOptionalText(
                    employee.position
                ),

            code:
                normalizeOptionalText(
                    employee.code
                ),

            office:
                normalizeOptionalText(
                    employee.office
                ),

            division:
                normalizeOptionalText(
                    employee.division
                ),

            section:
                normalizeOptionalText(
                    employee.section
                ),

            email:
                normalizeOptionalText(
                    employee.email
                ),

            status:
                normalizeOptionalText(
                    employee.status
                )

        };

    }


    /**
     * Performs basic validation of a stored session.
     *
     * @param {*} session
     * @returns {boolean}
     */
    function isValidStoredSession(
        session
    ) {

        if (
            session === null ||
            session === undefined ||
            typeof session !== "object" ||
            Array.isArray(session)
        ) {

            return false;

        }

        if (
            !session.role ||
            !session.loginTime
        ) {

            return false;

        }

        return true;

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

    /**
     * Normalizes Boolean values received from backend or
     * restored session data.
     *
     * @param {*} value
     * @param {boolean} defaultValue
     * @returns {boolean}
     */
    function normalizeBoolean(
        value,
        defaultValue
    ) {

        if (
            value === true ||
            value === false
        ) {

            return value;

        }

        if (
            value === null ||
            value === undefined ||
            String(value).trim() === ""
        ) {

            return Boolean(
                defaultValue
            );

        }

        const normalized =
            String(
                value
            )
                .trim()
                .toUpperCase();

        if (
            normalized === "TRUE" ||
            normalized === "YES" ||
            normalized === "1"
        ) {

            return true;

        }

        if (
            normalized === "FALSE" ||
            normalized === "NO" ||
            normalized === "0"
        ) {

            return false;

        }

        return Boolean(
            defaultValue
        );

    }

    return Object.freeze({

        createSession,

        destroySession,

        getSession,

        isAuthenticated,

        restoreSession,

        isExpired,

        getRemainingTime,

        refreshSession

    });

})();