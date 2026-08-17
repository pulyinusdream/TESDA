"use strict";

/**
 * ==========================================================
 * TALDMS
 * ----------------------------------------------------------
 * Strategic Workforce Plan Activity Validator
 *
 * Feature:
 * WDP-A003
 *
 * Responsibility
 * - Validate Strategic Activities
 * - Enforce Business Rules
 * ==========================================================
 */

TAESF.Modules = TAESF.Modules || {};
TAESF.Modules.Workforce = TAESF.Modules.Workforce || {};
TAESF.Modules.Workforce.WDP = TAESF.Modules.Workforce.WDP || {};

TAESF.Modules.Workforce.WDP.ActivityValidator = (() => {

    const VALID_CATEGORIES = [

        "EXECUTIVE",
        "MANAGERIAL",
        "SUPERVISORY",
        "TECHNICAL",
        "ADMINISTRATIVE",
        "CUT_ACROSS",
        "INDIVIDUAL_DEVELOPMENT"

    ];

    const VALID_FREQUENCIES = [

        "ONE_TIME",
        "ANNUAL",
        "QUARTERLY",
        "AS_NEEDED"

    ];

    const VALID_SOURCES = [

        "STRATEGIC_PLAN",
        "NEW_ANNUAL_REQUIREMENT",
        "MANDATORY_TRAINING",
        "OFFICE_REQUIREMENT",
        "INDIVIDUAL_DEVELOPMENT_PLAN"

    ];

    const VALID_STATUS = [

        "PLANNED",
        "SCHEDULED",
        "IN_PROGRESS",
        "COMPLETED",
        "DEFERRED",
        "CANCELLED"

    ];

    function validate(activity) {

        if (!activity) {

            return {

                success: false,

                message: "Activity object is required."

            };

        }

        if (!activity.planId?.trim()) {

            return {

                success: false,

                message: "Plan ID is required."

            };

        }

        if (!activity.trainingGap?.trim()) {

            return {

                success: false,

                message: "Training Gap is required."

            };

        }

        if (!activity.trainingCourse?.trim()) {

            return {

                success: false,

                message: "Training Course is required."

            };

        }

        if (

            !VALID_CATEGORIES.includes(

                activity.category

            )

        ) {

            return {

                success: false,

                message: "Invalid Category."

            };

        }

        if (

            !VALID_FREQUENCIES.includes(

                activity.implementationFrequency

            )

        ) {

            return {

                success: false,

                message: "Invalid Implementation Frequency."

            };

        }

        if (

            !VALID_SOURCES.includes(

                activity.activitySource

            )

        ) {

            return {

                success: false,

                message: "Invalid Activity Source."

            };

        }

        if (

            !VALID_STATUS.includes(

                activity.status

            )

        ) {

            return {

                success: false,

                message: "Invalid Activity Status."

            };

        }

        if (

            activity.endYear < activity.startYear

        ) {

            return {

                success: false,

                message: "End Year cannot be earlier than Start Year."

            };

        }

        if (

            Number(activity.estimatedDays) <= 0

        ) {

            return {

                success: false,

                message: "Estimated Days must be greater than zero."

            };

        }

        if (

            Number(activity.estimatedParticipants) <= 0

        ) {

            return {

                success: false,

                message: "Estimated Participants must be greater than zero."

            };

        }

        if (

            Number(activity.estimatedBudget) < 0

        ) {

            return {

                success: false,

                message: "Estimated Budget cannot be negative."

            };

        }

        return {

            success: true,

            message: "Validation successful."

        };

    }

    return Object.freeze({

        validate

    });

})();