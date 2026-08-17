"use strict";

/**
 * ==========================================================
 * TALDMS
 * ----------------------------------------------------------
 * Learning List View
 *
 * Feature:
 * LRN-F001
 *
 * Responsibility
 * - Render Learning Registry
 * - Display Learning Records
 * - Launch Add Learning Transaction
 * ==========================================================
 */

TAESF.Modules = TAESF.Modules || {};
TAESF.Modules.Learning = TAESF.Modules.Learning || {};
TAESF.Modules.Learning.Views = TAESF.Modules.Learning.Views || {};

TAESF.Modules.Learning.Views.List = (() => {

    function render() {

        return TAESF.UI.Dashboard.render({

            header: TAESF.UI.Header.render({

                organization: "TESDA Albay",

                application: "Training and Learning Development Management System"

            }),

            sidebar: TAESF.UI.Sidebar.render(),

            breadcrumb: TAESF.UI.Breadcrumb.render([

                "Home",

                "Learning",

                "Learning Registry"

            ]),

            content: `

<div class="page">

    <div class="page-header">

        <h1 class="page-title">

            Learning Registry

        </h1>

        <p class="page-subtitle">

            Historical Learning Records

        </p>

    </div>

    ${TAESF.UI.Notification.render({

        type: "notification-info",

        title: "Learning Registry",

        message: "Employee Learning Records Repository"

    })}

    ${TAESF.UI.Card.render({

        title: "Learning Registry",

        subtitle: "Historical Learning Records",

        body: `

<div
    style="
        display:flex;
        justify-content:space-between;
        align-items:flex-end;
        gap:16px;
        margin-bottom:20px;
    ">

    <div>

        ${TAESF.UI.Button.render({

            id: "btnAddLearning",

            label: "Add Learning",

            type: "btn-primary"

        })}

    </div>

    <div style="width:320px;">

        ${TAESF.UI.Form.textField({

            id: "txtSearchLearning",

            label: "",

            placeholder: "Search Learning..."

        })}

    </div>

</div>

<div id="learningTableContainer">

${TAESF.UI.Table.render(

    [

        "Learning No.",

        "Training Title",

        "Employee No.",

        "Provider",

        "Status",

        "Actions"

    ],

    TAESF.Modules.Learning.Controller.getTableRows()

)}

</div>

`

    })}

    <div id="learningModalContainer"></div>

</div>

`

        });

    }

    return Object.freeze({

        render

    });

})();