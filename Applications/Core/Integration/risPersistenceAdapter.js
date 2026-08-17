/**
 * ==========================================================
 * TAESF
 * Enterprise Integration Layer
 * ----------------------------------------------------------
 * RisPersistenceAdapter
 *
 * Version : 2.0.0
 * Sprint  : RC-2.5B.2
 * ==========================================================
 *
 * PURPOSE
 * ----------------------------------------------------------
 * Synchronizes Enterprise RIS Documents with the
 * Legacy AIMS Storage.
 *
 * This adapter contains NO BUSINESS RULES.
 *
 * Responsibilities
 * ----------------------------------------------------------
 * ✓ Synchronize RIS Header
 * ✓ Synchronize Procurement Queue
 * ✓ Synchronize Inventory
 * ✓ Preserve Legacy Compatibility
 *
 * ==========================================================
 */

const RisPersistenceAdapter = (() => {

    "use strict";

    //=========================================================
    // PRIVATE
    //=========================================================

    function clone(value) {

        return structuredClone(value);

    }

    function synchronizeRecord(collection, keySelector, record) {

        const index = collection.findIndex(keySelector);

        if (index >= 0) {

            collection[index] = {

                ...collection[index],
                ...clone(record)

            };

        } else {

            collection.push(clone(record));

        }

        return collection[index >= 0 ? index : collection.length - 1];

    }

    //=========================================================
    // RIS HEADER
    //=========================================================

    async function syncRISHeader(risHeader) {

    if (!risHeader) return;

    const headers = getData(DB.RIS_HDR) || [];

    console.group("[SYNC RIS HEADER]");

    console.log("Incoming:");
    console.log(structuredClone(risHeader));

    console.table(headers);

    const index = headers.findIndex(r =>
        r.risId === risHeader.risId ||
        r.risNo === risHeader.risNo
    );

    console.log("Matched index:", index);

    if (index >= 0) {

        console.log("UPDATE");

        headers[index] = {
            ...headers[index],
            ...structuredClone(risHeader)
        };

    } else {

        console.log("INSERT");

        headers.push(structuredClone(risHeader));

    }

    console.table(headers);

    console.groupEnd();

    await saveData(DB.RIS_HDR, headers);

}

    //=========================================================
    // PROCUREMENT
    //=========================================================

    async function syncProcurement(procurementQueue) {

        if (!Array.isArray(procurementQueue))
            return;

        const db = getData(DB.PROCUREMENT) || [];

        procurementQueue.forEach(item => {

            synchronizeRecord(

                db,

                p =>
                    p.id === item.id ||
                    p.stockNo === item.stockNo,

                item

            );

        });

        await saveData(DB.PROCUREMENT, db);

    }

    //=========================================================
    // INVENTORY
    //=========================================================

    async function syncInventory(inventory) {

        if (!Array.isArray(inventory))
            return;

        await saveData(

            DB.INV,

            clone(inventory)

        );

    }

    //=========================================================
    // PUBLIC
    //=========================================================

    async function sync(context = {}) {

        try {

            await syncRISHeader(

                context.risHeader

            );

            await syncProcurement(

                context.procurementQueue

            );

            await syncInventory(

                context.inventory

            );

            return {

                success: true,

                synchronizedAt: new Date().toISOString(),

                message: "Enterprise synchronization completed."

            };

        }

        catch (error) {

            console.error(

                "[RisPersistenceAdapter]",

                error

            );

            return {

                success: false,

                message: error.message,

                error

            };

        }

    }

    return Object.freeze({

        sync,

        syncRISHeader,

        syncProcurement,

        syncInventory

    });

})();