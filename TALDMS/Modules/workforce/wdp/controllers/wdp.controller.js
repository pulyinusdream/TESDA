"use strict";
/**
 * ==========================================================
 * Temporary Development Plan
 * Remove after WDP Header Module is completed.
 * ==========================================================
 */

let currentPlan = {

    planId:

        "DEV-WDP-2025-000001",

    planningCycle:

        "2025-2027"

};
let editingActivityId = null;

function setCurrentPlan(

    plan

) {

    currentPlan = plan;

}

function openActivityForm(

    activity = null

) {

    const container =

        document.getElementById(

            "wdpModalContainer"

        );

    if (!container) {

        return;

    }
    editingActivityId =

    activity

        ? activity.activityId

        : null;
        
    container.innerHTML =

    TAESF.Modules.Workforce.WDP.Views.ActivityModal.render(

        activity

    );

    bindActivityEvents();

}
function bindActivityEvents() {

    document

        .getElementById(

            "btnCancelActivity"

        )

        ?.addEventListener(

            "click",

            closeActivityForm

        );

    document

        .getElementById(

            "btnSaveActivity"

        )

        ?.addEventListener(

            "click",

            saveActivity

        );

}
function closeActivityForm() {

    const container =

        document.getElementById(

            "wdpModalContainer"

        );

    if (!container) {

        return;

    }

    container.innerHTML = "";

}
function saveActivity() {

    const activity =

        TAESF.Modules.Workforce.WDP.ActivityModel.create({

            planId:

                currentPlan.wdpNumber,

            category:

                document.getElementById(

                    "txtCategory"

                ).value,
            
            strategicClassification:

                document.getElementById(

                    "txtStrategicClassification"

                ).value,

            trainingGap:

                document.getElementById(

                    "txtTrainingGap"

                ).value,

            trainingCourse:

                document.getElementById(

                    "txtTrainingCourse"

                ).value,

            startYear:Number(

                document.getElementById(

                    "txtStartYear"

                ).value

            ),

            endYear:Number(

                document.getElementById(

                    "txtEndYear"

                ).value

            ),

            implementationFrequency:

                document.getElementById(

                    "txtFrequency"

                ).value,

            estimatedDays:Number(

                document.getElementById(

                    "txtDays"

                ).value

            ),

            estimatedParticipants:Number(

                document.getElementById(

                    "txtParticipants"

                ).value

            ),

            estimatedBudget:Number(

                document.getElementById(

                    "txtBudget"

                ).value

            ),

            modeOfTraining:

                document.getElementById(

                    "txtMode"

                ).value,

            activitySource:

                document.getElementById(

                    "txtActivitySource"

                ).value,

            status:

                document.getElementById(

                    "txtStatus"

                ).value,

            remarks:

                document.getElementById(

                    "txtRemarks"

                ).value

        });
        console.log("Current Plan:", currentPlan);
        console.log("Activity:", activity);
        console.log("Plan ID:", activity.planId);   

    let result;

        if (

            editingActivityId

        ) {

            result =

                TAESF.Modules.Workforce.WDP.ActivityService.update(

                    editingActivityId,

                    activity

                );

        }

        else {

            result =

                TAESF.Modules.Workforce.WDP.ActivityService.create(

                    activity

                );

        }

        if (!result.success) {

            alert(

                result.message

            );

            return;

        }

        closeActivityForm();

        editingActivityId = null;

        refreshActivities();

    }
function refreshActivities() {

    renderActivities();

}
function renderActivities() {

    if (!currentPlan) {

        return;

    }

    const activities =

    TAESF.Modules.Workforce.WDP.ActivityService
        .getByPlanId(

            currentPlan.wdpNumber

        );
        
    renderCategory(

        "technicalActivities",

        "Technical Competencies",

        activities.filter(

            activity =>

                activity.strategicClassification === "TECHNICAL"

        )

    );

    renderCategory(

        "coreActivities",

        "Core Competencies",

        activities.filter(

            activity =>

                activity.strategicClassification === "CORE"

        )

    );

    renderCategory(

        "leadershipActivities",

        "Leadership / Management",

        activities.filter(

            activity =>

                activity.strategicClassification === "LEADERSHIP"

        )

    );

    renderCategory(

        "mandatoryActivities",

        "Mandatory / Statutory",

        activities.filter(

            activity =>

                activity.strategicClassification === "MANDATORY"

        )

    );

    renderCategory(

        "officeActivities",

        "Office / Other Requirements",

        activities.filter(

            activity =>

                activity.strategicClassification === "OFFICE"

        )

    );

    updateSummaryCards(

        activities

    );

}
function renderCategory(

    containerId,

    title,

    activities

) {

    const container =

        document.getElementById(

        `${containerId}-body`

        );

    if (!container) {

        return;

    }
    const header =

        document.getElementById(

            `${containerId}-header`

        );

    if (header) {

        const count =

            header.querySelector(

                ".collapsible-count"

            );

        if (count) {

            count.textContent =

                `(${activities.length})`;

        }

    }
    let html = `
    
<h3 class="activity-category-title">

${title}

</h3>

`;

    if (activities.length === 0) {

        html += `

<div class="empty-state">

No activities.

</div>

`;

        container.innerHTML = html;

        return;

    }

    html += `

<table class="table">

<thead>

<tr>

<th style="width:22%">

Training Gap

</th>

<th style="width:22%">

Training Intervention

</th>

<th style="width:12%">

Schedule

</th>

<th style="width:10%">

Participants

</th>

<th style="width:12%">

Budget

</th>

<th style="width:10%">

Status

</th>

<th style="width:12%">

Actions

</th>

</tr>

</thead>

<tbody>

`;

    activities.forEach(activity => {

        html += `

<tr>

<td>

${activity.trainingGap}

</td>

<td>

${activity.trainingCourse}

</td>

<td>

${activity.startYear}

-

${activity.endYear}

</td>

<td>

${activity.estimatedParticipants}

</td>

<td>

₱${Number(

    activity.estimatedBudget

).toLocaleString()}

</td>

<td>

${activity.status}

</td>

<td>

${TAESF.UI.ActionButtons.render({

    edit:true,

    delete:true,

    view:true,

    id:activity.activityId

})}

</td>

</tr>

`;

    });

    html += `

</tbody>

</table>

`;

    container.innerHTML = html;

}
function updateSummaryCards(

    activities

) {

    document.getElementById(

        "summaryActivities"

    ).textContent =

        activities.length;

    const totalBudget =

        activities.reduce(

            (

                total,

                activity

            ) =>

                total +

                Number(

                    activity.estimatedBudget

                ),

            0

        );

    document.getElementById(

        "summaryBudget"

    ).textContent =

        "₱" +

        totalBudget.toLocaleString();

    const completed =

        activities.filter(

            activity =>

                activity.status ===

                "COMPLETED"

        ).length;

    document.getElementById(

        "summaryCompleted"

    ).textContent =

        completed;

    const deferred =

        activities.filter(

            activity =>

                activity.status ===

                "DEFERRED"

        ).length;

    document.getElementById(

        "summaryDeferred"

    ).textContent =

        deferred;

}
function initializeWorkspace() {

    document

        .getElementById(

            "btnAddActivity"

        )

        ?.addEventListener(

            "click",

            openActivityForm

        );

    bindActivityTableEvents();

    renderActivities();

    TAESF.UI.CollapsiblePanel.initialize();

}
function bindActivityTableEvents() {

    document

        .addEventListener(

            "click",

            handleActivityTableClick

        );

}
function handleActivityTableClick(

    event

) {

    const button =

        event.target.closest(

            ".btn-action"

        );

    if (!button) {

        return;

    }

    const action =

        button.dataset.action;

    const activityId =

        button.dataset.id;

    switch (action) {

        case "view":

            viewActivity(

                activityId

            );

            break;

        case "edit":

            editActivity(

                activityId

            );

            break;

        case "delete":

            deleteActivity(

                activityId

            );

            break;

    }

}
function viewActivity(

    activityId

) {

    console.log(

        "View Activity:",

        activityId

    );

}
function editActivity(

    activityId

) {

    const activity =

        TAESF.Modules.Workforce.WDP.ActivityService
            .getByActivityId(

                activityId

            );

    if (!activity) {

        TAESF.UI.Dialog.show({

            title:"Activity Not Found",

            message:

                "The selected activity could not be located.",

            buttons:[

                {

                    id:"btnDialogClose",

                    label:"Close",

                    type:"btn-primary"

                }

            ]

        });

        return;

    }

    openActivityForm(

        activity

    );

}
function deleteActivity(

    activityId

) {

    TAESF.UI.Dialog.show({

        title:

            "Delete Strategic Activity",

        message:

            "Are you sure you want to permanently delete this activity?",

        buttons:[

            {

                id:"btnCancelDelete",

                label:"Cancel",

                type:"btn-secondary",

                onClick:() =>

                    TAESF.UI.Dialog.close()

            },

            {

                id:"btnConfirmDelete",

                label:"Delete",

                type:"btn-danger",

                onClick:() => {

                    const result =

                TAESF.Modules.Workforce.WDP.ActivityService.remove(

                    activityId

                        );

                    if (!result.success) {

                        TAESF.UI.Dialog.close();

                        TAESF.UI.Dialog.show({

                            title:"Delete Failed",

                            message:result.message,

                            buttons:[

            {

                id:"btnDeleteFailed",

                label:"Close",

                type:"btn-primary",

                onClick:() =>

                    TAESF.UI.Dialog.close()

            }

        ]

    });

    return;

}

TAESF.UI.Dialog.close();

refreshActivities();

                }

            }

        ]

    });

}