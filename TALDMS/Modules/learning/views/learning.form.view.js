"use strict";

/**
 * ==========================================================
 * TALDMS
 * ----------------------------------------------------------
 * Learning Form View
 *
 * Feature:
 * LRN-F002
 *
 * Responsibility
 * - Render Learning Entry Form
 * - Used by Add Learning
 * - Reused by Edit Learning
 * ==========================================================
 */

TAESF.Modules = TAESF.Modules || {};
TAESF.Modules.Learning = TAESF.Modules.Learning || {};
TAESF.Modules.Learning.Views = TAESF.Modules.Learning.Views || {};

TAESF.Modules.Learning.Views.Form = (() => {

    function render(learning = {}) {

        return TAESF.UI.Modal.render({

            title: "Learning Record",

            size: "large",

            body: `

<form id="learningForm" class="form">

<h3>Learning Information</h3>

${TAESF.UI.Form.textField({

    id: "txtEmployeeNumber",

    label: "Employee Number",

    value: learning.employeeNumber ?? "",

    placeholder: "Official TESDA Employee Number",

    required: true

})}

${TAESF.UI.Form.textField({

    id: "txtTrainingTitle",

    label: "Training Title",

    value: learning.trainingTitle ?? "",

    required: true

})}

${TAESF.UI.Form.textField({

    id: "txtProvider",

    label: "Training Provider",

    value: learning.provider ?? "",

    required: true

})}

${TAESF.UI.Form.selectField({

    id: "txtTrainingType",

    label: "Training Type",

    value: learning.trainingType ?? "",

    items: [

        { value: "TECHNICAL", label: "Technical" },

        { value: "SUPERVISORY", label: "Supervisory" },

        { value: "MANAGERIAL", label: "Managerial" },

        { value: "LEADERSHIP", label: "Leadership" },

        { value: "SEMINAR", label: "Seminar" },

        { value: "WORKSHOP", label: "Workshop" },

        { value: "WEBINAR", label: "Webinar" },

        { value: "OTHER", label: "Other" }

    ]

})}

${TAESF.UI.Form.numberField({

    id: "txtTrainingYear",

    label: "Training Year",

    value: learning.trainingYear ?? ""

})}

${TAESF.UI.Form.selectField({

    id: "txtLearningSource",

    label: "Learning Source",

    value: learning.learningSource ?? "",

    items: [

        { value: "HISTORICAL", label: "Historical Record" },

        { value: "WDP", label: "Annual WDP" },

        { value: "MANDATORY", label: "Mandatory Training" },

        { value: "EXTERNAL", label: "External Training" },

        { value: "SCHOLARSHIP", label: "Scholarship" },

        { value: "OTHER", label: "Other" }

    ]

})}

<hr>

<h3>Training Schedule</h3>

${TAESF.UI.Form.dateField({

    id: "txtStartDate",

    label: "Start Date",

    value: learning.startDate ?? ""

})}

${TAESF.UI.Form.dateField({

    id: "txtEndDate",

    label: "End Date",

    value: learning.endDate ?? ""

})}

${TAESF.UI.Form.selectField({

    id: "txtAttendanceType",

    label: "Attendance Type",

    value: learning.attendanceType ?? "WHOLE_DAY",

    items: [

        { value: "WHOLE_DAY", label: "Whole Day" },

        { value: "HALF_DAY", label: "Half Day" },

        { value: "CUSTOM", label: "Custom Hours" }

    ]

})}

${TAESF.UI.Form.numberField({

    id: "txtDuration",

    label: "Duration (Days)",

    value: "",

    readonly: true

})}

${TAESF.UI.Form.numberField({

    id: "txtTrainingHours",

    label: "Training Hours",

    value: learning.trainingHours ?? "",

    readonly: true

})}

<hr>

<h3>Funding Information</h3>

${TAESF.UI.Form.textField({

    id: "txtFundingSource",

    label: "Funding Source",

    value: learning.fundingSource ?? ""

})}

${TAESF.UI.Form.textArea({

    id: "txtRemarks",

    label: "Remarks",

    value: learning.remarks ?? ""

})}

</form>

`,

            footer: `

${TAESF.UI.Button.render({

    id: "btnSaveLearning",

    label: "Save",

    type: "btn-success"

})}

${TAESF.UI.Button.render({

    id: "btnCancelLearning",

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