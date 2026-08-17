"use strict";

/**
 * ==========================================================
 * TALDMS
 * ----------------------------------------------------------
 * Strategic Activity Modal
 *
 * Feature:
 * WDP-A005
 *
 * Responsibility
 * - Add Strategic Activity
 * - Edit Strategic Activity
 * - Enterprise Modal View
 * ==========================================================
 */

TAESF.Modules = TAESF.Modules || {};
TAESF.Modules.Workforce = TAESF.Modules.Workforce || {};
TAESF.Modules.Workforce.WDP = TAESF.Modules.Workforce.WDP || {};
TAESF.Modules.Workforce.WDP.Views =
TAESF.Modules.Workforce.WDP.Views || {};

TAESF.Modules.Workforce.WDP.Views.ActivityModal = (() => {

    function render(activity = {}) {

        return TAESF.UI.Modal.render({

            title: "Strategic Workforce Plan Activity",

            size: "modal-xl",

            body: `

<form id="activityForm" class="form">

<h3>Activity Information</h3>

${TAESF.UI.Form.selectField({

    id:"txtCategory",

    label:"Category",

    value:activity.category ?? "TECHNICAL",

    items:[

        {value:"EXECUTIVE",label:"Executive"},

        {value:"MANAGERIAL",label:"Managerial"},

        {value:"SUPERVISORY",label:"Supervisory"},

        {value:"TECHNICAL",label:"Technical"},

        {value:"ADMINISTRATIVE",label:"Administrative"},

        {value:"CUT_ACROSS",label:"Cut Across All Levels"},

        {value:"INDIVIDUAL_DEVELOPMENT",label:"Individual Development"}

    ]

})}
${TAESF.UI.Form.selectField({

    id:"txtStrategicClassification",

    label:"Strategic Classification",

    value:

        activity.strategicClassification ??

        "TECHNICAL",

    items:[

        {

            value:"TECHNICAL",

            label:"Technical Competencies"

        },

        {

            value:"CORE",

            label:"Core Competencies"

        },

        {

            value:"LEADERSHIP",

            label:"Leadership / Management"

        },

        {

            value:"MANDATORY",

            label:"Mandatory / Statutory"

        },

        {

            value:"OFFICE",

            label:"Office / Other Requirements"

        }

    ]

})}

${TAESF.UI.Form.textArea({

    id:"txtTrainingGap",

    label:"Training Gap",

    value:activity.trainingGap ?? ""

})}

${TAESF.UI.Form.textArea({

    id:"txtTrainingCourse",

    label:"Training Course",

    value:activity.trainingCourse ?? ""

})}

<hr>

<h3>Implementation Schedule</h3>

<div class="grid grid-2">

${TAESF.UI.Form.numberField({

    id:"txtStartYear",

    label:"Start Year",

    value:activity.startYear ?? new Date().getFullYear()

})}

${TAESF.UI.Form.numberField({

    id:"txtEndYear",

    label:"End Year",

    value:activity.endYear ?? new Date().getFullYear()

})}

</div>

${TAESF.UI.Form.selectField({

    id:"txtFrequency",

    label:"Implementation Frequency",

    value:activity.implementationFrequency ?? "ANNUAL",

    items:[

        {value:"ONE_TIME",label:"One-Time"},

        {value:"ANNUAL",label:"Annual"},

        {value:"QUARTERLY",label:"Quarterly"},

        {value:"AS_NEEDED",label:"As Needed"}

    ]

})}

<hr>

<h3>Estimated Resources</h3>

<div class="grid grid-3">

${TAESF.UI.Form.numberField({

    id:"txtDays",

    label:"Estimated Days",

    value:activity.estimatedDays ?? 1

})}

${TAESF.UI.Form.numberField({

    id:"txtParticipants",

    label:"Estimated Participants",

    value:activity.estimatedParticipants ?? 1

})}

${TAESF.UI.Form.numberField({

    id:"txtBudget",

    label:"Estimated Budget",

    value:activity.estimatedBudget ?? 0

})}

</div>

${TAESF.UI.Form.selectField({

    id:"txtMode",

    label:"Mode of Training",

    value:activity.modeOfTraining ?? "FACE_TO_FACE",

    items:[

        {value:"FACE_TO_FACE",label:"Face-to-Face"},

        {value:"ONLINE",label:"Online"},

        {value:"HYBRID",label:"Hybrid"}

    ]

})}

<hr>

<h3>Planning Information</h3>

${TAESF.UI.Form.selectField({

    id:"txtActivitySource",

    label:"Activity Source",

    value:activity.activitySource ?? "STRATEGIC_PLAN",

    items:[

        {value:"STRATEGIC_PLAN",label:"Strategic Plan"},

        {value:"NEW_ANNUAL_REQUIREMENT",label:"New Annual Requirement"},

        {value:"MANDATORY_TRAINING",label:"Mandatory Training"},

        {value:"OFFICE_REQUIREMENT",label:"Office Requirement"},

        {value:"INDIVIDUAL_DEVELOPMENT_PLAN",label:"Individual Development Plan"}

    ]

})}

${TAESF.UI.Form.selectField({

    id:"txtStatus",

    label:"Lifecycle Status",

    value:activity.status ?? "PLANNED",

    items:[

        {value:"PLANNED",label:"Planned"},

        {value:"SCHEDULED",label:"Scheduled"},

        {value:"IN_PROGRESS",label:"In Progress"},

        {value:"COMPLETED",label:"Completed"},

        {value:"DEFERRED",label:"Deferred"},

        {value:"CANCELLED",label:"Cancelled"}

    ]

})}

${TAESF.UI.Form.textArea({

    id:"txtRemarks",

    label:"Remarks",

    value:activity.remarks ?? ""

})}

</form>

`,

            footer: `

${TAESF.UI.Button.render({

    id:"btnSaveActivity",

    label:"Save Activity",

    type:"btn-success"

})}

${TAESF.UI.Button.render({

    id:"btnCancelActivity",

    label:"Cancel",

    type:"btn-secondary"

})}

`

        });

    }

    return Object.freeze({

        render

    });

})();