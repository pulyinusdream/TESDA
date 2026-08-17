"use strict";

/**
 * ==========================================================
 * TAECP Framework
 * Authentication Service
 * ==========================================================
 */

TAESF.Services.Authentication = (() => {

    const session = TAESF.Services.Session;

    /**
     * Login
     *
     * Placeholder implementation.
     * Actual user validation will be
     * implemented during Business Sprint B1.
     */
    function login(employeeCode) {

        const user = {

            employeeCode: employeeCode,

            loginTime: new Date()

        };

        session.setCurrentUser(user);

        return true;

    }

    function logout() {

        session.clear();

    }

    function currentUser() {

        return session.getCurrentUser();

    }

    function isAuthenticated() {

        return session.isAuthenticated();

    }

    return Object.freeze({

        login,

        logout,

        currentUser,

        isAuthenticated

    });

})();