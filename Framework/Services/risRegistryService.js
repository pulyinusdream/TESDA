/**
 * ==========================================================
 * TAESF Framework
 * RisRegistryService
 * Version: 2.0.0
 * ==========================================================
 *
 * Enterprise RIS Registry
 *
 * Responsibilities
 * ----------------
 * • Persist RIS documents
 * • Retrieve RIS documents
 * • Update documents
 * • Delete documents
 * • Query documents
 * • Generate RIS Numbers
 * • Registry Statistics
 * * This service DOES NOT contain business rules.
 * Business rules belong to RisService.
 * ==========================================================
 */

const RisRegistryService = (() => {

    "use strict";

    const STORAGE_KEY = "TAESF_RIS_REGISTRY";

    function load() {

        try {

            return JSON.parse(

                localStorage.getItem(STORAGE_KEY) || "[]"

            );

        } catch (error) {

            console.error(

                "[RisRegistryService] Failed to load registry.",

                error

            );

            return [];

        }

    }

    function persist(data) {

        localStorage.setItem(

            STORAGE_KEY,

            JSON.stringify(data)

        );

    }

    function getAll() {

        return load();

    }

    function save(document) {

        console.log("SAVE CALLED");
        console.log(document);

        const registry = load();

        registry.unshift(document);

        console.log("Registry before persist:", registry);

        persist(registry);

        console.log(
            "Storage after persist:",
            localStorage.getItem(STORAGE_KEY)
        );

        return document;

    }

    // Backward compatibility
    function add(document) {

        return save(document);

    }

    function update(document) {

        const registry = load();

        const index = registry.findIndex(

            r => r.risId === document.risId

        );

        if (index < 0) {

            return false;

        }

        registry[index] = document;

        persist(registry);

        return true;

    }

    function remove(risId) {

        const registry = load();

        const filtered = registry.filter(

            r => r.risId !== risId

        );

        persist(filtered);

    }

    function find(risId) {

        return load().find(

            r => r.risId === risId

        ) || null;

    }

    function findById(risId) {

        return find(risId);

    }

    function findByNumber(risNo) {

        return load().find(

            r => r.risNo === risNo

        ) || null;

    }

    function findByStatus(status) {

        return load().filter(

            r => r.status === status

        );

    }

    function findDrafts() {

        return findByStatus("DRAFT");

    }

    function findPending() {

        return load().filter(

            r =>

                r.status === "SUBMITTED" ||

                r.status === "UNDER_REVIEW"

        );

    }

    function findOutstanding() {

        return load().filter(

            r =>

                r.status === "APPROVED" ||

                r.status === "RESERVED"

        );

    }

    function archive(risId) {

        const document = find(risId);

        if (!document) {

            return false;

        }

        document.archived = true;

        document.archivedAt =

            new Date().toISOString();

        return update(document);

    }

    function nextRISNumber() {

        const year =

            new Date().getFullYear();

        const registry = load();

        let highest = 0;

        registry.forEach(doc => {

            if (!doc.risNo) return;

            const match =

                String(doc.risNo)

                    .match(

                        /RIS-\d{4}-(\d+)/

                    );

            if (!match) return;

            const value =

                parseInt(match[1], 10);

            if (value > highest) {

                highest = value;

            }

        });

        return (

            "RIS-" +

            year +

            "-" +

            String(highest + 1)

                .padStart(6, "0")

        );

    }

    function statistics() {

        const registry = load();

        return {

            total:

                registry.length,

            draft:

                findDrafts().length,

            pending:

                findPending().length,

            approved:

                findByStatus("APPROVED").length,

            reserved:

                findByStatus("RESERVED").length,

            issued:

                findByStatus("ISSUED").length,

            completed:

                findByStatus("COMPLETED").length,

            rejected:

                findByStatus("REJECTED").length,

            cancelled:

                findByStatus("CANCELLED").length

        };

    }

    function clear() {

        persist([]);

    }

    return Object.freeze({

        getAll,

        save,

        add,

        update,

        remove,

        find,

        findById,

        findByNumber,

        findByStatus,

        findDrafts,

        findPending,

        findOutstanding,

        nextRISNumber,

        statistics,

        archive,

        clear

    });

})();