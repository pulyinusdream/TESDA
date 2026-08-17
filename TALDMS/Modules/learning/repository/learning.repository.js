"use strict";

/**
 * ==========================================================
 * TALDMS
 * ----------------------------------------------------------
 * Learning Repository
 *
 * Business Sprint : B2.2
 * ==========================================================
 */

TAESF.Modules = TAESF.Modules || {};
TAESF.Modules.Learning = TAESF.Modules.Learning || {};

TAESF.Modules.Learning.Repository = (() => {

    const STORAGE_KEY = "taldms.learning";

    function getAll() {

        return TAESF.Services.Storage.load(STORAGE_KEY) || [];

    }

    function getById(learningId) {

        return getAll().find(

            learning => learning.learningId === learningId

        );

    }

    function exists(learningId) {

        return getAll().some(

            learning => learning.learningId === learningId

        );

    }

    function save(learning) {

        const records = getAll();

        records.push(learning);

        TAESF.Services.Storage.save(

            STORAGE_KEY,

            records

        );

        return learning;

    }

    function update(learningId, updatedLearning) {

        const records = getAll();

        const index = records.findIndex(

            learning => learning.learningId === learningId

        );

        if (index === -1) {

            return null;

        }

        records[index] = updatedLearning;

        TAESF.Services.Storage.save(

            STORAGE_KEY,

            records

        );

        return updatedLearning;

    }

    function remove(learningId) {

        const records = getAll().filter(

            learning => learning.learningId !== learningId

        );

        TAESF.Services.Storage.save(

            STORAGE_KEY,

            records

        );

    }

    return Object.freeze({

        getAll,

        getById,

        exists,

        save,

        update,

        remove

    });

})();