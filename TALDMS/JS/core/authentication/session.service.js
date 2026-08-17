"use strict";

/**
 * ==========================================================
 * TAECP Framework
 * Session Service
 * ==========================================================
 */

TAESF.Services.Session = (() => {

    let currentUser = null;

    function setCurrentUser(user) {

        currentUser = user;

    }

    function getCurrentUser() {

        return currentUser;

    }

    function clear() {

        currentUser = null;

    }

    function isAuthenticated() {

        return currentUser !== null;

    }

    return Object.freeze({

        setCurrentUser,

        getCurrentUser,

        clear,

        isAuthenticated

    });

})();