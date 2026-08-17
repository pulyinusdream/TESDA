"use strict";

/**
 * ==========================================================
 * TAEDS Enterprise Button System
 * ==========================================================
 * Supports:
 *  - id
 *  - type
 *  - label
 *  - onclick
 *  - className
 *  - disabled
 *  - icon
 *  - title
 * ==========================================================
 */

TAESF.UI = TAESF.UI || {};

TAESF.UI.Button = (() => {

    function render(options = {}) {

        return `

<button

id="${options.id ?? ""}"

class="btn ${options.type ?? "btn-primary"} ${options.className ?? ""}"

${options.disabled ? "disabled" : ""}

${options.onclick ? `onclick="${options.onclick}"` : ""}

${options.title ? `title="${options.title}"` : ""}

>

${options.icon ?? ""}

${options.label ?? "Button"}

</button>

`;

    }

    return Object.freeze({

        render

    });

})();