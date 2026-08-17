"use strict";

NEXUS_RRMS.Modules.Risk.Controller = (() => {
    const service = NEXUS_RRMS.Modules.Risk.Service;
    const formView = NEXUS_RRMS.Modules.Risk.FormView;
    const listView = NEXUS_RRMS.Modules.Risk.ListView;

    function initialize() {
        formView.initializeOptions();
        bindEvents();
        formView.reset();
        refresh();
    }

    function bindEvents() {
        document.getElementById("riskForm").addEventListener("submit", handleSubmit);
        document.getElementById("btnResetForm").addEventListener("click", () => formView.reset());
        document.getElementById("recordType").addEventListener("change", () => {
            formView.updateConditionalFields();
            formView.updateRatingPreview();
        });
        ["initialLikelihood", "initialConsequence"].forEach((id) => {
            document.getElementById(id).addEventListener("change", formView.updateRatingPreview);
        });
        document.getElementById("riskSearch").addEventListener("input", refresh);
        document.getElementById("riskTableBody").addEventListener("click", handleTableAction);
    }

    function handleSubmit(event) {
        event.preventDefault();
        formView.clearErrors();
        const payload = formView.collect();
        const editingRiskId = document.getElementById("editingRiskId").value;
        const result = editingRiskId
            ? service.update(editingRiskId, payload)
            : service.create(payload);

        if (!result.success) {
            formView.showErrors(result.errors);
            return;
        }

        notify(editingRiskId ? "Risk record updated." : `Risk record ${result.record.riskId} created.`, "success");
        formView.reset();
        refresh();
    }

    function handleTableAction(event) {
        const button = event.target.closest("button[data-action]");
        if (!button) return;
        const riskId = button.dataset.id;
        if (button.dataset.action === "edit") {
            const record = service.getById(riskId);
            if (record) formView.fill(record);
            return;
        }
        if (button.dataset.action === "remove") {
            if (!window.confirm(`Remove unsubmitted Draft ${riskId}?`)) return;
            const result = service.removeDraft(riskId);
            if (!result.success) {
                notify(result.errors.join(" "), "error");
                return;
            }
            notify("Draft record removed.", "success");
            refresh();
        }
    }

    function refresh() {
        const query = String(document.getElementById("riskSearch")?.value || "").trim().toLowerCase();
        const records = service.getAll().filter((record) => {
            if (!query) return true;
            return [
                record.riskId,
                record.issueTitle,
                record.riskStatement,
                record.opportunityStatement,
                record.processName,
                record.riskOwner,
                record.currentClassification
            ].some((value) => String(value || "").toLowerCase().includes(query));
        });
        listView.render(records);
        renderDashboard();
    }

    function renderDashboard() {
        const summary = service.getDashboardSummary();
        Object.entries(summary).forEach(([key, value]) => {
            const element = document.querySelector(`[data-summary="${key}"]`);
            if (element) element.textContent = value;
        });
    }

    function notify(message, type) {
        const element = document.getElementById("toast");
        element.textContent = message;
        element.className = `toast toast-${type} show`;
        window.setTimeout(() => element.classList.remove("show"), 3500);
    }

    return Object.freeze({ initialize, refresh });
})();
