"use strict";

NEXUS_RRMS.Storage.Local = (() => {
    function set(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value));
    }

    function get(key) {
        const rawValue = window.localStorage.getItem(key);
        if (rawValue === null) {
            return null;
        }

        try {
            return JSON.parse(rawValue);
        } catch (error) {
            console.error("RRMS local storage parse failed", error);
            return null;
        }
    }

    function remove(key) {
        window.localStorage.removeItem(key);
    }

    function clearByPrefix(prefix) {
        const keys = [];
        for (let index = 0; index < window.localStorage.length; index += 1) {
            const key = window.localStorage.key(index);
            if (key && key.startsWith(prefix)) {
                keys.push(key);
            }
        }
        keys.forEach((key) => window.localStorage.removeItem(key));
    }

    return Object.freeze({ set, get, remove, clearByPrefix });
})();
