/**
 * ==========================================================
 * TAESF Framework
 * Employee Storage Service
 * Version: 1.0.0-alpha
 * ==========================================================
 *
 * STORAGE LAYER ONLY
 *
 * Responsibilities:
 * - Load Employee Master
 * - Save Employee Master
 * - Seed storage
 * - Check existence
 * - Backup
 * - Restore
 * - Clear
 *
 * This service contains NO business rules.
 * ==========================================================
 */

const EmployeeStorageService = (() => {

    "use strict";

    const STORAGE_KEY = "ta_employees";

    function load() {

        try {

            const raw =
                localStorage.getItem(STORAGE_KEY);

            if (!raw) {

                return [];

            }

            const data = JSON.parse(raw);

            return Array.isArray(data)
                ? data
                : [];

        }
        catch (error) {

            console.error(
                "EmployeeStorageService.load()",
                error
            );

            return [];

        }

    }

    function save(data) {

        localStorage.setItem(

            STORAGE_KEY,

            JSON.stringify(data)

        );

    }

    function exists() {

        return localStorage.getItem(
            STORAGE_KEY
        ) !== null;

    }

    function seed(data) {

        if (!exists()) {

            save(data);

        }

    }

    function clear() {

        localStorage.removeItem(
            STORAGE_KEY
        );

    }

    function backup() {

        return JSON.stringify(

            load(),

            null,

            2

        );

    }

    function restore(json) {

        save(

            JSON.parse(json)

        );

    }

    return {

        load,

        save,

        exists,

        seed,

        clear,

        backup,

        restore

    };

})();