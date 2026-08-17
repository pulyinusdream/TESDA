/**
 * ==========================================================
 * TAESF Framework
 * Employee Service
 * Version: 1.1.0-alpha
 * ==========================================================
 *
 * Enterprise Employee Master Service
 *
 * Business rules only.
 *
 * Storage handled by EmployeeStorageService.
 * ==========================================================
 */

const EmployeeService = (() => {

    "use strict";

    function getEmployees() {

        return EmployeeStorageService.load();

    }

    function saveEmployees(data) {

        EmployeeStorageService.save(data);

    }

    function migrationCompleted() {

        return localStorage.getItem(
            MigrationKeys.EMPLOYEE_V1
        ) === "true";

    }

    function markMigrationComplete() {

        localStorage.setItem(

            MigrationKeys.EMPLOYEE_V1,

            "true"

        );

    }

    function generateEmployeeId() {

        const employees = getEmployees();

        let highest = 0;

        employees.forEach(emp => {

            const n = parseInt(

                String(emp.id || "")
                    .replace("EMP-", ""),

                10

            );

            if (!isNaN(n) && n > highest) {

                highest = n;

            }

        });

        return "EMP-" +

            String(highest + 1)

                .padStart(6, "0");

    }

    function mapLegacyEmployee(emp, index) {

        const parts =
            (emp.name || "")
                .trim()
                .split(/\s+/);

        return {

            id:
                "EMP-" +
                String(index + 1)
                    .padStart(6, "0"),

            employeeNo:
                emp.id || "",

            firstName:
                parts[0] || "",

            middleName:
                "",

            lastName:
                parts.length > 1
                    ? parts.slice(1).join(" ")
                    : "",

            suffix:
                "",

            fullName:
                emp.name || "",

            position:
                emp.pos || "",

            office:
                "TESDA Albay Provincial Office",

            division:
                emp.div || "",

            section:
                "",

            employmentType:
                "Permanent",

            email:
                "",

            contactNo:
                "",

            status:
                "ACTIVE",

            dateHired:
                "",

            createdAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString(),

            createdBy:
                "Migration",

            updatedBy:
                "Migration"

        };

    }

    function seedEmployees() {

        if (migrationCompleted()) {

            console.log(
                "[EmployeeService] Migration already completed."
            );

            return;

        }

        if (
            typeof EmployeeSeedData === "undefined" ||
            !Array.isArray(EmployeeSeedData)
        ) {

            console.error(
                "[EmployeeService] EmployeeSeedData not found."
            );

            return;

        }

        const employees =
            EmployeeSeedData.map(

                mapLegacyEmployee

            );

        saveEmployees(employees);

        markMigrationComplete();

        console.log(

            `[EmployeeService] ${employees.length} employee(s) migrated.`

        );

    }

    function findEmployee(id) {

        return getEmployees()

            .find(

                e => e.id === id

            );

    }

    function employeeExists(employeeNo) {

        return getEmployees()

            .some(

                e =>

                e.employeeNo === employeeNo

            );

    }

    function createEmployee(employee) {

        const employees = getEmployees();

        employees.push(employee);

        saveEmployees(employees);

        return employee;

    }

    function updateEmployee(employee) {

        const employees = getEmployees();

        const index =
            employees.findIndex(

                e => e.id === employee.id

            );

        if (index < 0) {

            return false;

        }

        employees[index] = employee;

        saveEmployees(employees);

        return true;

    }

    function deactivateEmployee(id) {

        const employee = findEmployee(id);

        if (!employee) return false;

        employee.status = "INACTIVE";

        employee.updatedAt =
            new Date().toISOString();

        return updateEmployee(employee);

    }

    function activateEmployee(id) {

        const employee = findEmployee(id);

        if (!employee) return false;

        employee.status = "ACTIVE";

        employee.updatedAt =
            new Date().toISOString();

        return updateEmployee(employee);

    }

    function searchEmployees(keyword) {

        keyword =
            String(keyword || "")
                .toLowerCase();

        return getEmployees()

            .filter(emp =>

                emp.fullName
                    .toLowerCase()
                    .includes(keyword)

                ||

                emp.employeeNo
                    .toLowerCase()
                    .includes(keyword)

            );

    }

    function filterEmployees(callback) {

        return getEmployees()

            .filter(callback);

    }

    seedEmployees();

    return {

        getEmployees,

        saveEmployees,

        generateEmployeeId,

        migrationCompleted,

        seedEmployees,

        findEmployee,

        employeeExists,

        createEmployee,

        updateEmployee,

        deactivateEmployee,

        activateEmployee,

        searchEmployees,

        filterEmployees

    };

})();