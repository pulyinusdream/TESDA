"use strict";

/**
 * ==========================================================
 * TAEDS Enterprise Header
 * Framework Sprint F9.2
 * ==========================================================
 */

TAESF.UI = TAESF.UI || {};

TAESF.UI.Header = (() => {

    function render(options = {}) {

        return `

<div class="header-left">

    ${options.organization ?? "TESDA Albay"}

</div>

<div class="header-right">

    ${options.application ?? "Enterprise Dashboard"}

</div>

`;

    }

    return Object.freeze({

        render

    });

})();