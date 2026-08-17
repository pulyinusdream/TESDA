"use strict";

/**
 * ==========================================================
 * TALDMS
 * ----------------------------------------------------------
 * Employee Service
 *
 * Feature:
 * EMP-F002
 *
 * Responsibility
 * - Coordinate Employee Business Logic
 * - Validate Employee
 * - Prevent Duplicate Employee Numbers
 * - Save Employee
 * ==========================================================
 */

TAESF.Modules = TAESF.Modules || {};
TAESF.Modules.Employee = TAESF.Modules.Employee || {};

TAESF.Modules.Employee.Service = (() => {

    /**
     * ------------------------------------------------------
     * Create Employee
     * ------------------------------------------------------
     */

    function create(employee) {

        // Validate Required Fields
        const validation =
            TAESF.Modules.Employee.Validator.validate(employee);

        if (!validation.valid) {

            return {

                success: false,

                message: "Validation failed.",

                errors: validation.errors

            };

        }

        // Duplicate Employee Number
        if (

            TAESF.Modules.Employee.Repository.exists(

                employee.employeeNumber

            )

        ) {

            return {

                success: false,

                message: "Employee Number already exists.",

                errors: [

                    "Duplicate Employee Number."

                ]

            };

        }

        // Default Status
        if (!employee.status) {

            employee.status = "Active";

        }

        // Audit Information
        employee.createdDate = new Date();

        employee.modifiedDate = new Date();

        // Save
        TAESF.Modules.Employee.Repository.save(employee);

        return {

            success: true,

            message: "Employee successfully created.",

            data: employee

        };

    }

    /**
     * ------------------------------------------------------
     * Update Employee
     * ------------------------------------------------------
     */

    function update(employeeNumber, employee) {

        const validation =
            TAESF.Modules.Employee.Validator.validate(employee);

        if (!validation.valid) {

            return {

                success: false,

                message: "Validation failed.",

                errors: validation.errors

            };

        }

        employee.modifiedDate = new Date();

        const updated =

            TAESF.Modules.Employee.Repository.update(

                employeeNumber,

                employee

            );

        if (!updated) {

            return {

                success: false,

                message: "Employee not found."

            };

        }

        return {

            success: true,

            message: "Employee successfully updated.",

            data: updated

        };

    }

    /**
     * ------------------------------------------------------
     * Remove Employee
     * ------------------------------------------------------
     */

    function remove(employeeNumber) {

        const removed =

            TAESF.Modules.Employee.Repository.remove(

                employeeNumber

            );

        if (!removed) {

            return {

                success: false,

                message: "Employee not found."

            };

        }

        return {

            success: true,

            message: "Employee successfully removed."

        };

    }

    /**
     * ------------------------------------------------------
     * Retrieve Employees
     * ------------------------------------------------------
     */

    function getAll() {

        return TAESF.Modules.Employee.Repository.getAll();

    }

    function getByEmployeeNumber(employeeNumber) {

        return TAESF.Modules.Employee.Repository.getByEmployeeNumber(

            employeeNumber

        );

    }

    /**
     * ------------------------------------------------------
     * Public API
     * ------------------------------------------------------
     */

    return Object.freeze({

        create,

        update,

        remove,

        getAll,

        getByEmployeeNumber

    });

})();