"use strict";

/**
 * ==========================================================
 * TALDMS
 * ----------------------------------------------------------
 * Employee Form View
 *
 * Feature:
 * EMP-F002
 *
 * Responsibility
 * - Render Employee Form
 * - Used by Add Employee
 * - Reused by Edit Employee
 * ==========================================================
 */

TAESF.Modules = TAESF.Modules || {};
TAESF.Modules.Employee = TAESF.Modules.Employee || {};
TAESF.Modules.Employee.Views = TAESF.Modules.Employee.Views || {};

TAESF.Modules.Employee.Views.Form = (() => {

    function render(employee = {}, mode = "add") {

        return TAESF.UI.Modal.render({

            title: "Employee Master",

            body: `

<form id="employeeForm" class="form">

${TAESF.UI.Form.textField({

    id: "txtEmployeeNumber",

    label: "Employee Number",

    value: employee.employeeNumber ?? "",

    placeholder: "Official TESDA Employee Number",

    readonly: mode === "edit"

})}

${TAESF.UI.Form.textField({

    id: "txtFirstName",

    label: "First Name",

    value: employee.firstName ?? ""

})}

${TAESF.UI.Form.textField({

    id: "txtMiddleName",

    label: "Middle Name",

    value: employee.middleName ?? ""

})}

${TAESF.UI.Form.textField({

    id: "txtLastName",

    label: "Last Name",

    value: employee.lastName ?? ""

})}

${TAESF.UI.Form.textField({

    id: "txtPosition",

    label: "Position",

    value: employee.position ?? ""

})}

${TAESF.UI.Form.textField({

    id: "txtOffice",

    label: "Office",

    value: employee.office ?? ""

})}

${TAESF.UI.Form.textField({

    id: "txtDateHired",

    label: "Date Hired",

    value: employee.dateHired ?? "",

    type: "date"

})}

</form>

`,

            footer: `

${TAESF.UI.Button.render({

    id: "btnSaveEmployee",

    label:
    mode === "edit"
        ? "Update"
        : "Save",

    type: "btn-success"

})}

${TAESF.UI.Button.render({

    id: "btnCancelEmployee",

    label: "Cancel",

    type: "btn-secondary"

})}

`

        });

    }

    return Object.freeze({

        render

    });

})();