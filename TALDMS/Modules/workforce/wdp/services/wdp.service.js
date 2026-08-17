"use strict";

/**
 * ==========================================================
 * TALDMS
 * ----------------------------------------------------------
 * Workforce Development Plan Service
 *
 * Sprint:
 * W1.4
 *
 * Responsibility
 * - Business Logic
 * - Validation
 * - Document Number Generation
 * ==========================================================
 */

TAESF.Modules = TAESF.Modules || {};
TAESF.Modules.Workforce = TAESF.Modules.Workforce || {};
TAESF.Modules.Workforce.WDP =
    TAESF.Modules.Workforce.WDP || {};

TAESF.Modules.Workforce.WDP.Service = (() => {

    function create(plan) {

        const validation =

            TAESF.Modules.Workforce.WDP.Validator.validate(plan);

        if (!validation.success) {

            return {

                success: false,

                errors: validation.errors

            };

        }

        plan.wdpNumber = generateWDPNumber(

            plan.startYear,

            plan.endYear

        );

        TAESF.Modules.Workforce.WDP.Repository.save(plan);

        return {

            success: true,

            message: "Workforce Development Plan successfully created.",

            data: plan

        };

    }

    function update(planId, plan) {

        const validation =

            TAESF.Modules.Workforce.WDP.Validator.validate(plan);

        if (!validation.success) {

            return {

                success: false,

                errors: validation.errors

            };

        }

        const updated =

            TAESF.Modules.Workforce.WDP.Repository.update(

                planId,

                plan

            );

        if (!updated) {

            return {

                success: false,

                message: "Plan not found."

            };

        }

        return {

            success: true,

            message: "Workforce Development Plan updated successfully.",

            data: updated

        };

    }

    function remove(planId) {

        const removed =

            TAESF.Modules.Workforce.WDP.Repository.remove(planId);

        if (!removed) {

            return {

                success: false,

                message: "Plan not found."

            };

        }

        return {

            success: true,

            message: "Workforce Development Plan deleted."

        };

    }

    function getAll() {

        return TAESF.Modules.Workforce.WDP.Repository.getAll();

    }

    function getByPlanId(planId) {

        return TAESF.Modules.Workforce.WDP.Repository.getByPlanId(

            planId

        );

    }

    /*
    ======================================================
    Document Number Generator
    ======================================================
    */

    function generateWDPNumber(startYear, endYear) {

        const total =

            getAll().length + 1;

        const runningNumber =

            String(total).padStart(6, "0");

        return `WDP-${startYear}-${endYear}-${runningNumber}`;

    }

    return Object.freeze({

        create,

        update,

        remove,

        getAll,

        getByPlanId,

        generateWDPNumber

    });

})();