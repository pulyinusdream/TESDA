/**
 * ============================================================
 * TAESF Enterprise Framework
 * AIMS RIS - Supply View
 * Version 2.0.0
 * Enterprise Presentation Layer
 * ============================================================
 */

(function (global) {

"use strict";

/* ============================================================
 * Namespace
 * ============================================================
 */

global.TAESF = global.TAESF || {};
global.TAESF.Applications = global.TAESF.Applications || {};
global.TAESF.Applications.AIMS =
    global.TAESF.Applications.AIMS || {};
global.TAESF.Applications.AIMS.RIS =
    global.TAESF.Applications.AIMS.RIS || {};
global.TAESF.Applications.AIMS.RIS.Features =
    global.TAESF.Applications.AIMS.RIS.Features || {};
global.TAESF.Applications.AIMS.RIS.Features.Supply =
    global.TAESF.Applications.AIMS.RIS.Features.Supply || {};

/* ============================================================
 * Supply View
 * ============================================================
 */

class SupplyView {

    constructor() {

        this.queue = [];

        this.selectedRequest = null;

        this.loading = false;

        this.error = null;

        this.filters = {};

    }

    /* ========================================================
     * State Management
     * ======================================================== */

    loadQueue(queue = []) {

        this.queue = Array.isArray(queue)
            ? [...queue]
            : [];

        return this;

    }

    refresh(queue = []) {

        return this.loadQueue(queue);

    }

    clear() {

        this.queue = [];

        this.selectedRequest = null;

        this.loading = false;

        this.error = null;

        this.filters = {};

        return this;

    }

    selectRequest(request) {

        this.selectedRequest = request || null;

        return this;

    }

    getSelectedRequest() {

        return this.selectedRequest;

    }

    updateRow(updatedRequest) {

        if (!updatedRequest) {

            return this;

        }

        const index =
            this.queue.findIndex(item =>
                item.risNo === updatedRequest.risNo
            );

        if (index >= 0) {

            this.queue[index] = updatedRequest;

        }

        return this;

    }

    removeRow(risNo) {

        this.queue =
            this.queue.filter(item =>
                item.risNo !== risNo
            );

        return this;

    }

    setLoading(flag = true) {

        this.loading = !!flag;

        return this;

    }

    setError(error = null) {

        this.error = error;

        return this;

    }

    setFilter(name, value) {

        this.filters[name] = value;

        return this;

    }

    getQueue() {

        return this.queue;

    }

    /* ========================================================
     * Utility Methods
     * ======================================================== */

    getContainer(id) {

        const container =
            document.getElementById(id);

        if (!container) {

            console.error(
                "SupplyView: Container not found ->",
                id
            );

            return null;

        }

        return container;

    }

    escape(value) {

        if (value === undefined || value === null) {

            return "";

        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");

    }

    getItemCount(request) {

        if (!request) {

            return 0;

        }

        if (Array.isArray(request.items)) {

            return request.items.length;

        }

        return 0;

    }

    showContainer(container) {

        if (container) {

            container.style.display = "block";

        }

        return this;

    }

    hideContainer(container) {

        if (container) {

            container.style.display = "none";

        }

        return this;

    }

    renderEmptyState(container, message) {

        if (!container) {

            return this;

        }

        container.innerHTML = `

            <div
                style="
                    padding:20px;
                    text-align:center;
                    color:#64748b;
                    font-style:italic;
                ">

                ${this.escape(message)}

            </div>

        `;

        return this;

    }

    renderErrorState(container, message) {

        if (!container) {

            return this;

        }

        container.innerHTML = `

            <div
                style="
                    padding:20px;
                    color:#b91c1c;
                    text-align:center;
                    background:#fef2f2;
                    border:1px solid #fecaca;
                    border-radius:6px;
                ">

                ${this.escape(message)}

            </div>

        `;

        return this;

    }

    /* ========================================================
     * Rendering
     * ======================================================== */
        renderPendingQueue(containerId = "pendingRisContainer") {

        const container =
            this.getContainer(containerId);

        if (!container) {

            return this;

        }

        if (this.error) {

            return this.renderErrorState(
                container,
                this.error
            );

        }

        if (this.loading) {

            container.innerHTML = `

                <div
                    style="
                        padding:20px;
                        text-align:center;
                        color:#64748b;
                    ">

                    Loading pending RIS requests...

                </div>

            `;

            return this;

        }

        if (!this.queue || this.queue.length === 0) {

            this.hideContainer(container);

            return this.renderEmptyState(
                container,
                "No pending RIS requests."
            );

        }

        this.showContainer(container);

        let html = `

            <h3
                style="
                    margin-top:0;
                    color:#b45309;
                ">

                Pending RIS Requests
                (${this.queue.length})

            </h3>

            <table class="data-table">

                <thead>

                    <tr>

                        <th>RIS No</th>

                        <th>Date</th>

                        <th>Requester</th>

                        <th>Status</th>

                        <th>Items</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

        `;

        this.queue.forEach(request => {

            const risNo =
                this.escape(request.risNo);

            const date =
                this.escape(request.date);

            const requester =
                this.escape(request.requestedBy);

            const status =
                this.escape(request.status);

            const itemCount =
                this.getItemCount(request);

            let actionButtons = `

                <button
                    class="action-btn"
                    onclick="viewRIS('${risNo}')">

                    👁 View

                </button>

            `;

            switch (request.status) {

                case "Submitted":

                    actionButtons += `

                        <button
                            class="action-btn"
                            onclick="approveRIS('${risNo}')">

                            ✅ Approve

                        </button>

                        <button
                            class="delete-btn"
                            onclick="rejectRIS('${risNo}')">

                            ❌ Reject

                        </button>

                    `;

                    break;

                case "Approved":

                    actionButtons += `

                        <button
                            class="action-btn"
                            style="background:#2563eb;"
                            onclick="issueRIS('${risNo}')">

                            📦 Issue

                        </button>

                    `;

                    break;

                case "Reserved":

                    actionButtons += `

                        <button
                            class="action-btn"
                            style="background:#2563eb;"
                            onclick="issueRIS('${risNo}')">

                            📦 Issue

                        </button>

                    `;

                    break;

                default:

                    break;

            }

            html += `

                <tr>

                    <td>${risNo}</td>

                    <td>${date}</td>

                    <td>${requester}</td>

                    <td>${status}</td>

                    <td>${itemCount}</td>

                    <td>

                        ${actionButtons}

                    </td>

                </tr>

            `;

        });

        html += `

                </tbody>

            </table>

        `;

        container.innerHTML = html;

        return this;

    }
        renderOverview(headers = []) {

        const pending =
            headers.filter(r =>
                r.status === "Submitted"
            ).length;

        const approved =
            headers.filter(r =>
                r.status === "Approved"
            ).length;

        const rejected =
            headers.filter(r =>
                r.status === "Rejected"
            ).length;

        const issued =
            headers.filter(r =>
                r.status === "Issued"
            ).length;

        const cards = {

            ovPending: pending,
            ovApproved: approved,
            ovRejected: rejected,
            ovIssued: issued

        };

        Object.entries(cards).forEach(([id, value]) => {

            const element =
                document.getElementById(id);

            if (element) {

                element.innerText = value;

            }

        });

        return this;

    }

    renderRecentActivity(headers = []) {

        const activityTable =
            document.querySelector(
                "#supplyRIS table.data-table tbody"
            );

        if (!activityTable) {

            return this;

        }

        const latest =
            [...headers]
            .sort((a, b) =>

                (b.date || "")
                    .localeCompare(a.date || "") ||

                (b.risNo || "")
                    .localeCompare(a.risNo || "")

            )
            .slice(0, 10);

        if (latest.length === 0) {

            activityTable.innerHTML = `

                <tr>

                    <td
                        colspan="3"
                        style="
                            text-align:center;
                            color:#94a3b8;
                            padding:20px;
                        ">

                        No recent activity.

                    </td>

                </tr>

            `;

            return this;

        }

        activityTable.innerHTML = "";

        latest.forEach(request => {

            activityTable.innerHTML += `

                <tr>

                    <td>

                        ${this.escape(request.risNo)}

                    </td>

                    <td>

                        ${this.escape(request.date)}

                    </td>

                    <td>

                        ${this.escape(request.status)}

                    </td>

                </tr>

            `;

        });

        return this;

    }

}

/* ============================================================
 * Export
 * ============================================================
 */

global
.TAESF
.Applications
.AIMS
.RIS
.Features
.Supply
.SupplyView =
SupplyView;

})(window);