"use strict";

/**
 * ==========================================================
 * TALDMS
 * ----------------------------------------------------------
 * Employee List View
 *
 * Feature:
 * EMP-F005
 *
 * Responsibility
 * - Render Employee Master
 * - Display Employee List
 * - Display Search Box
 * ==========================================================
 */

TAESF.Modules = TAESF.Modules || {};
TAESF.Modules.Employee = TAESF.Modules.Employee || {};
TAESF.Modules.Employee.Views = TAESF.Modules.Employee.Views || {};

TAESF.Modules.Employee.Views.List = (() => {

    function render() {

        return TAESF.UI.Dashboard.render({

            header: TAESF.UI.Header.render({

                organization: "TESDA Albay",

                application: "Training and Learning Development Management System"

            }),

            sidebar: TAESF.UI.Sidebar.render(),

            breadcrumb: TAESF.UI.Breadcrumb.render([

                "Home",

                "Employee",

                "Employee Master"

            ]),

            content: `

<div class="page">

<div class="page-header">

<h1 class="page-title">

Employee Master

</h1>

<p class="page-subtitle">

Digital 201 File Foundation

</p>

</div>

${TAESF.UI.Notification.render({

    type: "notification-info",

    title: "Employee Master",

    message: "Employee Registry"

})}

${TAESF.UI.Card.render({

    title: "Employee Registry",

    subtitle: "Master Data",

    body: `

<div style="display:flex;justify-content:space-between;align-items:end;margin-bottom:16px;gap:16px;">

<div style="flex:1;">

${TAESF.UI.Form.textField({

    id: "txtEmployeeSearch",

    label: "Search Employee",

    placeholder: "Employee Number, Name, Position or Office"

})}

</div>

<div>

${TAESF.UI.Button.render({

    id: "btnAddEmployee",

    label: "Add Employee",

    type: "btn-primary"

})}

</div>

</div>

<div id="employeeTableContainer">

${TAESF.UI.Table.render(

    [

        "Employee No.",

        "Employee",

        "Position",

        "Office",

        "Status",

        "Actions"

    ],

    TAESF.Modules.Employee.Controller.getTableRows()

)}

</div>

`

})}

<div id="employeeModalContainer"></div>

</div>

`

        });

    }

    return Object.freeze({

        render

    });

})();