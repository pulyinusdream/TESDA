"use strict";

/**
 * ==========================================================
 * TALDMS
 * ----------------------------------------------------------
 * Strategic Workforce Plan Workspace
 *
 * Feature:
 * WDP-W001
 *
 * Responsibility
 * - Render Strategic Workforce Plan Workspace
 * - Enterprise Document View
 * - No Business Logic
 * ==========================================================
 */

TAESF.Modules = TAESF.Modules || {};
TAESF.Modules.Workforce = TAESF.Modules.Workforce || {};
TAESF.Modules.Workforce.WDP = TAESF.Modules.Workforce.WDP || {};
TAESF.Modules.Workforce.WDP.Views =
TAESF.Modules.Workforce.WDP.Views || {};

TAESF.Modules.Workforce.WDP.Views.Workspace = (() => {

    function render(plan = {}) {

    return `

${TAESF.UI.DocumentWorkspace.render({

    title:
        "Strategic Workforce Plan",

    subtitle:
        `Planning Cycle: ${plan.planningCycle ?? "2025–2027"}`,

    badge:

        TAESF.UI.Badge.render(

            plan.status ?? "Draft",

            "badge-warning"

        ),

    toolbar: `

${TAESF.UI.Button.render({

    id:"btnNewActivity",

    label:"New Activity",

    type:"btn-primary"

})}

${TAESF.UI.Button.render({

    id:"btnImportPlan",

    label:"Import Excel",

    type:"btn-secondary"

})}

${TAESF.UI.Button.render({

    id:"btnGenerateAnnual",

    label:"Generate Annual Plan",

    type:"btn-success"

})}

${TAESF.UI.Button.render({

    id:"btnPrintPlan",

    label:"Print",

    type:"btn-secondary"

})}

`,

    tabs: `

<div class="document-tab active">

Header

</div>

<div class="document-tab">

TNA Reference

</div>

<div class="document-tab">

Activities

</div>

<div class="document-tab">

Budget

</div>

<div class="document-tab">

Monitoring

</div>

<div class="document-tab">

History

</div>

`,

    body: `

${TAESF.UI.Card.render({

title:"Strategic Plan Header",

subtitle:"General Information",

body:`

<table class="table">

<tr>

<td><strong>Plan Number</strong></td>

<td>${plan.wdpNumber ?? "Not yet generated"}</td>

</tr>

<tr>

<td><strong>Planning Cycle</strong></td>

<td>${plan.planningCycle ?? "2025–2027"}</td>

</tr>

<tr>

<td><strong>Office</strong></td>

<td>${plan.office ?? ""}</td>

</tr>

<tr>

<td><strong>Prepared By</strong></td>

<td>${plan.preparedBy ?? ""}</td>

</tr>

<tr>

<td><strong>Approved By</strong></td>

<td>${plan.approvedBy ?? ""}</td>

</tr>

</table>

`

})}

${TAESF.UI.Card.render({

title:"Training Needs Analysis Reference",

subtitle:"External TNA Source",

body:`

<table class="table">

<tr>

<td>TNA Year</td>

<td>2026</td>

</tr>

<tr>

<td>Source</td>

<td>TESDA Central Office TNA System</td>

</tr>

<tr>

<td>Date Conducted</td>

<td>-</td>

</tr>

<tr>

<td>Reference No.</td>

<td>-</td>

</tr>

</table>

`

})}

${TAESF.UI.Card.render({

title:"Strategic Activities",

subtitle:"Planning Activities",

body: `

<div class="workspace-toolbar">

${TAESF.UI.Button.render({

    id:"btnAddActivity",

    label:"Add Activity",

    type:"btn-primary"

})}

</div>

<hr>

${TAESF.UI.CollapsiblePanel.render({

    id:"technicalActivities",

    title:"Technical Competencies",

    count:0,

    expanded:true,

    body:""

})}

${TAESF.UI.CollapsiblePanel.render({

    id:"coreActivities",

    title:"Core Competencies",

    count:0,

    expanded:false,

    body:""

})}

${TAESF.UI.CollapsiblePanel.render({

    id:"leadershipActivities",

    title:"Leadership / Management",

    count:0,

    expanded:false,

    body:""

})}

${TAESF.UI.CollapsiblePanel.render({

    id:"mandatoryActivities",

    title:"Mandatory / Statutory",

    count:0,

    expanded:false,

    body:""

})}

${TAESF.UI.CollapsiblePanel.render({

    id:"officeActivities",

    title:"Office / Other Requirements",

    count:0,

    expanded:false,

    body:""

})}

`

})}

`,

    summary: `

<div class="grid grid-4">

${TAESF.UI.Card.render({

    title:"Activities",

    body:`<span id="summaryActivities">0</span>`

})}

${TAESF.UI.Card.render({

title:"Estimated Budget",

body:`<span id="summaryBudget">₱0.00</span>`

})}

${TAESF.UI.Card.render({

title:"Completed",

body:`<span id="summaryCompleted">0</span>`

})}

${TAESF.UI.Card.render({

title:"Deferred",

body:`<span id="summaryDeferred">0</span>`

})}

</div>

`,

    actions: `

${TAESF.UI.Button.render({

id:"btnSavePlan",

label:"Save Draft",

type:"btn-primary"

})}

${TAESF.UI.Button.render({

id:"btnApprovePlan",

label:"Approve",

type:"btn-success"

})}

${TAESF.UI.Button.render({

id:"btnCancelPlan",

label:"Cancel",

type:"btn-secondary"

})}

`

})}

<div id="wdpModalContainer"></div>

`;

}

return Object.freeze({

    render

});

})();