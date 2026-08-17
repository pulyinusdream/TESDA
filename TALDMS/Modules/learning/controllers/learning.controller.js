"use strict";

/**
 * ==========================================================
 * TALDMS
 * ----------------------------------------------------------
 * Learning Controller
 *
 * Feature:
 * LRN-F003
 *
 * Responsibility
 * - Coordinate Business Operations
 * - Handle UI Events
 * - Prepare View Models
 * ==========================================================
 */

TAESF.Modules = TAESF.Modules || {};
TAESF.Modules.Learning = TAESF.Modules.Learning || {};

TAESF.Modules.Learning.Controller = (() => {
    let searchKeyword = "";

    /**
     * ======================================================
     * CRUD
     * ======================================================
     */

    function create(learning) {

        return TAESF.Modules.Learning.Service.create(
            learning
        );

    }

    function update(learningId, learning) {

        return TAESF.Modules.Learning.Service.update(
            learningId,
            learning
        );

    }

    function remove(learningId) {

        return TAESF.Modules.Learning.Service.remove(
            learningId
        );

    }

    function getAll() {

        return TAESF.Modules.Learning.Service.getAll();

    }

    function getById(learningId) {

        return TAESF.Modules.Learning.Service.getById(
            learningId
        );

    }

    /**
     * ======================================================
     * View Model
     * ======================================================
     */

    function getTableRows() {

        const keyword = searchKeyword;

const records =

    getAll().filter(record =>

        record.learningId.toLowerCase().includes(keyword) ||

        record.employeeNumber.toLowerCase().includes(keyword) ||

        record.trainingTitle.toLowerCase().includes(keyword) ||

        record.provider.toLowerCase().includes(keyword) ||

        record.trainingType.toLowerCase().includes(keyword) ||

        String(record.trainingYear).includes(keyword) ||

        record.learningSource.toLowerCase().includes(keyword)

    );

        if (records.length === 0) {

            return [[

                "-",

                "No Learning Records",

                "-",

                "-",

                "-",

                TAESF.UI.Badge.render(

                    "Empty",

                    "badge-warning"

                ),

                "-"

            ]];

        }

        return records.map(record => [

            record.learningId,

            record.trainingTitle,

            record.employeeNumber,

            record.provider,

            TAESF.UI.Badge.render(

                record.trainingStatus,

                record.trainingStatus === "Completed"

                    ? "badge-success"

                    : "badge-warning"

            ),

            `

${TAESF.UI.Button.render({

    id: `btnEdit_${record.learningId}`,

    label: "Edit",

    type: "btn-primary"

})}

${TAESF.UI.Button.render({

    id: `btnDelete_${record.learningId}`,

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

    bindSearchEvents();

}

    function bindEvents() {

    const addButton =

        document.getElementById(

            "btnAddLearning"

        );

    if (addButton) {

        addButton.addEventListener(

            "click",

            openAddForm

        );

    }

    bindTableEvents();

}

function bindSearchEvents() {

    const textbox =

        document.getElementById(

            "txtSearchLearning"

        );

    if (!textbox) {

        return;

    }

    textbox.addEventListener(

        "input",

        function () {

            searchKeyword =

                this.value.toLowerCase();

            refreshTable();

        }

    );

}
    function bindTableEvents() {

    getAll().forEach(record => {

        const editButton =

            document.getElementById(

                `btnEdit_${record.learningId}`

            );

        if (editButton) {

            editButton.addEventListener(

                "click",

                () => editLearning(

                    record.learningId

                )

            );

        }

        const deleteButton =

            document.getElementById(

                `btnDelete_${record.learningId}`

            );

        if (deleteButton) {

            deleteButton.addEventListener(

                "click",

                () => deleteLearning(

                    record.learningId

                )

            );

        }

    });

}
    /**
     * ======================================================
     * Add Learning
     * ======================================================
     */

    function openAddForm() {

        const container =

            document.getElementById(

                "learningModalContainer"

            );

        container.innerHTML =

            TAESF.Modules.Learning.Views.Form.render();

        bindFormEvents();

    }

    function bindFormEvents() {

        document

            .getElementById(

                "btnSaveLearning"

            )

            ?.addEventListener(

                "click",

                saveLearning

            );

        document
        .getElementById("btnCancelLearning")
        ?.addEventListener(
            "click",
            closeForm
        );

        bindCalculationEvents();

        }

        function bindUpdateEvents(learningId) {

            document
                .getElementById("btnSaveLearning")
                ?.addEventListener(
                    "click",
                    () => updateLearning(learningId)
                );

            document
                .getElementById("btnCancelLearning")
                ?.addEventListener(
                    "click",
                    closeForm
                );

            bindCalculationEvents();

        }

        function bindCalculationEvents() {

        const startDate =
            document.getElementById("txtStartDate");

        const endDate =
            document.getElementById("txtEndDate");

        const attendance =
            document.getElementById("txtAttendanceType");

        const hours =
            document.getElementById("txtTrainingHours");

        startDate?.addEventListener(
            "change",
            calculateTraining
        );

        endDate?.addEventListener(
            "change",
            calculateTraining
        );

        attendance?.addEventListener(
            "change",
            calculateTraining
        );

        hours?.addEventListener(
            "input",
            calculateTraining
        );

    }
function calculateTraining() {

    const startDate =
        document.getElementById("txtStartDate").value;

    const endDate =
        document.getElementById("txtEndDate").value;

    const attendance =
        document.getElementById("txtAttendanceType").value;

    const durationField =
        document.getElementById("txtDuration");

    const hoursField =
        document.getElementById("txtTrainingHours");

    let customHours = Number(hoursField.value) || 0;

    const duration =
        TAESF.Utilities.Calculation.calculateDuration(

            startDate,

            endDate

        );

    durationField.value = duration;

    if (attendance === "CUSTOM") {

        hoursField.readOnly = false;

        return;

    }

    hoursField.readOnly = true;

    hoursField.value =

        TAESF.Utilities.Calculation.calculateTrainingHours(

            startDate,

            endDate,

            attendance,

            customHours

        );

}
    function saveLearning() {

        const learning =
            TAESF.Modules.Learning.Model.create();

        learning.learningId =
            generateLearningNumber();

        learning.employeeNumber =
            document.getElementById("txtEmployeeNumber").value.trim();

        learning.trainingTitle =
            document.getElementById("txtTrainingTitle").value.trim();

        learning.provider =
            document.getElementById("txtProvider").value.trim();

        learning.trainingType =
    document.getElementById("txtTrainingType").value;

        learning.trainingYear =
            document.getElementById("txtTrainingYear").value.trim();

        learning.startDate =
            document.getElementById("txtStartDate").value;

        learning.endDate =
            document.getElementById("txtEndDate").value;

        learning.attendanceType =
            document.getElementById("txtAttendanceType").value;

        learning.trainingHours =
            Number(
                document.getElementById("txtTrainingHours").value
            );

        learning.learningSource =
            document.getElementById("txtLearningSource").value;

        learning.fundingSource =
            document.getElementById("txtFundingSource").value.trim();

        learning.remarks =
            document.getElementById("txtRemarks").value.trim();

        const result = create(learning);

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
        function editLearning(learningId) {

        const learning = getById(learningId);

        if (!learning) {

            alert("Learning record not found.");

            return;

        }

        const container =
            document.getElementById(
                "learningModalContainer"
            );

        container.innerHTML =
            TAESF.Modules.Learning.Views.Form.render(
                learning
            );

        bindUpdateEvents(learningId);

    }
    function updateLearning(learningId) {

    const learning =
        TAESF.Modules.Learning.Model.create();

    learning.learningId = learningId;

    learning.employeeNumber =
        document.getElementById("txtEmployeeNumber").value.trim();

    learning.trainingTitle =
        document.getElementById("txtTrainingTitle").value.trim();

    learning.provider =
        document.getElementById("txtProvider").value.trim();

    learning.trainingType =
        document.getElementById("txtTrainingType").value;

    learning.trainingYear =
        Number(document.getElementById("txtTrainingYear").value);

    learning.learningSource =
        document.getElementById("txtLearningSource").value;

    learning.startDate =
        document.getElementById("txtStartDate").value;

    learning.endDate =
        document.getElementById("txtEndDate").value;

    learning.attendanceType =
        document.getElementById("txtAttendanceType").value;

    learning.trainingHours =
        Number(document.getElementById("txtTrainingHours").value);

    learning.fundingSource =
        document.getElementById("txtFundingSource").value.trim();

    learning.remarks =
        document.getElementById("txtRemarks").value.trim();

    const result =
        update(learningId, learning);

    if (!result.success) {

        alert(result.message);

        return;

    }

    alert(result.message);

    closeForm();

    refreshList();

}
function deleteLearning(learningId) {

    const learning = getById(learningId);

    if (!learning) {

        alert("Learning record not found.");

        return;

    }

    const confirmed = confirm(

`Delete Learning Record?

Learning Number : ${learning.learningId}

Training Title : ${learning.trainingTitle}

Employee Number : ${learning.employeeNumber}

This action cannot be undone.`

    );

    if (!confirmed) {

        return;

    }

    const result = remove(learningId);

    if (!result.success) {

        alert(result.message);

        return;

    }

    alert(result.message);

    refreshList();

}

    /**
     * ======================================================
     * Number Generator
     * ======================================================
     */

    function generateLearningNumber() {

        const today = new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        const sequence =
            String(

                getAll().length + 1

            ).padStart(6, "0");

        return `LRN-${year}-${month}-${sequence}`;

    }

    /**
     * ======================================================
     * Utilities
     * ======================================================
     */


    function refreshList() {

        document.getElementById("app").innerHTML =

            TAESF.Modules.Learning.Views.List.render();

        initialize();

    }

    function refreshTable() {

    const tableContainer =

        document.getElementById(

            "learningTableContainer"

        );

    if (!tableContainer) {

        return;

    }

    tableContainer.innerHTML =

        TAESF.UI.Table.render(

            [

                "Learning No.",

                "Training Title",

                "Employee No.",

                "Provider",

                "Status",

                "Actions"

            ],

            getTableRows()

        );

    bindTableEvents();

}
    function closeForm() {

        document.getElementById(

            "learningModalContainer"

        ).innerHTML = "";

    }

    return Object.freeze({

    create,

    update,

    remove,

    getAll,

    getById,

    getTableRows,

    initialize,

    openAddForm,

    saveLearning,

    editLearning,

    updateLearning,

    deleteLearning,

    refreshList,

    closeForm

});

})();