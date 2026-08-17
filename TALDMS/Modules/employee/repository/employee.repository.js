"use strict";

/**
 * ==========================================================
 * TALDMS
 * ----------------------------------------------------------
 * Employee Repository
 *
 * Feature:
 * EMP-F002
 *
 * Responsibility
 * - Persist Employee Records
 * - Retrieve Employee Records
 * - Update Employee Records
 * - Delete Employee Records
 * ==========================================================
 */

TAESF.Modules = TAESF.Modules || {};
TAESF.Modules.Employee = TAESF.Modules.Employee || {};

TAESF.Modules.Employee.Repository = (() => {

    const STORAGE_KEY = "taldms.employee";

    function getEmployees() {

        return TAESF.Services.Storage.load(STORAGE_KEY) || [];

    }

    function saveEmployees(employees) {

        TAESF.Services.Storage.save(

            STORAGE_KEY,

            employees

        );

    }

    function getAll() {

        return getEmployees();

    }

    function getByEmployeeNumber(employeeNumber) {

        return getEmployees().find(

            employee => employee.employeeNumber === employeeNumber

        ) || null;

    }

    function exists(employeeNumber) {

        return getEmployees().some(

            employee => employee.employeeNumber === employeeNumber

        );

    }

    function save(employee) {

        const employees = getEmployees();

        employees.push(employee);

        saveEmployees(employees);

        return employee;

    }

    function update(employeeNumber, updatedEmployee) {

        const employees = getEmployees();

        const index = employees.findIndex(

            employee => employee.employeeNumber === employeeNumber

        );

        if (index === -1) {

            return null;

        }

        employees[index] = updatedEmployee;

        saveEmployees(employees);

        return updatedEmployee;

    }

    function remove(employeeNumber) {

        const employees = getEmployees();

        const index = employees.findIndex(

            employee => employee.employeeNumber === employeeNumber

        );

        if (index === -1) {

            return false;

        }

        employees.splice(index, 1);

        saveEmployees(employees);

        return true;

    }
    
    return Object.freeze({

    getAll,

    getByEmployeeNumber,

    exists,

    save,

    update,

    remove

});

})();