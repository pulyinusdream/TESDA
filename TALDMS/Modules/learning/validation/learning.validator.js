"use strict";

/**
 * ==========================================================
 * TALDMS
 * ----------------------------------------------------------
 * Learning Validator
 *
 * Business Sprint : B2.3
 *
 * Responsibility
 * - Validate Learning Event
 * ==========================================================
 */

TAESF.Modules = TAESF.Modules || {};
TAESF.Modules.Learning = TAESF.Modules.Learning || {};

TAESF.Modules.Learning.Validator = (() => {

    function validate(learning) {

        const errors = [];

        if (!learning.employeeNumber?.trim()) {

            errors.push(
                "Employee Number is required."
            );

        }

        if (!learning.trainingTitle?.trim()) {

            errors.push(
                "Training Title is required."
            );

        }

        if (!learning.provider?.trim()) {

            errors.push(
                "Training Provider is required."
            );

        }

        if (!learning.trainingYear) {

            errors.push(
                "Training Year is required."
            );

        }

        if (!learning.startDate) {

            errors.push(
                "Start Date is required."
            );

        }

        if (!learning.endDate) {

            errors.push(
                "End Date is required."
            );

        }

        if (

            learning.startDate &&
            learning.endDate &&
            learning.endDate < learning.startDate

        ) {

            errors.push(

                "End Date cannot be earlier than Start Date."

            );

        }

        if (

            learning.trainingHours <= 0

        ) {

            errors.push(

                "Training Hours must be greater than zero."

            );

        }

        /*
        ==================================================
        Verify Employee Exists
        ==================================================
        */

        const employeeRepository =
            TAESF.Modules.Employee?.Repository;

        if (!employeeRepository) {

            errors.push(
                "Employee Repository is not available."
            );

        }
        else if (

            learning.employeeNumber &&
            !employeeRepository.exists(
                learning.employeeNumber
            )

        ) {

            errors.push(
                "Employee Number does not exist."
            );

        }

        return {

            valid: errors.length === 0,

            success: errors.length === 0,

            errors,

            message:

                errors.length === 0

                    ? "Validation successful."

                    : "Validation failed."

        };

    }

    return Object.freeze({

        validate

    });

})();