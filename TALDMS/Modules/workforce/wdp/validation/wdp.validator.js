"use strict";

/**
 * ==========================================================
 * TALDMS
 * ----------------------------------------------------------
 * Workforce Development Plan Validator
 *
 * Sprint:
 * W1.3
 *
 * Responsibility
 * - Validate WDP Header
 * - Enforce Business Rules
 * ==========================================================
 */

TAESF.Modules = TAESF.Modules || {};
TAESF.Modules.Workforce = TAESF.Modules.Workforce || {};
TAESF.Modules.Workforce.WDP =
    TAESF.Modules.Workforce.WDP || {};

TAESF.Modules.Workforce.WDP.Validator = (() => {

    function validate(plan) {

        const errors = [];

        /*
        ======================================================
        Required Fields
        ======================================================
        */

        if (!plan.office?.trim()) {

            errors.push(
                "Office is required."
            );

        }

        if (!plan.preparedBy?.trim()) {

            errors.push(
                "Prepared By is required."
            );

        }

        if (!plan.preparedPosition?.trim()) {

            errors.push(
                "Prepared Position is required."
            );

        }

        if (!plan.approvedBy?.trim()) {

            errors.push(
                "Approved By is required."
            );

        }

        if (!plan.approvedPosition?.trim()) {

            errors.push(
                "Approved Position is required."
            );

        }

        if (!plan.status?.trim()) {

            errors.push(
                "Status is required."
            );

        }

        /*
        ======================================================
        Year Validation
        ======================================================
        */

        if (!plan.startYear) {

            errors.push(
                "Start Year is required."
            );

        }

        if (!plan.endYear) {

            errors.push(
                "End Year is required."
            );

        }

        if (

            Number(plan.startYear) >

            Number(plan.endYear)

        ) {

            errors.push(

                "Start Year cannot be later than End Year."

            );

        }

        /*
        ======================================================
        Planning Cycle Validation
        ======================================================
        */

        const planningCycle =

            `${plan.startYear}-${plan.endYear}`;

        plan.planningCycle = planningCycle;

        /*
        ======================================================
        Duplicate Planning Cycle
        ======================================================
        */

        const repository =

            TAESF.Modules.Workforce.WDP.Repository;

        if (

            repository &&

            repository.exists(planningCycle)

        ) {

            errors.push(

                `Planning Cycle ${planningCycle} already exists.`

            );

        }

        /*
        ======================================================
        Approval Date
        ======================================================
        */

        if (

            plan.approvalDate &&

            isNaN(

                Date.parse(plan.approvalDate)

            )

        ) {

            errors.push(

                "Approval Date is invalid."

            );

        }

        /*
        ======================================================
        Status Validation
        ======================================================
        */

        const allowedStatus = [

            "Draft",

            "Approved",

            "Revised",

            "Archived"

        ];

        if (

            plan.status &&

            !allowedStatus.includes(plan.status)

        ) {

            errors.push(

                "Invalid WDP Status."

            );

        }

        return {

            success:

                errors.length === 0,

            errors

        };

    }

    return Object.freeze({

        validate

    });

})();