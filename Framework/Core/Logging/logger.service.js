/**
 * ============================================================
 * TAESF Enterprise Framework
 * ------------------------------------------------------------
 * Module      : Logger
 * Version     : 1.0.0
 * Sprint      : S0.2.0
 * Description : Central logging utility for TAESF.
 * ============================================================
 */

(function (global) {

    "use strict";

    global.TAESF = global.TAESF || {};
    global.TAESF.Core = global.TAESF.Core || {};

    const LEVELS = Object.freeze({
        DEBUG: 1,
        INFO: 2,
        WARN: 3,
        ERROR: 4,
        OFF: 99
    });

    let enabled = true;
    let level = LEVELS.INFO;

    const history = [];

    function resolveLevel(name) {

        return LEVELS[(name || "").toUpperCase()] ?? LEVELS.INFO;

    }

    function initialize() {

        const config =
            global.TAESF.Core.ConfigurationService;

        if (!config) {
            return;
        }

        enabled =
            config.get("logging.enabled", true);

        level =
            resolveLevel(
                config.get("logging.level", "INFO")
            );

    }

    function write(type, message, args) {

        if (!enabled) {
            return;
        }

        const numeric =
            resolveLevel(type);

        if (numeric < level) {
            return;
        }

        const entry = {
            timestamp: new Date(),
            level: type,
            message,
            arguments: [...args]
        };

        history.push(entry);

        console[type.toLowerCase()](
            `[TAESF] ${message}`,
            ...args
        );

    }

    const Logger = {

        initialize,

        debug(message, ...args) {

            write("DEBUG", message, args);

        },

        info(message, ...args) {

            write("INFO", message, args);

        },

        warn(message, ...args) {

            write("WARN", message, args);

        },

        error(message, ...args) {

            write("ERROR", message, args);

        },

        enable() {

            enabled = true;

        },

        disable() {

            enabled = false;

        },

        setLevel(name) {

            level = resolveLevel(name);

        },

        getLevel() {

            return Object.keys(LEVELS)
                .find(k => LEVELS[k] === level);

        },

        getHistory() {

            return [...history];

        },

        clearHistory() {

            history.length = 0;

        },

        group(label) {

            console.group(label);

        },

        groupEnd() {

            console.groupEnd();

        },

        time(label) {

            console.time(label);

        },

        timeEnd(label) {

            console.timeEnd(label);

        }

    };

    initialize();

    Object.freeze(Logger);

    global.TAESF.Core.Logger = Logger;

})(window);