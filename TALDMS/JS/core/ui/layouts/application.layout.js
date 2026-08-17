"use strict";

/**
 * ==========================================================
 * TAESF Framework
 * ----------------------------------------------------------
 * Application Layout
 *
 * Responsibility
 * - Render TALDMS Application Shell
 * - Compose the permanent application layout
 * - No business logic
 * ==========================================================
 */

TAESF.UI = TAESF.UI || {};

TAESF.UI.ApplicationLayout = (() => {

    function render() {

        return `

${TAESF.UI.Dashboard.render({

    header:

        TAESF.UI.Header.render({

            organization:

                "TESDA Albay Provincial Office",

            application:

                "Training and Learning Development Management System"

        }),

    sidebar:

        TAESF.UI.Sidebar.render(),

    breadcrumb:

        TAESF.UI.Breadcrumb.render([

            "Home"

        ]),

    content:`

<div id="applicationWorkspace">

    <div class="application-welcome">

        <h1>

            Welcome to TALDMS

        </h1>

        <h2>

            Training and Learning Development Management System

        </h2>

        <hr>

        <p>

            This is the TALDMS Application Shell.

        </p>

        <p>

            Business modules will load here.

        </p>

    </div>

</div>

`,

    footer:`

<div id="applicationStatusBar">

Ready.

</div>

`

})}

`;

    }

    return Object.freeze({

        render

    });

})();