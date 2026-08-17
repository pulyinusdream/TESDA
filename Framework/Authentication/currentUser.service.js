/**
 * ==========================================================
 * TAESF Current User Service
 * RC-2 Sprint 2.0C
 * Version 1.1.0
 * ==========================================================
 *
 * Responsibility:
 * Provides read-only access to the current authenticated user.
 *
 * Supports:
 * - Designated-user identity access
 * - Legacy role-session compatibility
 * - Role and account helpers
 * - Employee identity helpers
 *
 * Does NOT:
 * - authenticate users
 * - create sessions
 * - destroy sessions
 * - modify session data
 *
 * Session ownership belongs to SessionManager.
 * ==========================================================
 */

const CurrentUserService = (function () {

    "use strict";


    /**
     * Returns the current valid frontend session.
     *
     * @returns {Object|null}
     */
    function getSession() {

        return SessionManager.getSession();

    }


    /**
     * Returns true when a valid session exists.
     *
     * @returns {boolean}
     */
    function isLoggedIn() {

        return SessionManager.isAuthenticated();

    }


    /**
     * Returns true when the session belongs to a designated
     * authenticated user.
     *
     * @returns {boolean}
     */
    function isDesignatedUser() {

        const session =
            getSession();

        return Boolean(

            session &&

            session.sessionType ===
                "DESIGNATED_USER" &&

            session.user

        );

    }


    /**
     * Returns the current safe user profile.
     *
     * Legacy role-only sessions return null.
     *
     * @returns {Object|null}
     */
    function getCurrentUser() {

        const session =
            getSession();

        if (
            !session ||
            !session.user
        ) {

            return null;

        }

        return Object.freeze({

            accountId:
                session.user.accountId || "",

            employeeId:
                session.user.employeeId || "",

            employeeNo:
                session.user.employeeNo || "",

            username:
                session.user.username || "",

            fullName:
                session.user.fullName || "",

            position:
                session.user.position || "",

            code:
                session.user.code || "",

            office:
                session.user.office || "",

            division:
                session.user.division || "",

            section:
                session.user.section || "",

            email:
                session.user.email || "",

            role:
                session.user.role ||
                session.role ||
                "",

            status:
                session.user.status || ""

        });

    }


    /**
     * Returns the current safe account profile.
     *
     * @returns {Object|null}
     */
    function getAccount() {

        const session =
            getSession();

        if (
            !session ||
            !session.account
        ) {

            return null;

        }

        return Object.freeze({

            accountId:
                session.account.accountId || "",

            employeeId:
                session.account.employeeId || "",

            username:
                session.account.username || "",

            role:
                session.account.role || "",

            status:
                session.account.status || "",

            lastLoginAt:
                session.account.lastLoginAt || null

        });

    }


    /**
     * Returns the current safe employee profile.
     *
     * @returns {Object|null}
     */
    function getEmployee() {

        const session =
            getSession();

        if (
            !session ||
            !session.employee
        ) {

            return null;

        }

        return Object.freeze({

            id:
                session.employee.id || "",

            employeeNo:
                session.employee.employeeNo || "",

            fullName:
                session.employee.fullName || "",

            position:
                session.employee.position || "",

            code:
                session.employee.code || "",

            office:
                session.employee.office || "",

            division:
                session.employee.division || "",

            section:
                session.employee.section || "",

            email:
                session.employee.email || "",

            status:
                session.employee.status || ""

        });

    }


    /**
     * Returns the current role.
     *
     * @returns {string|null}
     */
    function getRole() {

        const session =
            getSession();

        if (!session) {

            return null;

        }

        return session.role || null;

    }


    /**
     * Returns the current employee ID.
     *
     * @returns {string|null}
     */
    function getEmployeeId() {

        const user =
            getCurrentUser();

        return user
            ? user.employeeId || null
            : null;

    }


    /**
     * Returns the current employee number.
     *
     * @returns {string|null}
     */
    function getEmployeeNo() {

        const user =
            getCurrentUser();

        return user
            ? user.employeeNo || null
            : null;

    }


    /**
     * Returns the current username.
     *
     * @returns {string|null}
     */
    function getUsername() {

        const user =
            getCurrentUser();

        return user
            ? user.username || null
            : null;

    }


    /**
     * Returns the current full name.
     *
     * @returns {string|null}
     */
    function getFullName() {

        const user =
            getCurrentUser();

        return user
            ? user.fullName || null
            : null;

    }


    /**
     * Returns the current office.
     *
     * @returns {string|null}
     */
    function getOffice() {

        const user =
            getCurrentUser();

        return user
            ? user.office || null
            : null;

    }


    /**
     * Returns the current division.
     *
     * @returns {string|null}
     */
    function getDivision() {

        const user =
            getCurrentUser();

        return user
            ? user.division || null
            : null;

    }


    /**
     * Returns the current position.
     *
     * @returns {string|null}
     */
    function getPosition() {

        const user =
            getCurrentUser();

        return user
            ? user.position || null
            : null;

    }


    /**
     * Returns true when the current user has the requested
     * role.
     *
     * @param {string} role
     * @returns {boolean}
     */
    function hasRole(role) {

        if (!role) {

            return false;

        }

        return (
            String(
                getRole() || ""
            ).toLowerCase() ===
            String(role)
                .trim()
                .toLowerCase()
        );

    }


    function isAdmin() {

        return hasRole(
            AuthenticationConstants.ROLES.ADMIN
        );

    }


    function isStaff() {

        return hasRole(
            AuthenticationConstants.ROLES.STAFF
        );

    }


    function isCOA() {

        return hasRole(
            AuthenticationConstants.ROLES.COA
        );

    }


    return Object.freeze({

        isLoggedIn,

        isDesignatedUser,

        getSession,

        getCurrentUser,

        getAccount,

        getEmployee,

        getRole,

        getEmployeeId,

        getEmployeeNo,

        getUsername,

        getFullName,

        getOffice,

        getDivision,

        getPosition,

        hasRole,

        isAdmin,

        isStaff,

        isCOA

    });

})();