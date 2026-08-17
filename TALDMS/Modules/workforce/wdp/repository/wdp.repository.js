"use strict";

/**
 * ==========================================================
 * TALDMS
 * ----------------------------------------------------------
 * Workforce Development Plan Repository
 *
 * Sprint:
 * W1.2
 *
 * Responsibility
 * - Persist WDP Header Records
 * - Retrieve WDP Header Records
 * - Update WDP Header Records
 * - Delete WDP Header Records
 * ==========================================================
 */

TAESF.Modules = TAESF.Modules || {};
TAESF.Modules.Workforce = TAESF.Modules.Workforce || {};
TAESF.Modules.Workforce.WDP =
    TAESF.Modules.Workforce.WDP || {};

TAESF.Modules.Workforce.WDP.Repository = (() => {

    const STORAGE_KEY = "taldms.wdp";

    /*
    =====================================================
    Private Functions
    =====================================================
    */

    function loadPlans() {

        return TAESF.Services.Storage.load(
            STORAGE_KEY
        ) || [];

    }

    function savePlans(plans) {

        TAESF.Services.Storage.save(

            STORAGE_KEY,

            plans

        );

    }

    /*
    =====================================================
    CRUD
    =====================================================
    */

    function getAll() {

        return loadPlans();

    }

    function getByPlanId(planId) {

        return loadPlans().find(

            plan => plan.planId === planId

        ) || null;

    }

    function getByWDPNumber(wdpNumber) {

        return loadPlans().find(

            plan => plan.wdpNumber === wdpNumber

        ) || null;

    }

    function exists(planningCycle) {

        return loadPlans().some(

            plan =>

                plan.planningCycle === planningCycle

        );

    }

    function save(plan) {

        const plans = loadPlans();

        plans.push(plan);

        savePlans(plans);

        return plan;

    }

    function update(planId, updatedPlan) {

        const plans = loadPlans();

        const index = plans.findIndex(

            plan => plan.planId === planId

        );

        if (index === -1) {

            return null;

        }

        updatedPlan.updatedDate =
            new Date().toISOString();

        plans[index] = updatedPlan;

        savePlans(plans);

        return updatedPlan;

    }

    function remove(planId) {

        const plans = loadPlans();

        const index = plans.findIndex(

            plan => plan.planId === planId

        );

        if (index === -1) {

            return false;

        }

        plans.splice(index, 1);

        savePlans(plans);

        return true;

    }

    /*
    =====================================================
    Public API
    =====================================================
    */

    return Object.freeze({

        getAll,

        getByPlanId,

        getByWDPNumber,

        exists,

        save,

        update,

        remove

    });

})();