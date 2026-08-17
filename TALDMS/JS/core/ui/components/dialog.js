"use strict";

/**
 * ==========================================================
 * TAESF Enterprise Framework
 * ----------------------------------------------------------
 * Dialog Component
 *
 * Framework Sprint:
 * F2.8
 *
 * Responsibility
 * - Enterprise dialogs
 * - Confirmation dialogs
 * - Alerts
 * - Success
 * - Warning
 * - Error
 *
 * No Business Logic
 * ==========================================================
 */

TAESF.UI = TAESF.UI || {};

TAESF.UI.Dialog = (() => {

   function render({

    title = "",

    message = "",

    buttons = [],

    type = "default"

}) {

        return `

<div class="dialog-overlay">

    <div class="dialog-window">

        <div class="dialog-header">

            <h2>

                ${title}

            </h2>

        </div>

        <div class="dialog-body">

            ${message}

        </div>

        <div class="dialog-footer">

            ${buttons.map(button =>

                TAESF.UI.Button.render({

                    id:

                        button.id,

                    label:

                        button.label,

                    type:

                        button.type ?? "btn-secondary"

                })

            ).join("")}

        </div>

    </div>

</div>

`;

    }

function show({

    title = "",

    message = "",

    buttons = [],

    type = "default"

}) {

    close();

    document.body.insertAdjacentHTML(

        "beforeend",

        render({

            title,

            message,

            buttons,

            type

        })

    );

    buttons.forEach(button => {

        if (!button.onClick) {

            return;

        }

        document

            .getElementById(

                button.id

            )

            ?.addEventListener(

                "click",

                button.onClick

            );

    });

}

function close() {

    document

        .querySelector(

            ".dialog-overlay"

        )

        ?.remove();

}

return Object.freeze({

    render,

    show,

    close

});

})();