"use strict";

/**
 * ==========================================================
 * TAEDS Enterprise Badge System
 * ==========================================================
 */

TAESF.UI = TAESF.UI || {};

TAESF.UI.Badge = (() => {

    function render(label, type = "badge-secondary") {

        return `

<span class="badge ${type}">

${label}

</span>

`;

    }

    return Object.freeze({

        render

    });

})();