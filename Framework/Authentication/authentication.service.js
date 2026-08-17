/**
 * ==========================================================
 * TAESF Authentication Service
 * RC-2 Sprint 2.0D
 * Version 1.1.0
 * ==========================================================
 *
 * Responsibility:
 * Coordinates frontend authentication workflows.
 *
 * Supports:
 * - Centralized username/password authentication
 * - Temporary legacy role-session compatibility
 * - Logout
 * - Current authentication/session queries
 *
 * Does NOT:
 * - own sessionStorage
 * - validate stored password hashes
 * - retrieve spreadsheet records directly
 * - render the login interface
 *
 * Delegates responsibilities to:
 * - BaseBusinessService
 * - SessionManager
 * - CurrentUserService
 * ==========================================================
 */

const AuthenticationService = (function () {

    "use strict";


    /**
     * Backend authentication command.
     */
    const ACTIONS = Object.freeze({

        LOGIN:
            "login"

    });


    /**
     * Authenticates a designated user through the centralized
     * backend.
     *
     * This method does not create a frontend session yet.
     * Session creation will be connected after SessionManager
     * is upgraded to store the full authenticated identity.
     *
     * @param {string} username
     * @param {string} password
     * @returns {Promise<Object>}
     */
    async function authenticate(
        username,
        password
    ) {

        const payload =
            normalizeLoginPayload(
                username,
                password
            );

        return BaseBusinessService.execute(
            ACTIONS.LOGIN,
            payload
        );

    }


    /**
     * Temporary legacy role-only login.
     *
     * This is preserved during the transition so existing
     * screens that call login(role) do not immediately break.
     *
     * It must be removed after all login screens use
     * authenticate(username, password) and the expanded
     * SessionManager.
     *
     * @param {string} role
     * @returns {string}
     */
    function login(role) {

        if (!role) {

            return AuthenticationConstants
                .LOGIN_RESULT
                .INVALID_USERNAME;

        }

        SessionManager.createSession(
            role
        );

        return AuthenticationConstants
            .LOGIN_RESULT
            .SUCCESS;

    }


    /**
     * Ends the current frontend session.
     */
    function logout() {

        SessionManager.destroySession();

    }


    /**
     * Returns true when a frontend session currently exists.
     *
     * @returns {boolean}
     */
    function isAuthenticated() {

        return CurrentUserService.isLoggedIn();

    }


    /**
     * Returns the current frontend session.
     *
     * @returns {Object|null}
     */
    function getCurrentSession() {

        return CurrentUserService.getSession();

    }


    /**
     * Returns the current role from the frontend session.
     *
     * @returns {string|null}
     */
    function getCurrentRole() {

        return CurrentUserService.getRole();

    }


    /**
     * Returns true when a BaseBusinessService response
     * represents a successful backend request.
     *
     * This only means the backend command executed correctly.
     * Use isLoginSuccessful() to determine whether credentials
     * were accepted.
     *
     * @param {*} response
     * @returns {boolean}
     */
    function isRequestSuccessful(
        response
    ) {

        return Boolean(

            response &&

            response.success === true &&

            response.backendReachable === true

        );

    }


    /**
     * Returns the backend authentication result.
     *
     * @param {*} response
     * @returns {Object}
     */
    function unwrap(
        response
    ) {

        if (
            !isRequestSuccessful(
                response
            )
        ) {

            throw new Error(

                response &&
                response.message

                    ? response.message

                    : "Authentication request failed."

            );

        }

        return response.data;

    }


    /**
     * Returns true only when the centralized backend accepted
     * the supplied credentials.
     *
     * @param {*} responseOrResult
     * @returns {boolean}
     */
    function isLoginSuccessful(
        responseOrResult
    ) {

        let result =
            responseOrResult;

        if (
            responseOrResult &&
            responseOrResult.success === true &&
            Object.prototype.hasOwnProperty.call(
                responseOrResult,
                "data"
            )
        ) {

            result =
                responseOrResult.data;

        }

        return Boolean(

            result &&

            result.authenticated === true &&

            result.result ===
                AuthenticationConstants
                    .LOGIN_RESULT
                    .SUCCESS

        );

    }


    /**
     * Returns the authentication result code.
     *
     * @param {*} responseOrResult
     * @returns {string|null}
     */
    function getLoginResultCode(
        responseOrResult
    ) {

        let result =
            responseOrResult;

        if (
            responseOrResult &&
            Object.prototype.hasOwnProperty.call(
                responseOrResult,
                "data"
            )
        ) {

            result =
                responseOrResult.data;

        }

        if (
            !result ||
            typeof result !== "object"
        ) {

            return null;

        }

        return result.result || null;

    }


    /**
     * Normalizes the centralized login payload.
     *
     * Password whitespace is preserved because spaces may
     * legitimately form part of a password.
     *
     * @param {*} username
     * @param {*} password
     * @returns {Object}
     */
    function normalizeLoginPayload(
        username,
        password
    ) {

        if (
            username === null ||
            username === undefined ||
            String(username).trim() === ""
        ) {

            throw new Error(
                "username is required."
            );

        }

        if (
            password === null ||
            password === undefined
        ) {

            throw new Error(
                "password is required."
            );

        }

        return {

            username:
                String(username)
                    .trim()
                    .toLowerCase(),

            password:
                String(password)

        };

    }


    return Object.freeze({

        ACTIONS,

        authenticate,

        login,

        logout,

        isAuthenticated,

        getCurrentSession,

        getCurrentRole,

        isRequestSuccessful,

        unwrap,

        isLoginSuccessful,

        getLoginResultCode

    });

})();