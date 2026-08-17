"use strict";

/**
 * ==========================================================
 * TALDMS
 * ----------------------------------------------------------
 * Employee Controller
 *
 * Feature:
 * EMP-F003
 *
 * Responsibility
 * - Coordinate Business Operations
 * - Handle UI Events
 * - Prepare View Models
 * ==========================================================
 */

TAESF.Modules = TAESF.Modules || {};
TAESF.Modules.Employee = TAESF.Modules.Employee || {};

TAESF.Modules.Employee.Controller = (() => {

    function create(employee) {

        return TAESF.Modules.Employee.Service.create(employee);

    }

    function update(employeeNumber, employee) {

        return TAESF.Modules.Employee.Service.update(

            employeeNumber,

            employee

        );

    }

    function remove(employeeNumber) {

        return TAESF.Modules.Employee.Service.remove(

            employeeNumber

        );

    }

    function getAll() {

        return TAESF.Modules.Employee.Service.getAll();

    }

    function getByEmployeeNumber(employeeNumber) {

        return TAESF.Modules.Employee.Service.getByEmployeeNumber(

            employeeNumber

        );

    }

    /**
     * ======================================================
     * View Model
     * ======================================================
     */

    function getTableRows() {

        const employees = getAll();

        if (employees.length === 0) {

            return [[

                "-",

                "No Employee Records",

                "-",

                "-",

                TAESF.UI.Badge.render(

                    "Empty",

                    "badge-warning"

                ),

                "-"

            ]];

        }

        return employees.map(employee => [

            employee.employeeNumber,

            `${employee.lastName}, ${employee.firstName}`,

            employee.position,

            employee.office,

            TAESF.UI.Badge.render(

                employee.status,

                employee.status === "Active"

                    ? "badge-success"

                    : "badge-warning"

            ),

            `

${TAESF.UI.Button.render({

    id: `btnEdit_${employee.employeeNumber}`,

    label: "Edit",

    type: "btn-primary"

})}

${TAESF.UI.Button.render({

    id: `btnDelete_${employee.employeeNumber}`,

    label: "Delete",

    type: "btn-danger"

})}

`

        ]);

    }

    /**
     * ======================================================
     * Initialization
     * ======================================================
     */

    function initialize() {

        bindEvents();
        
        bindSearchEvent();

    }

    function bindEvents() {

        const addButton =

            document.getElementById(

                "btnAddEmployee"

            );

        if (addButton) {

            addButton.addEventListener(

                "click",

                openAddForm

            );

        }

        bindTableEvents();

    }

    function bindTableEvents() {

        getAll().forEach(employee => {

            const editButton =

                document.getElementById(

                    `btnEdit_${employee.employeeNumber}`

                );

            if (editButton) {

                editButton.addEventListener(

                    "click",

                    () => editEmployee(

                        employee.employeeNumber

                    )

                );

            }

            const deleteButton =

                document.getElementById(

                    `btnDelete_${employee.employeeNumber}`

                );

            if (deleteButton) {

                deleteButton.addEventListener(

                    "click",

                    () => deleteEmployee(

                        employee.employeeNumber

                    )

                );

            }

        });

    }
     function bindSearchEvent() {

            const searchBox =
                document.getElementById(
                    "txtEmployeeSearch"
                );

            if (!searchBox) {

                return;

            }

            searchBox.addEventListener(

                "keyup",

                filterEmployees

            );

            }

    /**
     * ======================================================
     * Add Employee
     * ======================================================
     */

    function openAddForm() {

        const container =

            document.getElementById(

                "employeeModalContainer"

            );

        container.innerHTML =
        TAESF.Modules.Employee.Views.Form.render(
        TAESF.Modules.Employee.Model.create(),
        "add"
        );

        bindFormEvents();

    }

    function bindFormEvents() {

        document

            .getElementById(

                "btnSaveEmployee"

            )

            ?.addEventListener(

                "click",

                saveEmployee

            );

        document

            .getElementById(

                "btnCancelEmployee"

            )

            ?.addEventListener(

                "click",

                closeForm

            );

    }
    function bindUpdateEvents(employeeNumber) {

    document
        .getElementById("btnSaveEmployee")
        ?.addEventListener(
            "click",
            () => updateEmployee(employeeNumber)
        );

    document
        .getElementById("btnCancelEmployee")
        ?.addEventListener(
            "click",
            closeForm
        );

}

    function saveEmployee() {

    const employee =
        TAESF.Modules.Employee.Model.create();

    employee.employeeNumber =
        document.getElementById("txtEmployeeNumber").value.trim();

    employee.firstName =
        document.getElementById("txtFirstName").value.trim();

    employee.middleName =
        document.getElementById("txtMiddleName").value.trim();

    employee.lastName =
        document.getElementById("txtLastName").value.trim();

    employee.position =
        document.getElementById("txtPosition").value.trim();

    employee.office =
        document.getElementById("txtOffice").value.trim();

    employee.dateHired =
        document.getElementById("txtDateHired").value;

    const result = create(employee);

    if (!result.success) {

        alert(

            result.errors

                ? result.errors.join("\n")

                : result.message

        );

        return;

    }

    alert(result.message);

    closeForm();

    refreshList();

}
function updateEmployee(employeeNumber) {

    const employee =
    getByEmployeeNumber(employeeNumber);

    if (!employee) {

    alert("Employee not found.");

    return;

    }

    employee.firstName =
        document.getElementById("txtFirstName").value.trim();

    employee.middleName =
        document.getElementById("txtMiddleName").value.trim();

    employee.lastName =
        document.getElementById("txtLastName").value.trim();

    employee.position =
        document.getElementById("txtPosition").value.trim();

    employee.office =
        document.getElementById("txtOffice").value.trim();

    employee.dateHired =
        document.getElementById("txtDateHired").value;

    const result =
        update(employeeNumber, employee);

    if (!result.success) {

        alert(result.message);

        return;

    }

    alert(result.message);

    closeForm();

    refreshList();

}
    /**
     * ======================================================
     * Edit (Placeholder)
     * ======================================================
     */

    function editEmployee(employeeNumber) {

    const employee =
        getByEmployeeNumber(employeeNumber);

    if (!employee) {

        alert("Employee not found.");

        return;

    }

    const container =
        document.getElementById(
            "employeeModalContainer"
        );

    container.innerHTML =
        TAESF.Modules.Employee.Views.Form.render(
            employee,
            "edit"
        );

    bindUpdateEvents(employeeNumber);

}

    /**
     * ======================================================
     * Delete (Placeholder)
     * ======================================================
     */

    function deleteEmployee(employeeNumber) {

    const employee =
        getByEmployeeNumber(employeeNumber);

    if (!employee) {

        alert("Employee not found.");

        return;

    }

    const confirmed = confirm(

        `Delete employee:\n\n${employee.lastName}, ${employee.firstName}?\n\nThis action cannot be undone.`

    );

    if (!confirmed) {

        return;

    }

    const result = remove(employeeNumber);

    if (!result.success) {

        alert(result.message);

        return;

    }

    alert(result.message);

    refreshList();

}
function filterEmployees() {

    const keyword =
        document
            .getElementById("txtEmployeeSearch")
            .value
            .trim()
            .toLowerCase();

    const rows =
        document.querySelectorAll(
            ".table tbody tr"
        );

    rows.forEach(row => {

        const text =
            row.textContent.toLowerCase();

        row.style.display =

            text.includes(keyword)

                ? ""

                : "none";

    });

}

    /**
     * ======================================================
     * Utilities
     * ======================================================
     */

    function refreshList() {

        document.getElementById("app").innerHTML =

            TAESF.Modules.Employee.Views.List.render();

        initialize();

    }

    function closeForm() {

        document.getElementById(

            "employeeModalContainer"

        ).innerHTML = "";

    }

    return Object.freeze({

        create,

        update,

        remove,

        getAll,

        getByEmployeeNumber,

        getTableRows,

        initialize,

        refreshList,

        openAddForm,

        closeForm,

        saveEmployee,

        editEmployee,

        updateEmployee,

        deleteEmployee

    });

})();