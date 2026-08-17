"use strict";

NEXUS_RRMS.Modules.Risk.FormView = (() => {
    function setSelectOptions(selectId, values, labeler = (value) => value.replaceAll("_", " ")) {
        const select = document.getElementById(selectId);
        if (!select) return;
        select.innerHTML = `<option value="">Select...</option>` + values
            .map((value) => `<option value="${value}">${labeler(value)}</option>`)
            .join("");
    }

    function renderObjectiveTypeOptions() {
        const container = document.getElementById("objectiveTypes");
        if (!container) return;
        container.innerHTML = NEXUS_RRMS.Configuration.Constants.OBJECTIVE_TYPES
            .map((value) => `
                <label class="checkbox-option">
                    <input type="checkbox" name="objectiveTypes" value="${value}">
                    <span>${value.replaceAll("_", " ")}</span>
                </label>
            `)
            .join("");
    }

    function setObjectiveTypes(values) {
        const selected = new Set(
            (Array.isArray(values) ? values : [values].filter(Boolean))
                .map((value) => String(value || "").toUpperCase())
        );
        document.querySelectorAll('input[name="objectiveTypes"]').forEach((checkbox) => {
            checkbox.checked = selected.has(checkbox.value);
        });
    }

    function getObjectiveTypes() {
        return Array.from(document.querySelectorAll('input[name="objectiveTypes"]:checked'))
            .map((checkbox) => checkbox.value);
    }

    function initializeOptions() {
        const constants = NEXUS_RRMS.Configuration.Constants;
        setSelectOptions("recordType", constants.RECORD_TYPES);
        setSelectOptions("contextType", constants.CONTEXT_TYPES);
        setSelectOptions("riskProfile", constants.RISK_PROFILES);
        renderObjectiveTypeOptions();
        setSelectOptions("currentClassification", constants.CLASSIFICATIONS);
    }

    function reset() {
        const form = document.getElementById("riskForm");
        if (!form) return;
        form.reset();
        setObjectiveTypes([]);
        document.getElementById("editingRiskId").value = "";
        document.getElementById("formTitle").textContent = "Create Risk or Opportunity";
        document.getElementById("currentClassification").value = "EMERGING";
        document.getElementById("currentStatus").value = "DRAFT";
        document.getElementById("firstIdentifiedDate").value = new Date().toISOString().slice(0, 10);
        updateConditionalFields();
        updateRatingPreview();
        clearErrors();
    }

    function fill(record) {
        Object.entries(record).forEach(([key, value]) => {
            if (key === "objectiveTypes" || key === "objectiveType") return;
            const element = document.getElementById(key);
            if (element && value !== null && value !== undefined) {
                element.value = value;
            }
        });
        setObjectiveTypes(record.objectiveTypes || record.objectiveType || []);
        document.getElementById("editingRiskId").value = record.riskId;
        document.getElementById("formTitle").textContent = `Edit ${record.riskId}`;
        updateConditionalFields();
        updateRatingPreview();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function collect() {
        const form = document.getElementById("riskForm");
        const formData = new FormData(form);
        const result = Object.fromEntries(formData.entries());
        result.objectiveTypes = getObjectiveTypes();
        return result;
    }

    function updateConditionalFields() {
        const isRisk = document.getElementById("recordType").value !== "OPPORTUNITY";
        document.getElementById("riskFields").hidden = !isRisk;
        document.getElementById("opportunityFields").hidden = isRisk;
    }

    function updateRatingPreview() {
        const preview = document.getElementById("ratingPreview");
        if (!preview) return;
        if (document.getElementById("recordType").value === "OPPORTUNITY") {
            preview.textContent = "Opportunities are not numerically rated.";
            preview.className = "rating-preview opportunity";
            return;
        }
        try {
            const rating = NEXUS_RRMS.Utilities.RiskRating.calculate(
                document.getElementById("initialLikelihood").value,
                document.getElementById("initialConsequence").value
            );
            preview.textContent = `${rating.level.replaceAll("_", " ")} — ${rating.likelihood} × ${rating.consequence} = ${rating.score}`;
            preview.className = `rating-preview level-${rating.level.toLowerCase().replace("_", "-")}`;
        } catch (error) {
            preview.textContent = "Select Likelihood and Consequence to compute the rating.";
            preview.className = "rating-preview";
        }
    }

    function showErrors(errors) {
        const panel = document.getElementById("formErrors");
        panel.innerHTML = `<strong>Please correct the following:</strong><ul>${errors.map((error) => `<li>${error}</li>`).join("")}</ul>`;
        panel.hidden = false;
    }

    function clearErrors() {
        const panel = document.getElementById("formErrors");
        panel.hidden = true;
        panel.innerHTML = "";
    }

    return Object.freeze({
        initializeOptions,
        reset,
        fill,
        collect,
        updateConditionalFields,
        updateRatingPreview,
        showErrors,
        clearErrors
    });
})();
