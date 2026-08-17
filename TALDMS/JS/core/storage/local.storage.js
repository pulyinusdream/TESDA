"use strict";

/**
 * ==========================================================
 * TESDA Albay Enterprise Systems Framework (TAESF)
 * ----------------------------------------------------------
 * File        : local.storage.js
 * Module      : Local Storage Provider
 * Description : Wraps browser Local Storage.
 *
 * Framework   : TAECP v1.0.0
 * ==========================================================
 */
console.log("===== LOCAL STORAGE =====");

console.log(window.TAESF);

TAESF.Storage = TAESF.Storage || {};
console.log(TAESF.Storage);
TAESF.Storage.Local = (() => {

    function set(key, value) {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    }

    function get(key) {

        const value = localStorage.getItem(key);

        if (value === null) {
            return null;
        }

        return JSON.parse(value);

    }

    function remove(key) {

        localStorage.removeItem(key);

    }

    function clear() {

        localStorage.clear();

    }

    return Object.freeze({

        set,

        get,

        remove,

        clear

    });

})();