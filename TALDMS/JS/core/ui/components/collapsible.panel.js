"use strict";

/**
 * ==========================================================
 * TAESF Enterprise Framework
 * ----------------------------------------------------------
 * Collapsible Panel
 *
 * Framework Sprint:
 * F2.6
 *
 * Responsibility
 * - Reusable collapsible section
 * - Activity groups
 * - Dashboard widgets
 * - Reports
 *
 * No Business Logic
 * ==========================================================
 */

TAESF.UI = TAESF.UI || {};

TAESF.UI.CollapsiblePanel = (() => {

    function render({

        id = "",

        title = "",

        count = 0,

        expanded = false,

        body = ""

    }) {

        return `

<div class="collapsible-panel">

    <div
        class="collapsible-header"
        id="${id}-header"
        data-target="${id}-body">

        <span class="collapsible-icon">

            ${expanded ? "▼" : "▶"}

        </span>

        <span class="collapsible-title">

            ${title}

        </span>

        <span class="collapsible-count">

            (${count})

        </span>

    </div>

    <div

        id="${id}-body"

        class="collapsible-body"

        style="display:${expanded ? "block" : "none"};">

        ${body}

    </div>

</div>

`;

    }

    function initialize() {

    document

        .querySelectorAll(

            ".collapsible-header"

        )

        .forEach(header => {

            header.removeEventListener(

                "click",

                header.__toggleHandler

            );

            header.__toggleHandler = () => {

                toggle(

                    header

                );

            };

            header.addEventListener(

                "click",

                header.__toggleHandler

            );

        });

}

function toggle(header) {

    const body =

        document.getElementById(

            header.dataset.target

        );

    if (!body) {

        return;

    }

    const icon =

        header.querySelector(

            ".collapsible-icon"

        );

    const expanded =

        body.style.display !== "none";

        if (expanded){

        body.style.display="none";

        }else{

            body.style.display="block";

        }

    icon.textContent =

        expanded

            ? "▶"

            : "▼";

    body.classList.toggle(

    "expanded",

    !expanded

    );

}

return Object.freeze({

    render,

    initialize

});

})();