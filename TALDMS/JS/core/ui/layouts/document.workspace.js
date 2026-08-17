"use strict";

/**
 * ==========================================================
 * TAESF Enterprise Framework
 * ----------------------------------------------------------
 * Document Workspace
 *
 * Framework Sprint:
 * F2.6.2
 *
 * Responsibility
 * - Enterprise document layout
 * - Header
 * - Toolbar
 * - Tabs
 * - Scrollable Body
 * - Summary
 * - Sticky Footer
 *
 * No Business Logic
 * ==========================================================
 */

TAESF.UI = TAESF.UI || {};

TAESF.UI.DocumentWorkspace = (() => {

    function render({

        title = "",

        subtitle = "",

        badge = "",

        toolbar = "",

        tabs = "",

        body = "",

        summary = "",

        actions = ""

    }) {

        return `

<section class="document-workspace">

    <header class="document-header">

        <div class="document-header-content">

            <h1 class="document-title">

                ${title}

            </h1>

            ${subtitle ? `

            <div class="document-subtitle">

                ${subtitle}

            </div>

            ` : ""}

        </div>

        ${badge ? `

        <div class="document-badge">

            ${badge}

        </div>

        ` : ""}

    </header>

    ${toolbar ? `

    <section class="document-toolbar">

        ${toolbar}

    </section>

    ` : ""}

    ${tabs ? `

    <nav class="document-tabs">

        ${tabs}

    </nav>

    ` : ""}

    <main class="document-body">

        ${body}

    </main>

    ${summary ? `

    <section class="document-summary">

        ${summary}

    </section>

    ` : ""}

    ${actions ? `

    <footer class="document-actions">

        ${actions}

    </footer>

    ` : ""}

</section>

`;

    }

    return Object.freeze({

        render

    });

})();