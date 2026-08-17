"use strict";

/**
 * ==========================================================
 * TALDMS
 * ----------------------------------------------------------
 * Employee Validator
 *
 * Feature:
 * EMP-F002
 *
 * Responsibility
 * - Validate Employee Information
 * - Return Validation Result
 *
 * ==========================================================
 */

TAESF.Modules = TAESF.Modules || {};
TAESF.Modules.Employee = TAESF.Modules.Employee || {};

TAESF.Modules.Employee.Validator = (() => {

    function validate(employee) {

        const errors = [];

        if (!employee) {

            return {

                valid: false,

                errors: [

                    "Employee information is required."

                ]

            };

        }

        /*
        ------------------------------------------------------
        Employee Number
        ------------------------------------------------------
        */

        if (!employee.employeeNumber ||
            employee.employeeNumber.trim() === "") {

            errors.push(

                "Employee Number is required."

            );

        }

        /*
        ------------------------------------------------------
        First Name
        ------------------------------------------------------
        */

        if (!employee.firstName ||
            employee.firstName.trim() === "") {

            errors.push(

                "First Name is required."

            );

        }

        /*
        ------------------------------------------------------
        Last Name
        ------------------------------------------------------
        */

        if (!employee.lastName ||
            employee.lastName.trim() === "") {

            errors.push(

                "Last Name is required."

            );

        }

        /*
        ------------------------------------------------------
        Position
        ------------------------------------------------------
        */

        if (!employee.position ||
            employee.position.trim() === "") {

            errors.push(

                "Position is required."

            );

        }

        /*
        ------------------------------------------------------
        Office
        ------------------------------------------------------
        */

        if (!employee.office ||
            employee.office.trim() === "") {

            errors.push(

                "Office is required."

            );

        }

        /*
        ------------------------------------------------------
        Date Hired
        ------------------------------------------------------
        */

        if (!employee.dateHired) {

            errors.push(

                "Date Hired is required."

            );

        }

        /*
        ------------------------------------------------------
        Validation Result
        ------------------------------------------------------
        */

        return {

            valid: errors.length === 0,

            errors: errors

        };

    }

    return Object.freeze({

        validate

    });

})();