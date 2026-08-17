"use strict";

/**
 * ==========================================================
 * Enterprise Information Card System
 * Framework Sprint F8.3
 * ==========================================================
 */

TAESF.UI = TAESF.UI || {};

TAESF.UI.Card = (() => {

    function render(options = {}) {

        return `

<div class="card">

    <div class="card-header">

        <div>

            <div class="card-title">

                ${options.title ?? ""}

            </div>

            <div class="card-subtitle">

                ${options.subtitle ?? ""}

            </div>

        </div>

    </div>

    <div class="card-body">

        ${options.body ?? ""}

    </div>

    ${options.footer ? `

    <div class="card-footer">

        ${options.footer}

    </div>

    ` : ""}

</div>

`;

    }

    return Object.freeze({

        render

    });

})();