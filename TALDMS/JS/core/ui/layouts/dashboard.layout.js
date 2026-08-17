"use strict";

/**
 * ==========================================================
 * TAEDS Dashboard Layout
 * ==========================================================
 */

TAESF.UI = TAESF.UI || {};

TAESF.UI.Dashboard = (() => {

    function render(options = {}) {

        return `

<div class="dashboard">

    <aside class="dashboard-sidebar">

        ${options.sidebar ?? ""}

    </aside>

    <header class="dashboard-header">

        ${options.header ?? ""}

    </header>

    <main class="dashboard-content">

        <div class="dashboard-breadcrumb">

            ${options.breadcrumb ?? ""}

        </div>

        <div class="dashboard-main">

            ${options.content ?? ""}

        </div>

    </main>

</div>

`;

    }

    return Object.freeze({

        render

    });

})();