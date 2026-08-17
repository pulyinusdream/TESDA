"use strict";

NEXUS_RRMS.Modules.Risk.ListView = (() => {
    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function badge(label, variant = "neutral") {
        return `<span class="badge badge-${variant}">${escapeHtml(label)}</span>`;
    }

    function levelVariant(level) {
        return ({ LOW: "low", MEDIUM: "medium", HIGH: "high", VERY_HIGH: "very-high" })[level] || "neutral";
    }

    function render(records) {
        const body = document.getElementById("riskTableBody");
        if (!body) return;

        if (records.length === 0) {
            body.innerHTML = `<tr><td colspan="8" class="empty-state">No risk or opportunity records yet. Create the first permanent registry record.</td></tr>`;
            return;
        }

        body.innerHTML = records.map((record) => {
            const statement = record.recordType === "RISK" ? record.riskStatement : record.opportunityStatement;
            const rating = record.recordType === "RISK"
                ? badge(`${record.initialLevel} (${record.initialScore})`, levelVariant(record.initialLevel))
                : badge("Not Rated", "opportunity");

            return `<tr>
                <td><strong>${escapeHtml(record.riskId)}</strong><br><small>${escapeHtml(record.firstIdentifiedYear)}</small></td>
                <td>${badge(record.recordType, record.recordType === "RISK" ? "risk" : "opportunity")}</td>
                <td><strong>${escapeHtml(record.issueTitle)}</strong><br><small>${escapeHtml(statement)}</small></td>
                <td>${escapeHtml(record.processName)}</td>
                <td>${escapeHtml(record.riskOwner)}</td>
                <td>${rating}</td>
                <td>${badge(record.currentClassification.replaceAll("_", " "), "classification")}</td>
                <td class="actions">
                    <button class="btn btn-secondary btn-sm" data-action="edit" data-id="${escapeHtml(record.riskId)}">Edit</button>
                    <button class="btn btn-danger btn-sm" data-action="remove" data-id="${escapeHtml(record.riskId)}">Remove Draft</button>
                </td>
            </tr>`;
        }).join("");
    }

    return Object.freeze({ render });
})();
