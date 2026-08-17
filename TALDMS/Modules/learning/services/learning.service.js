"use strict";

/**
 * ==========================================================
 * TALDMS
 * ----------------------------------------------------------
 * Learning Business Service
 *
 * Business Sprint : B2.4
 *
 * Responsibility
 * - Validate Learning Events
 * - Coordinate Repository
 * - Business Rules
 * ==========================================================
 */

TAESF.Modules = TAESF.Modules || {};
TAESF.Modules.Learning = TAESF.Modules.Learning || {};

TAESF.Modules.Learning.Service = (() => {

    function create(learning) {

        const validation =
            TAESF.Modules.Learning.Validator.validate(learning);

        if (!validation.valid) {

            return validation;

        }

        if (

            TAESF.Modules.Learning.Repository.exists(

                learning.learningId

            )

        ) {

            return {

                success: false,

                valid: false,

                message: "Learning record already exists."

            };

        }

        learning.createdDate = new Date();

        learning.modifiedDate = new Date();

        learning.active = true;

        TAESF.Modules.Learning.Repository.save(

            learning

        );

        return {

            success: true,

            valid: true,

            message: "Learning record successfully created.",

            data: learning

        };

    }

    function update(learningId, learning) {

        const validation =
            TAESF.Modules.Learning.Validator.validate(learning);

        if (!validation.valid) {

            return validation;

        }

        learning.modifiedDate = new Date();

        TAESF.Modules.Learning.Repository.update(

            learningId,

            learning

        );

        return {

            success: true,

            valid: true,

            message: "Learning record successfully updated.",

            data: learning

        };

    }

    function remove(learningId) {

        TAESF.Modules.Learning.Repository.remove(

            learningId

        );

        return {

            success: true,

            message: "Learning record successfully deleted."

        };

    }

    function getAll() {

        return TAESF.Modules.Learning.Repository.getAll();

    }

    function getById(learningId) {

        return TAESF.Modules.Learning.Repository.getById(

            learningId

        );

    }

    return Object.freeze({

        create,

        update,

        remove,

        getAll,

        getById

    });

})();